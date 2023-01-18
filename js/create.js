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
        
        const Gamecode = RequestToCreateNewGame(GameSettings);
        Gamecode.catch(ErrorAnimation("Error connecting to server"))
        console.log(Gamecode);
        
    }
})

const ErrorAnimation = (errorMsg) => {
    errorMessageEl.textContent = errorMsg;
    errorContainer.style.display = "block";
    errorContainer.style.animation = "down 1s ease-out";

    gamemodeBtn.forEach(btn => btn.classList.remove('clicked'));
    howManyPlayersBtn.forEach(btn => btn.classList.remove('clicked'));
    privacyBtn.forEach(btn => btn.classList.remove('clicked'));

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

    const response = await fetch("http://localhost:8080", requestOptions);
    const Gamecode = response.json();
    return Gamecode;
    
}

StartUp();

