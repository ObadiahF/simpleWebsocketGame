const HostContainerEl = document.getElementById('Hosts');
const GamesContainerEl = document.getElementById('Games');
const PlayerNumContainerEl = document.getElementById('PlayerNum');
const JoinBtnsContainerEl = document.getElementById('joinBtns');
const OpenBoxEl = document.getElementById('Dash-join-btn');
const GamecodePromptEl = document.querySelector('.Gamecode-prompt');
const exitBtnEL = document.getElementById('x');
const GamecodeInput = document.getElementById('Gamecode')
const ErrorEl = document.getElementById('error')
const Username = localStorage.getItem('User');

let GameBtns = [];

const Startup = () => {
    if (Username === null) window.location = '../index.html'
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        socket.emit("JoinableGames");

        socket.on('newGame', (game) => {
            const Host = document.createElement('h6');
                Host.textContent = game.host.Username;
                
                const Mode = document.createElement('h6');
                Mode.textContent = game.gameMode;

                const currentPlayers = document.createElement('h6');
                currentPlayers.textContent = `${game.players.length}/${game.maxPlayers}`

                const JoinBtn = document.createElement('button');
                JoinBtn.classList.add('join');
                JoinBtn.textContent = 'Join'
                JoinBtn.value = game.gameCode;

                GameBtns.push(JoinBtn);

                HostContainerEl.appendChild(Host);
                GamesContainerEl.appendChild(Mode);
                PlayerNumContainerEl.appendChild(currentPlayers);
                JoinBtnsContainerEl.appendChild(JoinBtn)
                ErrorEl.style.display = "none";
                btnClick(socket)
        })

        //first set of games
        socket.on('GameData', (args) => {            
            args.forEach((game) => {
                const Host = document.createElement('h6');
                Host.textContent = game.host.Username;
                
                const Mode = document.createElement('h6');
                Mode.textContent = game.gameMode;

                const currentPlayers = document.createElement('h6');
                currentPlayers.textContent = `${game.players.length}/${game.maxPlayers}`

                const JoinBtn = document.createElement('button');
                JoinBtn.classList.add('join');
                JoinBtn.textContent = 'Join'
                JoinBtn.value = game.gameCode;

                GameBtns.push(JoinBtn);

                HostContainerEl.appendChild(Host);
                GamesContainerEl.appendChild(Mode);
                PlayerNumContainerEl.appendChild(currentPlayers);
                JoinBtnsContainerEl.appendChild(JoinBtn)
                ErrorEl.style.display = "none";

                btnClick(socket)
            })
            if (args.length === 0) {
                ErrorMsg('No public games available!')
            }
        })

        
        socket.on("GameClosed", () => {
            alert("noooo")
        })

        socket.on('GameDeleted', (game) => {
            GameBtns.forEach(btn => {
                if (btn.value == game.gameCode) {
                    
                    const index = GameBtns.indexOf(btn)                    
                    HostContainerEl.children[index + 1].remove()
                    GamesContainerEl.children[index + 1].remove()
                    PlayerNumContainerEl.children[index + 1].remove()
                    JoinBtnsContainerEl.children[index + 1].remove()
                    
                }
            })
        })

        socket.on('PlayersChanged', (game) => {
            GameBtns.forEach(btn => {
                if (btn.value == game.gameCode) {
                    const index = GameBtns.indexOf(btn)
                    PlayerNumContainerEl.children[index + 1].textContent = game.currentPlayers.length;
                }
            })
        })

    })

    socket.on('connect_error', () => {
        //alert("Error: Failed to connect to server")
    })
    
    
    
    socket.on("disconnect", () => {
        //alert("Error: Dissconected from server")

    });
}

OpenBoxEl.addEventListener('click', () => {
    if (GamecodePromptEl.style.display === "none") {
        GamecodePromptEl.style.display = "block";
      } else {
        GamecodePromptEl.style.display = "none";
      }
})

exitBtnEL.addEventListener('click', () => {
    GamecodePromptEl.style.display = "none";
})

const ErrorMsg = (msg) => {
    ErrorEl.textContent = msg;
    ErrorEl.style.display = "block";
}

const btnClick = (socket) => {
    GameBtns.forEach(btn => btn.addEventListener('click', () => {
        localStorage.setItem('gameCode', btn.value);
        window.location = 'gameLobby.html'
    }))
}

Startup()