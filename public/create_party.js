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

// Canvas resize function
function resizeCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Update the speed and jump values when sliders are moved
const speedSlider = document.getElementById("speedSlider");
const dashSlider = document.getElementById("dashSlider");
const jumpSlider = document.getElementById("jumpSlider");
const gravitySlider = document.getElementById("gravitySlider");
const speedValue = document.getElementById("speedValue");
const dashValue = document.getElementById("dashValue");
const jumpValue = document.getElementById("jumpValue");
const gravityValue = document.getElementById("gravityValue");

let selectedMapIndex = 0; // Default to "Map 1" (index 0)
let modifiers = {
    map: selectedMapIndex,
    speed: parseInt(speedSlider.value),
    dash: parseInt(dashSlider.value),
    jump: parseInt(jumpSlider.value),
    gravity: parseInt(gravitySlider.value)
}

speedSlider.addEventListener("input", () => {
    speedValue.textContent = speedSlider.value;
    modifiers = {
        map: selectedMapIndex,
        speed: parseInt(speedSlider.value),
        dash: parseInt(dashSlider.value),
        jump: parseInt(jumpSlider.value),
        gravity: parseInt(gravitySlider.value)
    }
    socket.emit("changeModifiers", socket.id, modifiers)
});

dashSlider.addEventListener("input", () => {
    dashValue.textContent = dashSlider.value
    modifiers = {
        map: selectedMapIndex,
        speed: parseInt(speedSlider.value),
        dash: parseInt(dashSlider.value),
        jump: parseInt(jumpSlider.value),
        gravity: parseInt(gravitySlider.value)
    }
    socket.emit("changeModifiers", socket.id, modifiers)
});

jumpSlider.addEventListener("input", () => {
    jumpValue.textContent = jumpSlider.value;
    modifiers = {
        map: selectedMapIndex,
        speed: parseInt(speedSlider.value),
        dash: parseInt(dashSlider.value),
        jump: parseInt(jumpSlider.value),
        gravity: parseInt(gravitySlider.value)
    }
    socket.emit("changeModifiers", socket.id, modifiers)
});

gravitySlider.addEventListener("input", () => {
    gravityValue.textContent = gravitySlider.value;
    modifiers = {
        map: selectedMapIndex,
        speed: parseInt(speedSlider.value),
        dash: parseInt(dashSlider.value),
        jump: parseInt(jumpSlider.value),
        gravity: parseInt(gravitySlider.value)
    }
    socket.emit("changeModifiers", socket.id, modifiers)
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

    selectMap(0)

    modifiers = {
        map: selectedMapIndex,
        speed: parseInt(speedSlider.value),
        dash: parseInt(dashSlider.value),
        jump: parseInt(jumpSlider.value),
        gravity: parseInt(gravitySlider.value)
    }
    socket.emit("changeModifiers", socket.id, modifiers)
});

// Map selection logic
selectedMapIndex = 0; // Default to "Map 1" (index 0)
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

    // Send to other players
    modifiers = {
        map: selectedMapIndex,
        speed: parseInt(speedSlider.value),
        dash: parseInt(dashSlider.value),
        jump: parseInt(jumpSlider.value),
        gravity: parseInt(gravitySlider.value)
    }
    socket.emit("changeModifiers", socket.id, modifiers)

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

// Retrieve the nameTag from localStorage
const nameTag = localStorage.getItem('nameTag');
socket.emit('createParty', nameTag, modifiers)

const canvasEl = document.getElementById("canvas");
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;
const canvas = canvasEl.getContext("2d");

socket.on('parties', (parties) => {
    partyID = socket.id
    partyIDParagraph.innerText = "Party ID: " + partyID
    if (partyID == undefined || parties == "" || socket.id == undefined) {
      return
    }

    let data = parties.find(party => party.id == partyID)

    if (data == undefined) return

    // Get the player list
    const playerList = document.getElementById('playerList');

    // Clear all existing items in the list
    playerList.innerHTML = '';

    data.players.forEach(function(player) {
        // Create a new list item
        const newPlayer = document.createElement('li');
        newPlayer.className = 'player'; // Add class "player"
        newPlayer.textContent = player.nameTag; // Set the text content to the player's name

        // Check if the current player is not the host
        //if (player.id !== data.id) {
        //    const kickButton = document.createElement('button');
        //    kickButton.textContent = 'Kick';
        //    kickButton.className = 'kick-button';
//
  //          // Add click event for kicking the player
    //        kickButton.onclick = () => {
      //          socket.emit('kickPlayer', { partyID: data.id, playerID: player.id });
        //    };

          //  newPlayer.appendChild(kickButton);
        //}

        // Append the new player to the list
        playerList.appendChild(newPlayer);
    })
    
})

const partyIDParagraph = document.getElementById('partyIDParagraph');
const partyContainerDiv = document.getElementById('partyContainer');
const startGameButton = document.getElementById('startGame');

startGameButton.addEventListener('click', function() {

  socket.emit("startGame", partyID)
})