const playerContainerEl = document.getElementById('player-container');
const playerCounterEl = document.getElementById('player');
const startBtn = document.getElementById('start');
const GameCodeEl = document.getElementById('Game-code')
const GameCode = localStorage.getItem('Gamecode')

let currentPlayers = 1;
let players = [];



const StartUp = () => {
    if (!(GameCode) || !(localStorage.getItem('User'))) {
        window.location = "/index.html";
    } else {
        //First Player Joined
        const Host = document.createElement('h1');
        Host.classList.add('host')
        Host.textContent = localStorage.getItem('User') + " (Host)";
        playerContainerEl.appendChild(Host);

        //setup Gamecode
        GameCodeEl.textContent = `Game Code: ${GameCode}`
    }
}


const PlayerJoin = () => {
    const Player = document.createElement('h1');
        Player.classList.add('players')
        //grab from server
        Player.textContent = "Grab from server"

        playerContainerEl.appendChild(Player);
        players.push(Player);

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
    PlayerJoin();
})



StartUp();