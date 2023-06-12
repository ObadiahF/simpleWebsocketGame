const playerContainerEl = document.getElementById('player-container');
const playerCounterEl = document.getElementById('player');
const startBtn = document.getElementById('start');
const gameCodeEl = document.getElementById('Game-code')
const Username = localStorage.getItem('User');
const gameCode = localStorage.getItem('gameCode');
const loadingEl = document.querySelector('.ring');
const LobbyEl = document.querySelector('.lobby')
const explantionScreenEl = document.querySelector('.explantionScreen');
const questionsScreenEL = document.querySelector('.questions-containers');
const questionEL = document.getElementById('question');
const answerBtns = document.querySelectorAll('.answer')
const WaitingScreenEL = document.getElementById('waitingScreen');
const WaitingScreenPointsEl = document.getElementById('points');
const WaitingScreenELUserNameEl = document.getElementById('UserName');
const gradeScreen = document.getElementById('gradeScreen');
const QuestionOutput = document.getElementById('QuestionOutput');
const addedPointsEl = document.getElementById('added-points');
const correctSymbolEl = document.querySelector('.fa-check');
const incorrectSymbolEL = document.querySelector('.fa-x');
const lobbyLeaveBtn = document.getElementById('lobbyLeave');
//leaderboard els
const leaderBoardDiv = document.getElementById('leaderboard');
const whichQuestionEl = document.getElementById('whichQuestion');
const numOfQuestions = document.getElementById('NumofQuestions');
const NextQuestionBtn = document.getElementById('NextButton');
const leaderboardContainer = document.querySelector('.leaderboard-container');
const numOfPlayersEl = document.getElementById('numOfPlayers');
const endOfGameBtns = document.getElementById('EndGame');
const lobbyBtn = document.getElementById('Lobby');
const leaveBtn = document.getElementById('Leave');

let players = [];
const socket = io('https://websocket-game-server.onrender.com', {transports: ['websocket']});
let questionsList = [];

socket.on("connect", () => {
    socket.emit('JoinGame', Username, gameCode)

    socket.on('successfullyJoined', (args) => {
        if (args[0] === "ok") {
            setTimeout(() => {
                loadingEl.style.display = "none";
                LobbyEl.style.display = "block";
            }, 1000)
        } else {
            goToHome();
        }
        if (args[1].host.SocketId === socket.id) startBtn.style.display = 'block';
        playerJoin(args[1])

        startBtn.addEventListener('click', (event) => {
            if (players.length < 2) {
                event.preventDefault();
            } else {
                if (args[1].host.SocketId === socket.id) {
                    socket.emit('GameStarting', gameCode);
                    startBtn.style.backgroundColor = 'grey';
                    startBtn.style.cursor = 'not-allowed';
                    startBtn.classList.remove('startActive')
                } else {
                    event.preventDefault();
                }
            }
        })
    })

    socket.on('Questions', (questions) => {
        LobbyEl.style.display = 'none';
        explantionScreenEl.style.display = 'block';
        setTimeout(() => {
            explantionScreenEl.style.display = 'none';
            questionsScreenEL.style.display = 'block';
            questionsList = questions;
            gameStart(questions, 0);
        }, 20000)
    })
    
    socket.on('results', (args) => {
        const result = args[0];
        const addedPoints = args[1];
        const currentPoints = args[2];
        showResultsPage(result, addedPoints, currentPoints);
    })

    socket.on("ShowLeaderBoard", (args) => {
        const playerData = args[0];
        const whichQuestion = args[1];
        const host = args[2];
        ShowLeaderBoard(playerData, whichQuestion, host);
    })


    socket.on('nextQuestion!', (whichQuestion) => {
            leaderBoardDiv.style.display = 'none';
            questionsScreenEL.style.display = 'block';
            generateQuestion(questionsList, whichQuestion);
            //delete the previous scoreboard
            while (leaderboardContainer.firstChild) {
                leaderboardContainer.removeChild(leaderboardContainer.firstChild);
              }
    })

    socket.on('GameOver', () => {
        document.querySelector('#leaderboard h1').textContent = "Final Results"
        NextQuestionBtn.style.display = 'none';
        endOfGameBtns.style.display = 'flex';
    })
});


socket.on('connect_error', () => {
    localStorage.setItem('error', "Failed to connect to server.")
    goToHome();
})

const getCurrentPoints = async () => {
    return new Promise((resolve, reject) => {
      socket.emit('getPoints', gameCode);
  
      socket.on('points', (arg) => {
        resolve(arg);
      });
    });
  };
  


socket.on("disconnect", () => {
    localStorage.setItem('error', "Connection failed.")
    goToHome();
});

const startUp = () => {
    if (!(gameCode) || !(localStorage.getItem('User'))) {
        goToHome()
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
            playerName.textContent = `${player.Username}👑`;
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

const gameStart = (questions, whichQuestion) => {
    generateQuestion(questions, whichQuestion);
}

const generateQuestion = (questions, index) => {
    questionEL.textContent = questions[index].equation;
  const correctAnswerIndex = Math.floor(Math.random() * 4);
  const usedNumbers = []; // Array to store unique random numbers

  answerBtns.forEach((btn, idx) => {
    btn.classList.remove('handled');

    let randomNum;
    if (idx === correctAnswerIndex) {
      randomNum = questions[index].answer;
    } else {
      do {
        randomNum = Math.floor(Math.random() * 10);
      } while (usedNumbers.includes(randomNum) || randomNum === questions[index].answer);
    }

    usedNumbers.push(randomNum); // Add unique random number to the array
    btn.textContent = randomNum;
  });
    
    // answer button event listener
    answerBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            //I added this because for some reason this event fires twice
            if (event.target.classList.contains('handled')) {
                return;
            }
            event.target.classList.add('handled');
            const answer = btn.textContent;
            socket.emit('answeredQuestion', [gameCode, Date.now(), answer, index]);
            index++
            showWaitingScreen();
        }) 
    });


};


const showWaitingScreen = () => {
    
    questionsScreenEL.style.display = 'none';
    WaitingScreenEL.style.display = 'grid';
    getCurrentPoints().then((points) => WaitingScreenPointsEl.textContent = points);
    WaitingScreenELUserNameEl.textContent = Username;
    
}

const showResultsPage = (result, addedPoints, currentPoints) => {
    WaitingScreenEL.style.display = 'none';
    gradeScreen.style.display = 'grid';

    WaitingScreenELUserNameEl.textContent = Username;
    WaitingScreenPointsEl.textContent = currentPoints;

    if (result === true) {
        QuestionOutput.textContent = 'Correct!';
        correctSymbolEl.style.display = 'block'
        incorrectSymbolEL.style.display = 'none';
    } else {
        QuestionOutput.textContent = 'Incorrect!';
        correctSymbolEl.style.display = 'none'
        incorrectSymbolEL.style.display = 'block';
    }

    addedPointsEl.textContent = addedPoints;
    document.getElementById('UserNameFooter').textContent = Username;
    document.getElementById('pointsFooter').textContent = currentPoints;
}

const ShowLeaderBoard = (playerData, whichQuestion, host) => {
    gradeScreen.style.display = 'none';
    leaderBoardDiv.style.display = 'flex';

    whichQuestionEl.textContent = whichQuestion + 1;
    numOfQuestions.textContent = 20;
    numOfPlayersEl.textContent = playerData.length;

    if (host.SocketId !== socket.id) {
        NextQuestionBtn.style.display = 'none';
    }
    playerData.sort((a, b) => b.Points - a.Points);
    if (playerData.length > 5) playerData.length = 5;

    //generate leaderboard showcasing the user data
    playerData.forEach(player => {
        const playerContainer = document.createElement('div');
        playerContainer.classList.add('Player-container');
        playerContainer.innerHTML = `
        <h2 class="Leaderboard-text UsernameText" place="${playerData.indexOf(player) + 1}">${player.Username}</h2>
        <h2 class="Leaderboard-text">${player.Points}</h2>
        `
        leaderboardContainer.appendChild(playerContainer);
        
        NextQuestionBtn.addEventListener('click', () => {
            if (host.SocketId !== socket.id) return
            socket.emit('nextQuestion', ([gameCode, whichQuestion++]));
        })
    })

    leaveBtn.addEventListener('click', () => {
        goToHome()
    })

    lobbyBtn.addEventListener('click', () => {
        leaderBoardDiv.style.display = 'none';
        LobbyEl.style.display = 'block';
    })

}

lobbyLeaveBtn.addEventListener('click', () => {
    goToHome();
})

const goToHome = () => {
    window.location = '../index.html'

}

startUp();