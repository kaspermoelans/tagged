const express = require('express')
const { createServer } = require("http");
const { resolve } = require('path');
const { Server } = require("socket.io");

const app = express()
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(httpServer);

const loadMap = require('./mapLoader');
const { disconnect } = require('process');

const TICK_RATE = 30

const TILE_SIZE = 32

let players = []
let map2D
const inputsMap = {}
const skins = ["red_santa", "pink_santa", "banana", "tomato", "viking", "ninja", "pink_dude", "white_dude", "blue_dude"]
const boostNames = ["invisibility", "jumpboost", "speedboost"]
const boostDurations = [30 * 1000, 30 * 1000, 30 * 1000]
let boosts = []
let boostCountdown = 10 * 1000

const SPEED = {
    x: 5,
    y: 5,
    jump: -12
}

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.h + rect1.y > rect2.y
    );
}
  
function isCollidingWithMap(player) {
for (let row = 0; row < map2D.length; row++) {
    for (let col = 0; col < map2D[0].length; col++) {
    const tile = map2D[row][col];

    if (
        tile &&
        isColliding(
        {
            x: player.x,
            y: player.y,
            w: 32,
            h: 32,
        },
        {
            x: col * TILE_SIZE,
            y: row * TILE_SIZE,
            w: TILE_SIZE,
            h: TILE_SIZE,
        }
        )
    ) {
        return true;
    }
    }
}
return false;
}

function tick(delta) {
    for (let player of players) {
        const inputs = inputsMap[player.id]
        const previousY = player.y
        const previousX = player.x

        if (player.tagged === "no" || player.countdown <= 0) {
            player.y += player.speedY

            if (isCollidingWithMap(player)) {
                player.dashAvailable = true
                player.y = previousY
                if (inputs.up) {
                    if (player.boost === "jumpboost") {
                        player.speedY = player.speedJump * 1.5
                    } else {
                        player.speedY = player.speedJump
                    }
                }
                if (player.speedY > 5) {
                    player.speedY = 5
                }
            } else if (inputs.dash && player.dashAvailable) {
                if (inputs.left) {
                    player.x -= player.speedX * 20
                    player.dashAvailable = false
                }
                if (inputs.right) {
                    player.x += player.speedX * 20
                    player.dashAvailable = false
                }
            }

            player.speedY += 1

            if (inputs.left) {
                if (player.boost === "speedboost") {
                    player.x -= player.speedX * 1.5
                } else {
                    player.x -= player.speedX
                }
                player.direction = "left"
            } else if (inputs.right) {
                if (player.boost === "speedboost") {
                    player.x += player.speedX * 1.5
                } else {
                    player.x += player.speedX
                }
                player.direction = "right"
            }

            if (isCollidingWithMap(player)) {
                player.x = previousX
            }

            if (player.y > 4000) {
                player.x = 1910
                player.y = 2200
            }
        }

        if (inputs.switchSkin) {
            player.skinNumber += 1
            if (player.skinNumber > skins.length) {
                player.skinNumber = 0
            }
            player.skin = skins[player.skinNumber]
            inputsMap[player.id].switchSkin = false
        }

        if (player.tagged === "no") {
            for (let otherPlayer of players) {
                if (otherPlayer.tagged === "yes" && isColliding({x: player.x, y: player.y, w: 32, h: 32}, {x: otherPlayer.x, y: otherPlayer.y, w: 32, h: 32}) && otherPlayer !== player && otherPlayer.countdown <= 0) {
                    player.tagged = "yes"
                    otherPlayer.tagged = "no"
                    player.countdown = 10 * 1000
                }
            }
        }

        if (player.tagged === "yes" || player.countdown > 0) {
            player.countdown = player.countdown - delta
        }

        if (inputs.tagged) {
            player.tagged = "yes"
            player.countdown = 10 * 1000
            inputs.tagged = false
        }

        for (const boost of boosts) {
            if (isColliding({x: player.x, y: player.y, w: 32, h:32}, {x: boost.x, y: boost.y, w: 32, h: 32})) {
                player.boost = boostNames[boost.type]
                player.boostCountdown = boostDurations[boost.type]
                boosts = boosts.filter(filterBoost => filterBoost !== boost)
                console.log("player boost", player.boost)
            } else if (boost.countdown <= 0) {
                boosts = boosts.filter(filterBoost => filterBoost !== boost)
            }
        }

        player.boostCountdown -= delta

        if (player.boostCountdown <= 0) {
            player.boost = "none"
        }
    }
    boostCountdown -= delta
    if (boostCountdown <= 0) {
        if (boosts.length < 20) {
            boosts.push({x: Math.random() * 3500, y: Math.random() * 3500, countdown: 60 * 1000, type: Math.floor(Math.random() * (boostNames.length))})
            while (isCollidingWithMap(boosts[boosts.length - 1])) {
                boosts[boosts.length - 1].x = Math.random() * 3500
                boosts[boosts.length - 1].y = Math.random() * 3500
            }
        }
        boostCountdown = 10 * 1000
        console.log("boosts", boosts)
    }
    io.emit('players', players)
    io.emit('boosts', boosts)
}

async function main() {
    map2D = await loadMap()

    io.on('connect', (socket) => {
        inputsMap[socket.id] = {
            up: false,
            down: false,
            left: false,
            right: false,
            switchSkin: false,
            tagged: false
        }

        players.push({
            id: socket.id,
            x: 1910,
            y: 2200,
            speedX: 5,
            speedY: 5,
            speedJump: -12,
            skin: "red-santa",
            skinNumber: 0,
            direction: "right",
            tagged: "no",
            countdown: 0,
            dashAvailable: true,
            boost: "none",
            boostCountdown: 0
        })

        socket.emit('map', map2D)

        socket.on('inputs', (inputs) => {
            inputsMap[socket.id] = inputs
        })

        socket.on('disconnect', () => {
            players = players.filter(player => player.id !== socket.id)
        })
    })
    
    app.use(express.static("public"))
    
    httpServer.listen(PORT);

    let lastUpdate = Date.now()
    setInterval(() => {
        const now = Date.now()
        const delta = now - lastUpdate
        tick(delta)
        lastUpdate = now
    }, 1000 / TICK_RATE)
}

main()
