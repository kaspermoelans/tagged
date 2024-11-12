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
const { connect } = require('http2');

const TICK_RATE = 30

const TILE_SIZE = 32

let servers = []
let map2D
const mapSpawnPoints = [{x: 1910, y: 2200}, {x: 780, y: 0}]

const inputsMap = {}
const skins = ["red_santa", "pink_santa", "banana", "tomato", "viking", "ninja", "pink_dude", "white_dude", "blue_dude", "appeltaart", "black"]

const boostNames = ["invisibility", "jumpboost", "umbrella", "speedboost", "shield", "portal"]
const boostDurations = [30 * 1000, 30 * 1000, 30 * 1000, 30 * 1000, 15 * 1000, 0]

const MAX_BOOSTS = 25

let SPEED = {
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
  
function isCollidingWithMap(player, map) {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
        const tile = map[row][col];

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
    for (let server of servers) {
        for (let player of server.players) {
            const inputs = inputsMap[player.id]
            const previousY = player.y
            const previousX = player.x
    
            if (player.tagged === "no" || player.countdown <= 0) {
                player.y += player.speedY
    
                if (isCollidingWithMap(player, map2D[server.modifiers.map])) {
                    player.dashAvailable = true
                    player.y = previousY
                    if (inputs.up) {
                        if (player.boost === "jumpboost") {
                            player.speedY = server.modifiers.jump * 1.5
                        } else {
                            player.speedY = server.modifiers.jump
                        }
                    }
                    if (player.speedY > 5) {
                        player.speedY = 5
                    }
                } else if (inputs.dash && player.dashAvailable) {
                    if (inputs.left) {
                        player.x -= server.modifiers.speed * server.modifiers.dash
                        player.dashAvailable = false
                    }
                    if (inputs.right) {
                        player.x += server.modifiers.speed * server.modifiers.dash
                        player.dashAvailable = false
                    }
                }
    
                if (player.boost === "umbrella" && player.speedY >= 0) {
                    player.speedY += server.modifiers.gravity * 0.2
                } else {
                    player.speedY += server.modifiers.gravity
                }
    
                if (inputs.left) {
                    if (player.boost === "speedboost") {
                        player.x -= server.modifiers.speed * 1.5
                    } else {
                        player.x -= server.modifiers.speed
                    }
                    player.direction = "left"
                } else if (inputs.right) {
                    if (player.boost === "speedboost") {
                        player.x += server.modifiers.speed * 1.5
                    } else {
                        player.x += server.modifiers.speed
                    }
                    player.direction = "right"
                }
    
                if (isCollidingWithMap(player, map2D[server.modifiers.map])) {
                    player.x = previousX
                }
    
                if (player.y > 4000) {
                    player.x = mapSpawnPoints[server.modifiers.map].x
                    player.y = mapSpawnPoints[server.modifiers.map].y
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
    
            if (player.tagged === "no" && player.boost !== "shield") {
                for (let otherPlayer of server.players) {
                    if (otherPlayer.tagged === "yes" && isColliding({x: player.x, y: player.y, w: 32, h: 32}, {x: otherPlayer.x, y: otherPlayer.y, w: 32, h: 32}) && otherPlayer !== player && otherPlayer.countdown <= 0) {
                        player.tagged = "yes"
                        otherPlayer.tagged = "no"
                        player.countdown = 10 * 1000
                    }
                }
            }
    
            if (player.tagged === "yes" && player.countdown > 0) {
                player.countdown = player.countdown - delta
            }
    
            if (player.tagged === "yes") {
                if (player.pointerCountdown <= 0) {
                    const min = {disctance: undefined, x: undefined, y: undefined, player: undefined, inRange: false}
                    for (const otherPlayer of server.players) {
                        if (player.id !== otherPlayer.id && otherPlayer.boost !== "invisibility") {
                            if (!isColliding({x: otherPlayer.x, y: otherPlayer.y, w:32, h: 32}, {x: player.x - 300, y: player.y - 300, w: 600, h:600})) {
                                if (Math.abs(otherPlayer.x - player.x) + Math.abs(otherPlayer.y - player.y) < min.disctance || min.disctance === undefined) {
                                    min.disctance = Math.abs(otherPlayer.x - player.x) + Math.abs(otherPlayer.y - player.y)
                                    min.x = otherPlayer.x - player.x + 8
                                    min.y = otherPlayer.y - player.y + 8
                                    min.player = otherPlayer
                                }
                            } else {
                                min.inRange = true
                            }
                        }
                    }
                    if (min.x !== undefined && min.y !== undefined && !min.inRange) {
                        const angle = Math.atan2(min.y, min.x)
                        player.pointers.push({x: player.x + 16, y: player.y + 16, angle: angle, playerId: player.id, delete: true, target: {x: min.player.x, y: min.player.y}})
                    }
                    player.pointerCountdown = 2000
                } else {
                    player.pointerCountdown -= delta
                }
                
            }
    
            if (inputs.tagged) {
                player.tagged = "yes"
                player.countdown = 10 * 1000
                inputs.tagged = true
            }
    
            for (const boost of server.boosts) {
                if (isColliding({x: player.x, y: player.y, w: 32, h:32}, {x: boost.x, y: boost.y, w: 32, h: 32})) {
                    if (boostNames[boost.type] === "portal") {
                        player.x = Math.random() * 3500
                        player.y = Math.random() * 3500
                        while (isCollidingWithMap(player, map2D[server.modifiers.map])) {
                            player.x = Math.random() * 3500
                            player.y = Math.random() * 3500
                        }
                    } else {
                        player.boost = boostNames[boost.type]
                        player.boostCountdown = boostDurations[boost.type]
                    }
                    server.boosts = server.boosts.filter(filterBoost => filterBoost !== boost)
                } else if (boost.countdown <= 0) {
                    server.boosts = server.boosts.filter(filterBoost => filterBoost !== boost)
                }
                if (server.boosts.length >= MAX_BOOSTS - 5) {
                    boost.countdown -= delta
                } else {
                    boost.countdown -= delta / 2
                }
            }
    
            player.boostCountdown -= delta
    
            if (player.boostCountdown <= 0) {
                player.boost = "none"
            }
    
            for (const pointer of player.pointers) {
                pointer.x += Math.cos(pointer.angle) * 11
                pointer.y += Math.sin(pointer.angle) * 11
        
                for (const player of server.players) {
                    if (player.id === pointer.playerId) continue
                    if (isColliding({x: pointer.target.x, y: pointer.target.y, w: 32, h: 32}, {x: pointer.x, y: pointer.y, w: 5, h: 5}) || pointer.x < -10 || pointer.y < -10 || pointer.x > 4000 || pointer.y > 4000) {
                        pointer.delete = false
                    }
                }
            }
        
            player.pointers = player.pointers.filter(pointer => pointer.delete)
        }
        server.boostCountdown -= delta
        if (server.boostCountdown <= 0) {
            if (server.boosts.length < MAX_BOOSTS) {
                server.boosts.push({x: Math.random() * 3500, y: Math.random() * 3500, countdown: 120 * 1000, type: Math.floor(Math.random() * (boostNames.length))})
                while (isCollidingWithMap(server.boosts[server.boosts.length - 1], map2D[server.modifiers.map])) {
                    server.boosts[server.boosts.length - 1].x = Math.random() * 3500
                    server.boosts[server.boosts.length - 1].y = Math.random() * 3500
                }
            }
            server.boostCountdown = 5 * 1000
        }
    }
    

    //io.emit('players', players)
    //io.emit('boosts', boosts)

    io.emit('servers', servers)
}

async function main() {
    map2D = await loadMap()

    io.on("connect", (socket) => {
        inputsMap[socket.id] = {
            up: false,
            down: false,
            left: false,
            right: false,
            switchSkin: false,
            tagged: false
        }

        socket.emit('servers', servers)

        socket.on('inputs', (inputs) => {
            inputsMap[socket.id] = inputs
        })

        socket.on('disconnect', () => {
            for (const server in servers) {
                servers[server].players = servers[server].players.filter(player => player.id !== socket.id)
                console.log("Client Disconnected: " + socket.id)
            }
            servers = servers.filter(server => server.players.length > 0)
        })
        
        socket.on('createServer', (modifiers) => {
            socket.emit('map', map2D[modifiers.map])
            servers.push({
                id: socket.id,
                boosts: [],
                boostCountdown: 5 * 1000,
                modifiers: {
                    map: modifiers.map,
                    speed: modifiers.speed,
                    dash: modifiers.dash,
                    jump: - modifiers.jump,
                    gravity: modifiers.gravity / 10
                },
                players: [{
                    id: socket.id,
                    x: mapSpawnPoints[modifiers.map].x,
                    y: mapSpawnPoints[modifiers.map].y,
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
                    boostCountdown: 0,
                    pointerCountdown: 0,
                    pointers: []
                }]
            })
            console.log("New Server: " + servers[servers.length - 1].id)
        })

        socket.on('joinServer', (serverID) => {
            // Find the server object with the matching id
            const server = servers.find(server => server.id === serverID)

            if (server) {
                socket.emit('map', map2D[server.modifiers.map])
                server.players.push({
                    id: socket.id,
                    x: mapSpawnPoints[server.modifiers.map].x,
                    y: mapSpawnPoints[server.modifiers.map].y,
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
                    boostCountdown: 0,
                    pointerCountdown: 0,
                    pointers: []
                })
                console.log("Added Player: " + socket.id + " to Server: " + serverID)
            }
        })

        console.log("Client Connected: " + socket.id)
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
