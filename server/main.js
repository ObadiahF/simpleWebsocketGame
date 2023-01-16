const socketIo = require("socket.io");
const express = require('express');
const { createServer } = require("http");
const { send } = require("process");

const app = express({cors: "*"});
const port = 3000;

app.use(express.json());
//const server = createServer(app);
//const io = socketIo(server, { cors: { origin: "*" } });



app.listen(port, () => {
    console.log(`live on https://localhost:${port}`)
});

app.post('/', (res, req) => {
  const { request } = req.body;
  console.log(request);
  
  res.send({
    "response": "all is good!"
  })
})

/*
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
let CurrentGames = [];

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    const GameSettings = data.toString().split(',');
    if (GameSettings.length === 5) {
      if (GameSettings[4] === "Creating") {
        createGame(GameSettings);
      }
      if (GameSettings[4] === "Joining") {
        JoinGame(GameSettings);
      }
    }  else {
      ws.send("error");
    }
  });

  const createGame = (settings) => {
    let GameCode = Math.random().toString().substring(2, 8);
    const Game = {
      "GameMode": settings[0],
      "Max-players": settings[1],
      "Privacy": settings[2],
      "Host": settings[3],
      "GameCode": GameCode,
      "Players": 1
    }
    CurrentGames.push(Game);
    ws.send(`200, ${GameCode}`);
    
  }

  const JoinGame = (settings) => {
    CurrentGames.forEach(game => console.log(game));
  }

  }

);


*/