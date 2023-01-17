const playerContainerEl = document.getElementById('player-container');
const playerCounterEl = document.getElementById('player');
const startBtn = document.getElementById('start');
const gameCodeEl = document.getElementById('Game-code')
const gameCode = localStorage.getItem('Gamecode')

let currentPlayers = 1;
let players = [];


const startUp = () => {
    if (!(gameCode) || !(localStorage.getItem('User'))) {
        window.location = "/index.html";
    } else {
        //First Player Joined
        const Host = document.createElement('h1');
        Host.classList.add('host')
        Host.textContent = localStorage.getItem('User') + " (Host)";
        playerContainerEl.appendChild(Host);

        //setup Gamecode
        gameCodeEl.textContent = `Game Code: ${gameCode}`
    }
}


const playerJoin = () => {
    const playerName = document.createElement('h1');
        playerName.classList.add('players')
        //grab from server
        playerName.textContent = "Grab from server"

        playerContainerEl.appendChild(playerName);
        players.push(playerName);

        console.log(players)
        currentPlayers++;
        playerCounterEl.textContent = `${currentPlayers}/4`

        players.forEach(player => player.addEventListener('click', () => {
            players.splice(player)
            player.remove();
            console.log(players);
            currentPlayers--
            playerCounterEl.textContent = `${currentPlayers}/4`


        }))
}

startBtn.addEventListener('click', () => {
    playerJoin();
})

startUp();