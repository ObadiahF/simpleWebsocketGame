'use strict'
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors('*'));
app.use(express.json());


app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})

app.post('/', (req, res) => {

  // i like using try-catch for api endpoints, because if some other error throws you'll catch it even if your condition may pass
  try {
    // NOTE:
    // this is called object destructuring- it's pretty pimp so i'd recommend learning it: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    const { body } = req;
    const { gameMode, maxPlayers, privacy, host, players } = body;

    // NOTE:
    // camel case is king in JS (unless you're using classes)
    if (!gameMode || !maxPlayers || !privacy || !host || !players) {
      throw Error(`Couldn't create game: ${JSON.stringify(body)}`);
    }

    const gameCode = Math.random().toString().substring(2, 8);
    console.log(gameCode, body);
    res.json({ gameCode });

  } catch (err) {
    console.error(err);
    res.status(400).send("Not all requirements met.");
  }
})