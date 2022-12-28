const howManyPlayersBtn = document.querySelectorAll('.players');
const privacyBtn = document.querySelectorAll('.privacy');
const createGameBtn = document.getElementById('.create-game');
const gamemodeBtn = document.querySelectorAll('.gamemode2');

let players;
let gameMode;
let privacy;

gamemodeBtn.forEach(el => el.addEventListener('click', () => {
    if (gamemodeBtn.forEach(ex => ex.classList.contains('clicked'))) {
        
    }
    gameMode = el.textContent;
    alert(el.textContent)
}))

howManyPlayersBtn.forEach(el => el.addEventListener('click', () => {
    players = el.textContent;
}))

privacyBtn.forEach(el => el.addEventListener('click', () => {
    privacy = el.textContent;
}))

createGameBtn.addEventListener('click', () => {
    
})