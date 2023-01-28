const Username = localStorage.getItem('User');
const gameCode = localStorage.getItem('gameCode')
const socket = io('http://localhost:3000');

socket.on("connect", () => {

});

socket.on("disconnect", () => {

});

