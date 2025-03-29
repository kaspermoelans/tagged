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

// Retrieve the nameTag from localStorage
const nameTag = localStorage.getItem('nameTag');

// Retrieve the partyID from localStorage
partyID = localStorage.getItem('partyID');
partyIDParagraph.innerText = "Party ID: " + partyID

const canvasEl = document.getElementById("canvas");
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;
const canvas = canvasEl.getContext("2d");

socket.emit('joinParty', (nameTag), (partyID))

socket.on('parties', (parties) => {
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

        // Append the new player to the list
        playerList.appendChild(newPlayer);
    })
    
    speedValue.textContent = data.modifiers.speed
    speedSlider.value = data.modifiers.speed
    dashValue.textContent = data.modifiers.dash
    dashSlider.value = data.modifiers.dash
    jumpValue.textContent = data.modifiers.jump
    jumpSlider.value = data.modifiers.jump
    gravityValue.textContent = data.modifiers.gravity
    gravitySlider.value = data.modifiers.gravity
    selectMap(data.modifiers.map)
})

const partyContainerDiv = document.getElementById('partyContainer');