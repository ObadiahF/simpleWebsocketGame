// buttons
const createBtn = document.getElementById('create-game');
const joinBtn = document.getElementById('join-game');
// errors
const errorContainer = document.getElementById('error');
const errorMessageEl = document.getElementById('error-msg');
// input
const usernameInput = document.getElementById('User-name');

usernameInput.value = "";

const startUp = () => {
    const err = localStorage.getItem('error');
    if (err !== null) {
        errorAnimation(err)
    }
    localStorage.clear();
}


createBtn.addEventListener('click', () => {
    const userName = usernameInput.value;
    //check if the user is just spaces
    if (userName.trim().length === 0) {
        usernameInput.value = "";
        errorAnimation("Invalid username")
    } else {
        localStorage.setItem('User', userName);
        window.location = "pages/create.html"
    }
})

joinBtn.addEventListener('click', () => {
    const userName = usernameInput.value;
    //check if the user is just spaces
    if (userName.trim().length === 0) {
        usernameInput.value = "";
        errorAnimation("Invalid username")
    } else {
        localStorage.setItem('User', userName);
        window.location = "pages/join.html"
    }
})

const errorAnimation = (errorMsg) => {
    errorMessageEl.textContent = errorMsg;
    errorContainer.style.display = "block";
    errorContainer.style.animation = "down 1s ease-out";
    setTimeout(() => {
        errorContainer.style.animation = "up 3s ease-out";
        setTimeout(() => { errorContainer.style.display = "none"; }, 2000)
    }, 4000)
}

startUp();