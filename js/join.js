const HostContainerEl = document.getElementById('Hosts');
const GamesContainerEl = document.getElementById('Games');
const PlayerNumContainerEl = document.getElementById('PlayerNum');
const JoinBtnsContainerEl = document.getElementById('joinBtns');
const backBtn = document.getElementById('back');
const OpenBoxEl = document.getElementById('Dash-join-btn');
const GamecodePromptEl = document.querySelector('.Gamecode-prompt');
const exitBtnEL = document.getElementById('x');
const GamecodeInput = document.getElementById('Gamecode')
const JoinByGameCodeBtn = document.getElementById('Join-by-gamecode');
const ErrorEl = document.getElementById('noGames')
const errorContainer = document.getElementById('error');
const errorMessageEl = document.getElementById('error-msg');
const Username = localStorage.getItem('User');
const modalOverlay = document.querySelector('.overlay');

let GameBtns = [];

const Startup = () => {
    if (Username === null) window.location = '../index.html'
    const socket = io('https://websocket-game-server.onrender.com', {transports: ['websocket']});

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

        

        socket.on('GameDeleted', (game) => {
            let index;
            GameBtns.forEach(btn => {
                if (btn.value == game.gameCode) {
                    
                    index = GameBtns.indexOf(btn)      

                    HostContainerEl.children[index + 1].remove()
                    GamesContainerEl.children[index + 1].remove()
                    PlayerNumContainerEl.children[index + 1].remove()
                    JoinBtnsContainerEl.children[index + 1].remove()
                    return
                }
            })
            GameBtns.splice(index, 1);

            if (GameBtns.length === 0) {
                ErrorMsg('No public games available!')
            }            
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

backBtn.addEventListener('click', () => {
    window.location = '../index.html'
})

OpenBoxEl.addEventListener('click', () => {
    if (GamecodePromptEl.style.display === "none") {
        GamecodeInput.value = "";
        GamecodePromptEl.style.display = "block";
        modalOverlay.style.display = 'block';
        document.querySelector('body').style.overflow = 'hidden';
      } else {
        GamecodePromptEl.style.display = "none";
        modalOverlay.style.display = 'none';
        document.querySelector('body').style.overflow = 'auto';

      }
})

exitBtnEL.addEventListener('click', () => {
    closeModal();
})

const closeModal = () => {
    GamecodePromptEl.style.display = "none";
    modalOverlay.style.display = 'none';
    document.querySelector('body').style.overflow = 'auto';
}

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

JoinByGameCodeBtn.addEventListener('mouseover', () => {
    if (GamecodeInput.value.length == 6) {
        JoinByGameCodeBtn.style.cursor = 'pointer';
    }
})

JoinByGameCodeBtn.addEventListener('click', async (event) => {
    if (GamecodeInput.value.length !== 6) {
        event.preventDefault();
    } else {
        const response = await fetch("https://websocket-game-server.onrender.com/joinByGameCode", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"gameCode": GamecodeInput.value})
        })
        if (response.status === 200) {
            localStorage.setItem('gameCode', GamecodeInput.value);
            window.location = 'gameLobby.html'
        } else {
            const message = await response.json();
            GamecodeInput.value = "";
            errorAnimation(message.Response);
        }
    }
})

document.querySelector('body').addEventListener('mousedown', (event) => {
    const targetElement = document.querySelector('.Gamecode-prompt');

    if (event.target !== targetElement && !targetElement.contains(event.target)) {
        closeModal();
    }
})

const errorAnimation = (errorMsg) => {
    errorMessageEl.textContent = errorMsg;
    errorContainer.style.display = "block";
    errorContainer.style.animation = "down 1s ease-out";
    setTimeout(() => errorContainer.scrollIntoView({ behavior: 'smooth' }), 500);
    setTimeout(() => {
        errorContainer.style.animation = "up 3s ease-out";
        setTimeout(() => { errorContainer.style.display = "none"; }, 2000)
    }, 4000)
}

Startup()