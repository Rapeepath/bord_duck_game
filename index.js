const express = require('express')
const router = require('./router.js')
//const sender = require('./router.js')
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
const cookiePaser = require('cookie-parser');
const { attachment } = require('express/lib/response');
const { send } = require('process');

app.set('views',path.join(__dirname,"/views"))
app.set('views engine','ejs')
app.set('socketio',io)
//app.set('port', process.env.PORT || 8500);

app.use(cookiePaser());
app.use(express.static(path.join(__dirname,('/public'))))
app.use(router)

server.listen( process.env.PORT || 8500,()=>{
    console.log("link start !!!")
})

//module.exports=io;

//console.log(io)

//console.log("app",io)

io.on('connection',socket =>{
    const {sender} = require('./router.js')
  
   socket.on('send',data =>{
       console.log('reciver')
     io.sockets.emit('reciverd',{name:sender.name,img:sender.img,message:data.message})
   // io.sockets.emit('reciverd',{test:data})
   })

   socket.on('typing',()=>{
     io.sockets.emit('keypress')
   })

   socket.on('amout',data=>{
     console.log('ddd')
    io.sockets.emit('duck',{amout:sender.amout});
   })
   
})
