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
    socket.emit('JoinGame', Username, gameCode)

    socket.on('successfullyJoined', (args) => {
        if (args[0] === "ok") {
            setTimeout(() => {
                loadingEl.style.display = "none";
                LobbyEl.style.display = "block";
            }, 1000)
        } else {
            window.location = '/index.html'
        }
        if (args[1].host.SocketId === socket.id) startBtn.style.display = 'block';
        playerJoin(args[1])
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


const playerJoin = (Game) => {
    let inGame = false;
    const Players = Game.players;
    Players.forEach(player => {
        if (player.SocketId === socket.id) {
            inGame = true;
        }
    })

    if (inGame === false) {
        localStorage.setItem('error', "You have been kicked by the host.")
        window.location = '../index.html'
    }

    players.forEach(player => {
        player.remove();
        players = [];
    })
    Players.forEach(player => {
        const playerName = document.createElement('h1');
        playerName.value = player.SocketId;
        playerName.classList.add('players')
        if (Game.host.SocketId === player.SocketId) {
            playerName.classList.add('host')
            playerName.textContent = `${player.Username}????`;
        } else {
            playerName.textContent = player.Username;
        }
        players.push(playerName);
        playerCounterEl.textContent = `${players.length}/${Game.maxPlayers}`
        playerContainerEl.appendChild(playerName);
    })

        players.forEach(player => player.addEventListener('click', () => {
            if (Game.host.SocketId === socket.id) {
                if (!(player.classList.contains('host'))) {
                  players.splice(players.indexOf(player));
                player.remove();
                playerCounterEl.textContent = `${players.length}/4`;
                socket.emit('PlayerKicked', ([Game.gameCode, player.value]));
                }
            }
        }))

        players.forEach(player => player.addEventListener('mouseover', (event) => {
            if (Game.host.SocketId === socket.id) {
                if (!(event.target.classList.contains('host'))) {
                    event.target.style.textDecoration = 'line-through';
                    event.target.style.cursor = "pointer"
                }
            }
        }))

        players.forEach(player => player.addEventListener('mouseleave', (event) => {
            event.target.style.textDecoration = 'none';
        }))

        if (players.length >= 2) {
            startBtn.style.backgroundColor = '#e0e1dd';
            startBtn.style.cursor = 'pointer';
            startBtn.classList.add('startActive')
        } else {
            startBtn.style.backgroundColor = 'grey';
            startBtn.style.cursor = 'not-allowed';
            startBtn.classList.remove('startActive')
        }
}

startBtn.addEventListener('click', () => {
    
})

startUp();