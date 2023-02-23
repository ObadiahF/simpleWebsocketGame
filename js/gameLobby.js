const playerContainerEl = document.getElementById('player-container');
const playerCounterEl = document.getElementById('player');
const startBtn = document.getElementById('start');
const gameCodeEl = document.getElementById('Game-code')
const Username = localStorage.getItem('User');
const gameCode = localStorage.getItem('gameCode');
const loadingEl = document.querySelector('.ring');
const LobbyEl = document.querySelector('.lobby')
let players = [];
const socket = io('http://localhost:3000');

socket.on("connect", () => {
    let host;
    socket.emit('JoinGame', Username, gameCode)

    socket.on('successfullyJoined', (args) => {
        if (args[0] === "ok") {
            setTimeout(() => {
                loadingEl.style.display = "none";
                LobbyEl.style.display = "block";
            }, 1000)
        }

        host = args[1];
        playerJoin(host);
    })
});


socket.on('connect_error', () => {
    localStorage.setItem('error', "Failed to connect to server.")
    window.location = '../index.html'
})



socket.on("disconnect", () => {
    localStorage.setItem('error', "Failed to connect to server.")
    window.location = '../index.html'
});

const startUp = () => {
    if (!(gameCode) || !(localStorage.getItem('User'))) {
        window.location = "../index.html";
    } else {
        //setup Gamecode
        gameCodeEl.textContent = `Game Code: ${gameCode}`
    }
}


const playerJoin = (host) => {
    const playerName = document.createElement('h1');
        playerName.classList.add('players')
        if (host === true) {
            playerName.classList.add('host')
            playerName.textContent = localStorage.getItem('User') + " (Host)";
        } else {
            playerName.textContent = "Grab from server"
        }
        players.push(playerName);
        playerCounterEl.textContent = `${players.length}/4`
        playerContainerEl.appendChild(playerName);
        console.log(players);

        players.forEach(player => player.addEventListener('click', () => {
            if (host === true) {
                if (!(player.classList.contains('host'))) {
                  players.splice(players.indexOf(player));
                player.remove();
                console.log(players);
                playerCounterEl.textContent = `${players.length}/4`  
                }
            }
        }))

        players.forEach(player => player.addEventListener('mouseover', (event) => {
            if (host === true) {
                if (!(event.target.classList.contains('host'))) {
                    event.target.style.textDecoration = 'line-through';
                }
            }
        }))

        players.forEach(player => player.addEventListener('mouseleave', (event) => {
            event.target.style.textDecoration = 'none';
        }))

        if (players.length >= 2) {
            startBtn.style.backgroundColor = '#e0e1dd';
            startBtn.style.cursor = 'pointer';
        } else {
            startBtn.style.backgroundColor = 'grey';
            startBtn.style.cursor = 'not-allowed';
        }
}

startBtn.addEventListener('click', () => {
    
})

startUp();