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
            "Players": players,
            "Privacy": privacy
        }
        //connect to websocket
        const ws = new WebSocket('ws://localhost:7071');
        ws.addEventListener('open', () => {

            ws.send("hey man!")

            ws.addEventListener('message', (e) => {
                alert(e.data);
            })
        })
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