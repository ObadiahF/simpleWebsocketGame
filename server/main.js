const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080
const util = require('util')
app.use(cors('*'));
app.use(express.json());

//websocket setup
const http = require('http');
const { resolve } = require('path');
const { rejects } = require('assert');
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
      status
    }
    Games.push(Game);
    GamesIndex.push(gameCode);
    console.log(`New game created with id: ${gameCode}`);
  } catch (err) {
    console.error(err);
    res.status(400).send("Not all requirements met.");
  }
})




io.on('connection', (client) => {
  console.log('New websocket connection');
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
      "SocketId": client.id
    }
    const game = GamesIndex.indexOf(Gamecode.toString())
    let host;
    //check if game is full or if player name is already in use
    if (Games[game].players.length === 0) {
      Games[game].host = Player;     
    }

    if (Games[game].players.length == Games[game].maxPlayers) {
      client.emit('successfullyJoined', ["Game is full"])
    } else {
    Games[game].players.push(Player);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    if (Games[game].privacy !== "Private") {
     io.emit("newGame", Games[game]);
     publicGames.push(Games[game]);
    } 


    client.to(Gamecode);
    io.emit('successfullyJoined', ["ok", Games[game]])
    }
  })


   client.on('disconnect', () => {
    const user = client.id;
    Games.forEach(game => {
      game.players.forEach(player => {
        if (player.SocketId === user) {
          const index = game.players.indexOf(user);
          game.players.splice(index, 1)

          if (game.host.SocketId === user) {
            io.to(game.gameCode).emit("GameClosed");
            const GamesIndex = Games.indexOf(game);
            io.emit("GameDeleted", (Games[GamesIndex]));
            Games.splice(GamesIndex, 1)
            console.log("Game destroyed!")
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
    io.emit('successfullyJoined', ["ok", game]);

  })

  
});

const findPlayer = (playerArg, GameCode) => {
  const Game = findGame(GameCode);
  let kickedPlayer;
  Game.players.forEach(player => {
    if (player.SocketId === playerArg) {
      kickedPlayer = player;
    }
  })
  return kickedPlayer;
}

const findGame = (GameCode) => {
  let Game;
  Games.forEach(game => {
    if (game.gameCode == GameCode) {
      Game = game;
    }
  })
  return Game;
}


server.listen(3000, () => {
  console.log('websocket port: 3000');
});