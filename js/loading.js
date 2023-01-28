const Username = localStorage.getItem('User');
const gameCode = localStorage.getItem('gameCode');
const mode = localStorage.getItem('mode')
const socket = io('http://localhost:3000');


socket.on("connect", () => {
  
    socket.emit('UserDetails', Username, gameCode, mode)

});

socket.on("disconnect", () => {

});

