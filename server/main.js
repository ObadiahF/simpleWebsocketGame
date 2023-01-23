'use strict'
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
let Games = [];

app.use(cors('*'));
app.use(express.json());


app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})

app.post('/', (req, res) => {

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
  } catch (err) {
    console.error(err);
    res.status(400).send("Not all requirements met.");
  }
})