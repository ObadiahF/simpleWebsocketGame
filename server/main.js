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
    createGame(Game)
  } catch (err) {
    console.error(err);
    res.status(400).send("Not all requirements met.");
  }
})

const createGame = ((Game) => {

})



io.on('connection', (client) => {
  console.log('New websocket connection');
 

   client.on('disconnect', () => {
    console.log('New websocket disconnected');
  });
});

server.listen(3000, () => {
  console.log('websocket port: 3000');
});