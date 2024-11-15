const mapImage = new Image();
mapImage.src = "/tiles.png";

document.oncontextmenu = document.body.oncontextmenu = function() {return false;}
document.firstElementChild.style.zoom = "reset";

document.addEventListener(
  'wheel',
  function touchHandler(e) {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Update the speed and jump values when sliders are moved
const speedSlider = document.getElementById("speedSlider");
const dashSlider = document.getElementById("dashSlider");
const jumpSlider = document.getElementById("jumpSlider");
const gravitySlider = document.getElementById("gravitySlider");
const speedValue = document.getElementById("speedValue");
const dashValue = document.getElementById("dashValue");
const jumpValue = document.getElementById("jumpValue");
const gravityValue = document.getElementById("gravityValue");


speedSlider.addEventListener("input", () => {
    speedValue.textContent = speedSlider.value;
});

dashSlider.addEventListener("input", () => {
  dashValue.textContent = dashSlider.value;
});

jumpSlider.addEventListener("input", () => {
    jumpValue.textContent = jumpSlider.value;
});

gravitySlider.addEventListener("input", () => {
  gravityValue.textContent = gravitySlider.value;
});


// Reset button functionality
resetButton.addEventListener("click", () => {
  // Reset sliders to default values
  speedSlider.value = 5;
  dashSlider.value = 20;
  jumpSlider.value = 12;
  gravitySlider.value = 10;
  
  // Update displayed values
  speedValue.textContent = speedSlider.value;
  dashValue.textContent = dashSlider.value;
  jumpValue.textContent = jumpSlider.value;
  gravityValue.textContent = gravitySlider.value;
});

// Map selection logic
let selectedMapIndex = 0; // Default to "Map 1" (index 0)
const mapOptions = document.querySelectorAll('.map-option');

// Function to select a map (for both user click and default selection)
function selectMap(index) {
    // Remove 'selected' class from all thumbnails
    mapOptions.forEach((opt, i) => {
        const img = opt.querySelector('img');
        img.classList.remove('selected');

        // Add 'selected' class to the clicked thumbnail (if index matches)
        if (i === index) {
            img.classList.add('selected');
        }
    });

    // Set the selected map index
    selectedMapIndex = index;
    console.log("Selected Map Index:", selectedMapIndex); // Log selected map index for debugging
}

// Add click event listeners to each map option
mapOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
        selectMap(index);
    });
});

// Set Map 1 (index 0) as selected by default
selectMap(0);

const socket = io();
let serverID = ""

const canvasEl = document.getElementById("canvas");
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;
const canvas = canvasEl.getContext("2d");

const serverIDParagraph = document.getElementById('serverID');
const serverDiv = document.getElementById('serverDiv');
const createServerButton = document.getElementById('createServer');

createServerButton.addEventListener('click', function() {
  canvasEl.style.display = ""
  serverDiv.style.display = "none"

  console.log("Server ID: " + socket.id)
  serverID = socket.id
  serverIDParagraph.innerText = "Server ID: " + serverID

  console.log("selected map: " + selectedMapIndex)
  let modifiers = {
    map: selectedMapIndex,
    speed: parseInt(speedSlider.value),
    dash: parseInt(dashSlider.value),
    jump: parseInt(jumpSlider.value),
    gravity: parseInt(gravitySlider.value)
  }

  console.log(modifiers)
  socket.emit('createServer', modifiers)
})

const joinServerButton = document.getElementById('joinServerButton');
const joinServerID = document.getElementById('joinServerId');

joinServerButton.addEventListener('click', function() {
  canvasEl.style.display = ""
  serverDiv.style.display = "none"
  console.log("Server ID: " + joinServerID.value)
  serverID = joinServerID.value
  serverIDParagraph.innerText = "Serverd ID: " + serverID
  socket.emit('joinServer', joinServerID.value)
})

// Load mobile buttons
const leftImage = new Image();
leftImage.src = "/left.png";
const rightImage = new Image();
rightImage.src = "/right.png";
const upImage = new Image();
upImage.src = "/up.png";
const dashImage = new Image();
dashImage.src = "/dash.png";
const skinImage = new Image();
skinImage.src = "/skin.png";
const taggedImage = new Image();
taggedImage.src = "/tagged.png";

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

const right_appeltaartImage = new Image();
right_appeltaartImage.src = "/right_appeltaart.png";
const left_appeltaartImage = new Image();
left_appeltaartImage.src = "/left_appeltaart.png";

const blackImage = new Image();
blackImage.src = "/black.png";

// Boosts
const invisibilityImage = new Image();
invisibilityImage.src = "/invisibility.png";

const jumpboostImage = new Image();
jumpboostImage.src = "/jumpboost.png";

const umbrellaImage = new Image();
umbrellaImage.src = "/umbrella.png";

const speedboostImage = new Image();
speedboostImage.src = "/speedboost.png";

const shieldImage = new Image();
shieldImage.src = "/shield.png";

const portalImage = new Image();
portalImage.src = "/portal.png";

let map = [[]];
let players = []
let boosts = []

const boostNames = ["invisibility", "jumpboost", "umbrella", "speedboost", "shield", "portal"]

const TILE_SIZE = 32;

var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

socket.on("connect", () => {
  console.log("connected");
});

socket.on("map", (loadedMap) => {
  map = loadedMap
});

socket.on('servers', (servers) => {
    if (serverID == "" || servers == "") {
      return
    }
    let data = servers.find(server => server.id == serverID)
    players = data.players
    boosts = data.boosts
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
    if (e.key === 'z' || e.key === 'w' || e.key === 'ArrowUp' || e.key === ' ') {
        inputs['up'] = true
    }
    if (e.key === 's' || e.key === 'ArrowDown') {
        inputs['dash'] = true
    }
    if (e.key === 'q' || e.key === 'a' || e.key === 'ArrowLeft') {
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
  if (e.key === 'z' || e.key === 'w' || e.key === 'ArrowUp' || e.key === ' ') {
    inputs['up'] = false
  }
  if (e.key === 's' || e.key === 'ArrowDown') {
      inputs['dash'] = false
  }
  if (e.key === 'q' || e.key === 'a' || e.key === 'ArrowLeft') {
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

function isColliding(rect1, rect2) {
  return (
      rect1.x < rect2.x + rect2.w &&
      rect1.x + rect1.w > rect2.x &&
      rect1.y < rect2.y + rect2.h &&
      rect1.h + rect1.y > rect2.y
  );
}

window.addEventListener("touchstart", (e) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    for (const touch of e.changedTouches) {
      const clientX = touch.clientX
      const clientY = touch.clientY

      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: 10, y: canvasEl.height - 100, w: 168, h: 144})) {
        inputs['left'] = true
        socket.emit('inputs', inputs)
      }
      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: 168, y: canvasEl.height - 100, w: 168, h: 144})) {
        inputs['right'] = true
        socket.emit('inputs', inputs)
      }

      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: canvasEl.width - 10 - 150, y: canvasEl.height - 100, w: 168, h: 144})) {
        inputs['up'] = true
        socket.emit('inputs', inputs)
      }
      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x:  canvasEl.width - 168 - 150, y: canvasEl.height - 100, w: 168, h: 144})) {
        inputs['dash'] = true
        socket.emit('inputs', inputs)
      }

      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: canvasEl.width - 10 - 150, y: canvasEl.height * 0.05, w: 168, h: 144})) {
        inputs['switchSkin'] = true
        socket.emit('inputs', inputs)
      }
      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: 20, y: canvasEl.height * 0.05, w: 64, h: 64})) {
        inputs['tagged'] = true
        socket.emit('inputs', inputs)
      }
    }
  }
});

window.addEventListener("touchend", (e) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    for (const touch of e.changedTouches) {
      const clientX = touch.clientX
      const clientY = touch.clientY

      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: 10, y: canvasEl.height - 100, w: 168, h: 144})) {
        inputs['left'] = false
        socket.emit('inputs', inputs)
      }
      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: 168, y: canvasEl.height - 100, w: 168, h: 144})) {
        inputs['right'] = false
        socket.emit('inputs', inputs)
      }

      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: canvasEl.width - 10 - 150, y: canvasEl.height - 100, w: 168, h: 144})) {
        inputs['up'] = false
        socket.emit('inputs', inputs)
      }
      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x:  canvasEl.width - 168 - 150, y: canvasEl.height - 100, w: 168, h: 144})) {
        inputs['dash'] = false
        socket.emit('inputs', inputs)
      }

      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: canvasEl.width - 10 - 64, y: canvasEl.height * 0.05, w: 64, h: 64})) {
        inputs['switchSkin'] = false
        socket.emit('inputs', inputs)
      }
      if (isColliding({x: clientX, y: clientY, w: 1, h: 1}, {x: 20, y: canvasEl.height * 0.05, w: 64, h: 64})) {
        inputs['tagged'] = false
        socket.emit('inputs', inputs)
      }
    }
  }
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
    } else if (boostNames[boost.type] === "umbrella") {
      canvas.drawImage(umbrellaImage, boost.x - cameraX, boost.y - cameraY)
    } else if (boostNames[boost.type] === "speedboost") {
      canvas.drawImage(speedboostImage, boost.x - cameraX, boost.y - cameraY)
    } else if (boostNames[boost.type] === "shield") {
      canvas.drawImage(shieldImage, boost.x - cameraX, boost.y - cameraY)
    } else if (boostNames[boost.type] === "portal") {
      canvas.drawImage(portalImage, boost.x - cameraX, boost.y - cameraY)
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
        } else if (player.skin === "appeltaart") {
          canvas.drawImage(left_appeltaartImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "black") {
          canvas.drawImage(blackImage, player.x - cameraX, player.y - cameraY)
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
        } else if (player.skin === "appeltaart") {
          canvas.drawImage(left_appeltaartImage, player.x - cameraX, player.y - cameraY)
        } else if (player.skin === "black") {
          canvas.drawImage(blackImage, player.x - cameraX, player.y - cameraY)
        } else {
          canvas.drawImage(right_red_santaImage, player.x - cameraX, player.y - cameraY)
        }
      }
      for (const pointer of player.pointers) {
        canvas.fillStyle = '#1273DE'
        canvas.beginPath()
        canvas.arc(pointer.x - cameraX, pointer.y - cameraY, 10, 0, 2 * Math.PI)
        canvas.fill()
      }
    }
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canvas.drawImage(leftImage, 20, canvasEl.height - 100)
    canvas.drawImage(rightImage, 20 + 20 + 150, canvasEl.height - 100)
    canvas.drawImage(upImage, canvasEl.width - 20 - 150, canvasEl.height - 100)
    canvas.drawImage(dashImage, canvasEl.width - 20 - 20 - 150 - 150, canvasEl.height - 100)
    canvas.drawImage(skinImage, canvasEl.width - 20 - 64, canvasEl.height * 0.05)
    canvas.drawImage(taggedImage, 20, canvasEl.height * 0.05)
  }

  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
