const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080
const generateQuestion = require('./questions.js');
app.use(cors('*'));
app.use(express.json());


//websocket setup
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//gamestuff
let Games = [];
let GamesIndex = [];

app.listen(port, () => {
  console.log(`Express Port: ${port}`)
})


//create game
app.post('/createGame', (req, res) => {

  try {
    const { body } = req;
    const { gameMode, maxPlayers, privacy, host, players, status } = body;

    // NOTE:
    // camel case is king in JS (unless you're using classes)
    if (!gameMode || !maxPlayers || !privacy || !host || !players || !status) {
      throw Error(`Couldn't create game: ${JSON.stringify(body)}`);
    }

    const gameCode = Math.random().toString().substring(2, 8);
    res.json({ gameCode });

    const Game = {
      gameMode,
      maxPlayers,
      privacy,
      host,
      players,
      gameCode,
      status,
      "whoAnswered": []
    }
    Games.push(Game);
    GamesIndex.push(gameCode);
    console.log(`New game created with id: ${gameCode}`);
  } catch (err) {
    console.error(err);
    res.status(400).send("Not all requirements met.");
  }
})

app.post('/joinByGameCode', (req, res) => {
  const code = req.body.gameCode;
  const game = findGame(code);
  if (game !== undefined) {
    if (game.players.length == game.maxPlayers) {
      res.status(401).send({'Response': "Game is full"})
    } else {
      res.sendStatus(200);
    }
  } else {
      res.status(404).send({'Response': "Game not found"})
  }
})




io.on('connection', (client) => {
  let publicGames = [];
  
  Games.forEach(game => {
    if (game.privacy !== "Private") {
      publicGames.push(game)
    }
  })

  client.on('JoinableGames', () => {
    client.emit("GameData", publicGames);
    client.to("OpenGames");
  })


  client.on('JoinGame', (User, Gamecode) => {
    const Player = {
      "Username": User,
      "SocketId": client.id,
      "Questions": [],
      "Points": 0
    }
    const game = GamesIndex.indexOf(Gamecode.toString());
  
    let host;
    //check if game is full or if player name is already in use
    try {
      if (Games[game].players.length === 0) {
        Games[game].host = Player;
      }
  } catch {
    Games.splice(Games.indexOf(Games[game], 1));
    client.disconnect();
    return;
  }
    if (Games[game].players.length == Games[game].maxPlayers) {
      client.emit('successfullyJoined', ["Game is full"])
    } else {
    Games[game].players.push(Player);
    if (Games[game].privacy !== "Private") {
     io.emit("newGame", Games[game]);
     publicGames.push(Games[game]);
    } 
    client.join(Gamecode);
    io.to(Gamecode).emit('successfullyJoined', ["ok", Games[game]])
    }
  })


   client.on('disconnect', () => {
    const user = client.id;
    Games.forEach(game => {
      game.players.forEach(player => {
        if (player.SocketId === user) {
          const index = game.players.indexOf(user);
          game.players.splice(index, 1)
          io.to(game).emit('successfullyJoined', ["ok", game]);
          if (game.host.SocketId === user) {
            io.to(game.gameCode).emit("GameClosed");
            const Gamesindex = Games.indexOf(game);
            io.emit("GameDeleted", (Games[Gamesindex]));
            Games.splice(Gamesindex, 1)
            GamesIndex.splice(Gamesindex, 1);
            console.log("Game destroyed!");
          }
        }
      })
    })

  });

  client.on('PlayerKicked', async (data) => {
    const gameCodeArg = data[0];
    const playerArg = data[1]

    const player = findPlayer(playerArg, gameCodeArg);
    const game = findGame(gameCodeArg);

    
    game.players.splice(game.players.indexOf(player), 1);
    io.to(game.GameCode).emit('successfullyJoined', ["ok", game]);

  })

  client.on("GameStarting", (gameCode) => {
    const Game = findGame(gameCode);
    if (Game === undefined) return;

    Game.status = "Playing";
    const questions = generateQuestion(Game.gameMode, 5);
    Game.questions = questions;
    io.to(game.GameCode).emit('Questions', questions);
  })
  

  client.on('answeredQuestion', (args) => {
    const gameCode = args[0];
    const timeStamp = args[1];
    const Game = findGame(gameCode);
    const answer = args[2];
    const whichQuestion = args[3];
    const player = findPlayer(client.id, gameCode);
    let CorrectAnswer
    if (answer == Game.questions[whichQuestion].answer)  {
      CorrectAnswer = true;
    } else {
      CorrectAnswer = false;
    }    
    player.Questions.push({
      "CorrectAnswer": CorrectAnswer,
      "TimeStamp": timeStamp
  })
  Game.whoAnswered.push({
    "CorrectAnswer": CorrectAnswer,
    "TimeStamp": timeStamp,
    "user": player.SocketId

})  

  WhoAnsweredFirst(player, Game, whichQuestion, io);
});

client.on('getPoints', (gameCode) => {
  const player = findPlayer(client.id, gameCode);
  io.to(client.id).emit('points', player.Points)
})

client.on('nextQuestion', (args) => {
  const gameCode = args[0];
  const whichQuestion = args[1];

  const game = findGame(gameCode);

    io.to(game.gameCode).emit('nextQuestion!', (whichQuestion));
})

});

const WhoAnsweredFirst = (player, game, whichQuestion, io) => {
  const list = game.whoAnswered;
  const peopleWhoAnsweredCorrectly = [...game.whoAnswered];
  if (list.length === game.players.length) {
    //sort based off of least number and then do event
    list.forEach(p => {
      if (p.CorrectAnswer === false) {

        let Player;
        game.players.forEach(player => {
          if (player.SocketId === p.user) {
            Player = player;
          }
        })

        io.to(p.user).emit('results', [false, 0, Player.Points]);
        peopleWhoAnsweredCorrectly.splice(peopleWhoAnsweredCorrectly.indexOf(p), 1)
      }
    })
    Awardpoints(io, peopleWhoAnsweredCorrectly, whichQuestion, game)
    list.length = 0;
  }
}

const Awardpoints = (io, list, whichQuestion, game) => {
  const StarterPoints = 500;
  let points = StarterPoints;
  list.sort((a, b) => b.TimeStamp - a.TimeStamp);
  list.forEach(response => {
    const player = list[list.indexOf(response)].user
    points = points + 100;
    const playerObject = findPlayer(player, game.gameCode)
    playerObject.Points += points
    io.to(player).emit('results', [true, points, playerObject.Points]);
  });
  

  setTimeout(() => {
    io.to(game.gameCode).emit("ShowLeaderBoard", [game.players, whichQuestion, game.host]);
    if (game.questions.length <= whichQuestion + 1) {
      io.to(game.gameCode).emit('GameOver');
    }
  }, 5000)
}


const findPlayer = (playerArg, GameCode) => {
  const Game = findGame(GameCode);
  let Player;
  Game.players.forEach(player => {
    if (player.SocketId === playerArg) {
      Player = player;
    }
  })
  return Player;
}

const findGame = (GameCode) => {
  let Game;
  Games.forEach(game => {
    if (game.gameCode == GameCode) {
      Game = game;
    } else {
      game = undefined;
    }
  })
  return Game;
}


server.listen(3000, () => {
  console.log('websocket port: 3000');
})