const mapImage = new Image();
mapImage.src = "/tiles.png";

// Skins
const right_taggedImage = new Image();
right_taggedImage.src = "/right_tagged.png";
const left_taggedImage = new Image();
left_taggedImage.src = "/left_tagged.png";

const right_red_santaImage = new Image();
right_red_santaImage.src = "/right_red_santa.png";
const left_red_santaImage = new Image();
left_red_santaImage.src = "/left_red_santa.png";

const right_pink_santaImage = new Image();
right_pink_santaImage.src = "/right_pink_santa.png";
const left_pink_santaImage = new Image();
left_pink_santaImage.src = "/left_pink_santa.png";

const right_bananaImage = new Image();
right_bananaImage.src = "/right_banana.png";
const left_bananaImage = new Image();
left_bananaImage.src = "/left_banana.png";

const right_tomatoImage = new Image();
right_tomatoImage.src = "/right_tomato.png";
const left_tomatoImage = new Image();
left_tomatoImage.src = "/left_tomato.png";

const right_vikingImage = new Image();
right_vikingImage.src = "/right_viking.png";
const left_vikingImage = new Image();
left_vikingImage.src = "/left_viking.png";

const right_ninjaImage = new Image();
right_ninjaImage.src = "/right_ninja.png";
const left_ninjaImage = new Image();
left_ninjaImage.src = "/left_ninja.png";

const right_pink_dudeImage = new Image();
right_pink_dudeImage.src = "/right_pink_dude.png";
const left_pink_dudeImage = new Image();
left_pink_dudeImage.src = "/left_pink_dude.png";

const right_white_dudeImage = new Image();
right_white_dudeImage.src = "/right_white_dude.png";
const left_white_dudeImage = new Image();
left_white_dudeImage.src = "/left_white_dude.png";

const right_blue_dudeImage = new Image();
right_blue_dudeImage.src = "/right_blue_dude.png";
const left_blue_dudeImage = new Image();
left_blue_dudeImage.src = "/left_blue_dude.png";

// Boosts
const invisibilityImage = new Image();
invisibilityImage.src = "/invisibility.png";

const jumpboostImage = new Image();
jumpboostImage.src = "/jumpboost.png";

const speedboostImage = new Image();
speedboostImage.src = "/speedboost.png";

const canvasEl = document.getElementById("canvas");
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;
const canvas = canvasEl.getContext("2d");

const socket = io();

let map = [[]];
let players = []
let boosts = []

const boostNames = ["invisibility", "jumpboost", "speedboost"]

const TILE_SIZE = 32;

socket.on("connect", () => {
  console.log("connected");
});

socket.on("map", (loadedMap) => {
  map = loadedMap
});

socket.on('players', (serverPlayers) => {
    players = serverPlayers
})

socket.on('boosts', (serverBoosts) => {
  boosts = serverBoosts
})

const inputs = {
    up: false,
    dash: false,
    left: false,
    right: false,
    switchSkin: false,
    tagged: false
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'z' || e.key === 'ArrowUp' || e.key === ' ') {
        inputs['up'] = true
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
        inputs['dash'] = true
    }
    if (e.key === 'q' || e.key === 'ArrowLeft') {
        inputs['left'] = true
    }
    if (e.key === 'd' || e.key === 'ArrowRight') {
        inputs['right'] = true
    }
    if (e.key === 'e') {
      inputs['switchSkin'] = true
    }
    if (e.key === 't') {
      inputs['tagged'] = true
    }
    socket.emit('inputs', inputs)
})

window.addEventListener('keyup', (e) => {
    if (e.key === 'z' || e.key === 'ArrowUp' || e.key === ' ') {
        inputs['up'] = false
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
        inputs['dash'] = false
    }
    if (e.key === 'q' || e.key === 'ArrowLeft') {
        inputs['left'] = false
    }
    if (e.key === 'd' || e.key === 'ArrowRight') {
        inputs['right'] = false
    }
    if (e.key === 'e') {
      inputs['switchSkin'] = false
    }
    if (e.key === 't') {
      inputs['tagged'] = false
    }
    socket.emit('inputs', inputs)
})

function loop() {
  canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);
  canvas.fillStyle = 'lightblue'
  canvas.fillRect(0, 0, canvasEl.width, canvasEl.height)

  const myPlayer = players.find((player) => player.id === socket.id)

  let cameraX = 0
  let cameraY = 0

  if (myPlayer) {
    cameraX = parseInt(myPlayer.x - canvasEl.width / 2)
    cameraY = parseInt(myPlayer.y - canvasEl.height / 2)
  }

  const TILES_IN_ROW = 8;

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      let { id } = map[row][col] ?? {id: undefined}
      const imageRow = parseInt(id / TILES_IN_ROW);
      const imageCol = id % TILES_IN_ROW;
      canvas.drawImage(
        mapImage,
        imageCol * TILE_SIZE,
        imageRow * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        col * TILE_SIZE - cameraX,
        row * TILE_SIZE - cameraY,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }

  for (const boost of boosts) {
    if (boostNames[boost.type] === "invisibility") {
      canvas.drawImage(invisibilityImage, boost.x - cameraX, boost.y - cameraY)
    } else if (boostNames[boost.type] === "jumpboost") {
      canvas.drawImage(jumpboostImage, boost.x - cameraX, boost.y - cameraY)
    } else if (boostNames[boost.type] === "speedboost") {
      canvas.drawImage(speedboostImage, boost.x - cameraX, boost.y - cameraY)
    }
  }

  for (const player of players) {
    if (player.boost !== "invisibility" || player.id === myPlayer.id) {
      if (player.direction === "left") {
        if (player.tagged === "yes") {
          canvas.drawImage(left_taggedImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "red_santa") {
          canvas.drawImage(left_red_santaImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "pink_santa") {
          canvas.drawImage(left_pink_santaImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "banana") {
          canvas.drawImage(left_bananaImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "tomato") {
          canvas.drawImage(left_tomatoImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "viking") {
          canvas.drawImage(left_vikingImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "ninja") {
          canvas.drawImage(left_ninjaImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "pink_dude") {
          canvas.drawImage(left_pink_dudeImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "white_dude") {
          canvas.drawImage(left_white_dudeImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "blue_dude") {
          canvas.drawImage(left_blue_dudeImage, player.x - cameraX, player.y - cameraY)
        } else {
          canvas.drawImage(left_red_santaImage, player.x - cameraX, player.y - cameraY)
        }
      } else if (player.direction === "right") {
        if (player.tagged === "yes") {
          canvas.drawImage(right_taggedImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "red_santa") {
          canvas.drawImage(right_red_santaImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "pink_santa") {
          canvas.drawImage(right_pink_santaImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "banana") {
          canvas.drawImage(right_bananaImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "tomato") {
          canvas.drawImage(right_tomatoImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "viking") {
          canvas.drawImage(right_vikingImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "ninja") {
          canvas.drawImage(right_ninjaImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "pink_dude") {
          canvas.drawImage(right_pink_dudeImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "white_dude") {
          canvas.drawImage(right_white_dudeImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "blue_dude") {
          canvas.drawImage(right_blue_dudeImage, player.x - cameraX, player.y - cameraY)
        } else {
          canvas.drawImage(right_red_santaImage, player.x - cameraX, player.y - cameraY)
        }
      }
    }
  }

  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
