'use strict'
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

app.use( express.json(), cors('*') );


app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})

app.post('/', (req, res) => {
  const body = req.body;
  if (!body.GameMode || !body.MaxPlayers || !body.Privacy || !body.Host || !body.Players) {
    console.log("Error Creating Game")
    res.status(400).send("Not all requirements met")
  } else {
    const Gamecode = Math.random().toString().substring(2, 8);
    console.log(Gamecode);
    //console.log(body);
   res.json({"Gamecode": Gamecode}), {depth: null}
  }
  
})