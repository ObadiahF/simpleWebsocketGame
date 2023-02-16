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

  client.on('JoinGame', (User, Gamecode) => {
    const Player = {
      "Username": User,
      "Socket-id": client.id
    }
    const game = GamesIndex.indexOf(Gamecode.toString())
    Games[game].players.push(Player);

    console.log(Games[game].players);

    client.to(Gamecode);
    client.emit('successfullyJoined', "ok")
  })
   client.on('disconnect', () => {
    console.log('New websocket disconnected');
  });
});


server.listen(3000, () => {
  console.log('websocket port: 3000');
});