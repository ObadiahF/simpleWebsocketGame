// buttons
const howManyPlayersBtn = document.querySelectorAll('.players');
const privacyBtn = document.querySelectorAll('.privacy');
const createGameBtn = document.getElementById('create-game');
const gameModeBtn = document.querySelectorAll('.gamemode2');

// errors
const errorContainer = document.getElementById('error');
const errorMessageEl = document.getElementById('error-msg');

// settings
let players;
let gameMode;
let privacy;

const startUp = () => {
    if (!(localStorage.getItem('User'))) {
        window.location = "/index.html";
    }
}

gameModeBtn.forEach(el => el.addEventListener('click', () => {
    gameModeBtn.forEach(btn => btn.classList.remove('clicked'));
    el.classList.add('clicked');
    gameMode = el.textContent;
}))

howManyPlayersBtn.forEach(el => el.addEventListener('click', () => {
    howManyPlayersBtn.forEach(btn => btn.classList.remove('clicked'));
    el.classList.add('clicked');
    players = el.textContent;
}))

privacyBtn.forEach(el => el.addEventListener('click', () => {
    privacyBtn.forEach(btn => btn.classList.remove('clicked'));
    el.classList.add('clicked');
    privacy = el.textContent;
}))

createGameBtn.addEventListener('click', () => {
    if (!players || !gameMode || !privacy) {
        errorAnimation("All fields required to create game.")
    } else {
        const gameSettings = {
            gameMode,
            "maxPlayers": players,
            privacy,
            "host": localStorage.getItem('User'),
            "players": [
                localStorage.getItem("User")
            ]
        }

        requestToCreateNewGame(gameSettings);


        /*
        //connect to websocket
            const ws = new WebSocket('ws://localhost:8080');
            if (ws.close) errorAnimation('Error connecting to server.')
            ws.addEventListener('open', () => {

                ws.send(gameSettings)
    
                ws.addEventListener('message', (e) => {
                    const message = e.data.split(',');
                    console.log(message)
                   if (message[0] == 200) {
                    window.location = "./gameLobby.html"
                    localStorage.setItem("Gamecode", message[1]);
                   } else {
                    errorAnimation("Error creating game.")
                   }
                })
            })
            */
    }
})

const errorAnimation = (errorMsg) => {
    errorMessageEl.textContent = errorMsg;
    errorContainer.style.display = "block";
    errorContainer.style.animation = "down 1s ease-out";

    gamemodeBtn.forEach(btn => btn.classList.remove('clicked'));
    howManyPlayersBtn.forEach(btn => btn.classList.remove('clicked'));
    privacyBtn.forEach(btn => btn.classList.remove('clicked'));

    setTimeout(() => {
        errorContainer.style.animation = "up 3s ease-out";
        setTimeout(() => { errorContainer.style.display = "none"; }, 2000)
    }, 4000)
}

// send to server:

const requestToCreateNewGame = async (gameSettings) => {

    console.log(gameSettings);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameSettings)
    };

    const response = await fetch("http://localhost:8080", requestOptions);
    // NOTE:
    // this is why i don't like fetch API- axios would just give you the body without needing to parse the readable stream with .json() 🙄
    // but it's probably a PINA to setup axios for the browser so just use fetch i guess 🤷
    // SOLUTION: parse readableStream with .json();
    const { gameCode } = await response.json();
    console.log(gameCode);
    return gameCode;

}

startUp();