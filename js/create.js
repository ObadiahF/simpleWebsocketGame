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
    localStorage.removeItem('gameCode');
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
    }
})

const errorAnimation = (errorMsg) => {
    errorMessageEl.textContent = errorMsg;
    errorContainer.style.display = "block";
    errorContainer.style.animation = "down 1s ease-out";

    gameModeBtn.forEach(btn => btn.classList.remove('clicked'));
    howManyPlayersBtn.forEach(btn => btn.classList.remove('clicked'));
    privacyBtn.forEach(btn => btn.classList.remove('clicked'));

    setTimeout(() => {
        errorContainer.style.animation = "up 3s ease-out";
        setTimeout(() => { errorContainer.style.display = "none"; }, 2000)
    }, 4000)
}

// send to server:

const requestToCreateNewGame = async (gameSettings) => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameSettings)
    };

    const response = await fetch("http://localhost:8080/createGame", requestOptions)
    if (response.status !== 200) {
        errorAnimation('Error connecting to server')
    } else {
        const { gameCode } = await response.json();
        console.log(gameCode);
        localStorage.setItem('gameCode', gameCode);
        window.location = 'loading.html'
    }
    

}

startUp();