const socket = io(); 

let clientParties = []
const partyListContainer = document.getElementById('partyListContainer');
partyListContainer.innerHTML = '';

socket.on('parties', (parties) => {
    let serverParties = []
    for (const party in parties) {
        serverParties.push({
            id: parties[party].id,
            partyName: parties[party].partyName
        })
    }

    if (arePartiesEqual(clientParties, serverParties)) {
      return
    }

    partyListContainer.innerHTML = '';
    loadParties(parties)

    clientParties = serverParties
})

// Function to dynamically populate parties
function loadParties(parties) {
    partyListContainer.innerHTML = '';
    parties.forEach(party => {
        const partyDiv = document.createElement('div');
        partyDiv.className = 'party';

        const partyDetails = document.createElement('div');
        partyDetails.className = 'party-details';

        const partyName = document.createElement('span');
        partyName.className = 'party-name';
        partyName.textContent = `Host: ${party.partyName}`;

        const partyCode = document.createElement('span');
        partyCode.className = 'party-code';
        partyCode.textContent = `ID: ${party.id}`;

        partyDetails.appendChild(partyName);
        partyDetails.appendChild(partyCode);

        const joinButton = document.createElement('button');
        joinButton.className = 'join-button';
        joinButton.textContent = 'Join';
        joinButton.onclick = () => {
            // Save the partyID to localStorage
            localStorage.setItem('partyID', party.id);

            // Redirect to the join party page
            window.location.href = 'join_party.html';
        };

        partyDiv.appendChild(partyDetails);
        partyDiv.appendChild(joinButton);

        partyListContainer.appendChild(partyDiv);
    });
}

// Function to check if two arrays of objects are the same
function arePartiesEqual(array1, array2) {
    if (array1.length !== array2.length) return false;

    return array1.every((item1, index) => {
        const item2 = array2[index];
        return item1.id === item2.id && item1.partyName === item2.partyName;
    });
}