import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
let CurrentGames = [];

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    const GameSettings = data.toString().split(',');
    if (GameSettings.length === 5) {
      if (GameSettings[4] === "Creating") {
        StartGame(GameSettings);
      }
      if (GameSettings[4] === "Joining") {
        JoinGame(GameSettings);
      }
    }  else {
      ws.send("error");
    }
  });

  const StartGame = (settings) => {
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
  }

  const JoinGame = (settings) => {
    CurrentGames.forEach(game => console.log(game));
  }

  }

);

