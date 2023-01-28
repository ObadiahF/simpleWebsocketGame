const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080
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

app.listen(port, () => {
  console.log(`Express Port: ${port}`)
})


//create game
app.post('/createGame', (req, res) => {

  try {
    const { body } = req;
    const { gameMode, maxPlayers, privacy, host, players } = body;

    // NOTE:
    // camel case is king in JS (unless you're using classes)
    if (!gameMode || !maxPlayers || !privacy || !host || !players) {
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
      gameCode
    }
    Games.push(Game);
    console.log(`New game created with id: ${gameCode}`);
  } catch (err) {
    console.error(err);
    res.status(400).send("Not all requirements met.");
  }
})




io.on('connection', (client) => {
  console.log('New websocket connection');
 
  client.once('UserDetails', (User, Gamecode, mode) => {
    const Player = {
      "Username": User,
      "Socket-id": client.id
    }
    if (mode === "creating") {
      setGameHost(User, Player);
    }

    if (mode === "joining") {
      //joinGame(Player);
    }
  })
   client.on('disconnect', () => {
    console.log('New websocket disconnected');
  });
});

const setGameHost = (User, Player) => {
  Games.forEach(game => {
    if (game.host === User) {
      game.host = Player;
      game.players.push(Player)
      console.log(Games);
      return
    }
  })
}


/*
const joinGame = () => {
  Games.forEach(game => {
    if (game.players.length < game.maxPlayers) {
      game.players.push(Player)
      return 200
    } else {
      return "Game is Full"
    }
  })
}

*/

server.listen(3000, () => {
  console.log('websocket port: 3000');
});