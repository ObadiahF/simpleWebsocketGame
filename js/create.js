//btns
const howManyPlayersBtn = document.querySelectorAll('.players');
const privacyBtn = document.querySelectorAll('.privacy');
const createGameBtn = document.getElementById('create-game');
const gamemodeBtn = document.querySelectorAll('.gamemode2');

//errors
const errorContainer = document.getElementById('error');
const errorMessageEl = document.getElementById('error-msg');

//settings
let players;
let gameMode;
let privacy;

const StartUp = () => {
    if (!(localStorage.getItem('User'))) {
        window.location = "/index.html";
    }
}

gamemodeBtn.forEach(el => el.addEventListener('click', () => {
    gamemodeBtn.forEach(btn => btn.classList.remove('clicked'));
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
        ErrorAnimation("All fields required to create game.")
    } else {
        const GameSettings = {
            "GameMode": gameMode,
            "MaxPlayers": players,
            "Privacy": privacy,
            "Host": localStorage.getItem('User'),
            "Players": [
                localStorage.getItem("User")
            ]
        }
        
        RequestToCreateNewGame(GameSettings);


        /*
        //connect to websocket
            const ws = new WebSocket('ws://localhost:8080');
            if (ws.close) ErrorAnimation('Error connecting to server.')
            ws.addEventListener('open', () => {

                ws.send(GameSettings)
    
                ws.addEventListener('message', (e) => {
                    const message = e.data.split(',');
                    console.log(message)
                   if (message[0] == 200) {
                    window.location = "./gameLobby.html"
                    localStorage.setItem("Gamecode", message[1]);
                   } else {
                    ErrorAnimation("Error creating game.")
                   }
                })
            })
            */
    }
})

const ErrorAnimation = (errorMsg) => {
    errorMessageEl.textContent = errorMsg;
    errorContainer.style.display = "block";
    errorContainer.style.animation = "down 1s ease-out";
    setTimeout(() => {
        errorContainer.style.animation = "up 3s ease-out";
        setTimeout(() => {errorContainer.style.display = "none";}, 2000)
    }, 4000)}


//send to server:

const RequestToCreateNewGame = async (GameSettings) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GameSettings)
    };

    const response = await fetch("http://localhost:8080", requestOptions)
    console.log(response)
}

StartUp();

