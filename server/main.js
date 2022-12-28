const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const clients = new Map();

console.log("Starting...")

wss.on('connection', (ws) => {
    console.log("a user as connected!")
    ws.send("sup")
})

wss.on('close', (ws) => {
    console("client as dissconnected!")
})

wss.on('message', function message(data) {
    console.log('received: %s', data);
  });