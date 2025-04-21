const socket = io(); 
let serverID = ""
let partyID = ""

let map = [[]];
let players = []
let boosts = []
let letGameWorkPlease = false

const boostNames = ["invisibility", "jumpboost", "umbrella", "speedboost", "shield", "portal"]

const TILE_SIZE = 32;

var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}

// Updated scoreboard update function
function updateScoreboard(players, scoreboardTag) {
  const scoreboard = document.getElementById(scoreboardTag);
  scoreboard.innerHTML = "";

  // Sort players by score (ascending)
  players.sort((a, b) => a.score - b.score);

  let placement = 1;
  let previousScore = null;
  let rankMap = new Map(); // Map to track ranks for duplicate scores

  players.forEach((player, index) => {
    // Assign rank based on score (shared placement for same scores)
    if (!rankMap.has(player.score)) {
      rankMap.set(player.score, placement);
    }
    const rank = rankMap.get(player.score);

    // Create list item for scoreboard
    const li = document.createElement("li");
    li.classList.add("score-entry");
    li.textContent = `${rank}. ${player.nameTag}: ${player.score}`;
    scoreboard.appendChild(li);

    // Update placement only if next score is different
    if (index === players.length - 1 || player.score !== players[index + 1].score) {
      placement++;
    }
  });
}

function showEndGameScreen(players) {
  const endGameScreen = document.getElementById("endGameScreen");
  updateScoreboard(players, "finalScoreList")

  // Show the end game screen with fade-in effect
  endGameScreen.style.visibility = "visible";
  endGameScreen.style.opacity = "1";
}

function updateTimer(totalSeconds) {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

socket.on("connect", () => {
  console.log("connected");
});

socket.on("map", (mapPartyID, loadedMap) => {
  if (mapPartyID !== partyID) return
  map = loadedMap
  const scoreboardColumn = document.getElementById("scoreboardColumn");
  scoreboardColumn.style.visibility = "visible"
  document.getElementById("timerContainer").style.visibility = "visible"
  canvasEl.style.visibility = "visible"
  partyContainerDiv.style.visibility = "hidden"
  document.getElementById("endGameScreen").style.visibility = "hidden"
});

socket.on('parties', (parties) => {
    if (partyID == "" || parties == "") {
      return
    }
    let party = parties.find(party => party.id == partyID)
    players = party.game.players
    boosts = party.game.boosts

    if (party.game.timeLeft < 0 && letGameWorkPlease && canvasEl.style.visibility == "visible") {
      const scoreboardColumn = document.getElementById("scoreboardColumn");
      scoreboardColumn.style.visibility = "hidden"
      document.getElementById("timerContainer").style.visibility = "hidden"
      letGameWorkPlease = false
      
      showEndGameScreen(players)
    }
    if (party.game.timeLeft > 0) {
      letGameWorkPlease = true
    }
    updateScoreboard(players, "scoreboard")
    updateTimer(party.game.timeLeft/1000)
})


const backToLobbyButton = document.getElementById('backToLobby');

backToLobbyButton.addEventListener('click', function() {
  canvasEl.style.visibility = "hidden"
  partyContainerDiv.style.visibility = "visible"
  document.getElementById("endGameScreen").style.visibility = "hidden"
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
  if (isMobile && canvasEl) {
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
  if (isMobile && canvasEl) {
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
  //if (typeof canvasEl == undefined) return
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
      const spriteWidth = 16 * 2;
      const spriteHeight = 16 * 2;
      const drawX = player.x - cameraX;
      const drawY = player.y - cameraY;
      const animRow = {
        idle: 0,
        walk: 1,
        jump: 2,
        fall: 3
      }

      canvas.imageSmoothingEnabled = false;

      canvas.save();

      if (player.direction === "left") {
        // Flip horizontally around the vertical center of the sprite
        canvas.translate(drawX + spriteWidth, drawY); // move to right edge
        canvas.scale(-1, 1); // flip X
      } else {
        canvas.translate(drawX, drawY); // normal draw
      }

      let sprite 
      if (player.tagged === "yes") {
        sprite = skinsTagged[player.skinNumber]
      } else {
        sprite = skins[player.skinNumber]
      }
      canvas.drawImage(
        sprite,
        player.currentFrame * 16, animRow[player.animation.name] * 16,
        16, 16,
        0, 0,
        spriteWidth, spriteHeight
      );

      canvas.restore();
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

window.onload = function() {
  window.requestAnimationFrame(loop);
};
