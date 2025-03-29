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