const path = require('path');
const { createServer } = require('http');
const cors=require('cors')
const express = require('express');
const { getIO, initIO ,connectedUsers} = require('./socket');

const app = express();
app.use(cors());
app.get('/connectedUsers',(req,res)=>{
    const filteredUsers = Object.values(connectedUsers).filter(user => user.name.startsWith("Sheikh "));

    try{
        res.status(200).json({
            status:'sucess',
            numberOfConnectedUsers:Object.keys(connectedUsers).length,
            connectedUsers:filteredUsers
        })
    }catch(e){
        res.status(500).json({
            status:'fail',
            message:'internal server error'
        })
    }
})
app.get('/connectedStudent',(req,res)=>{
    const filteredUsers = Object.values(connectedUsers).filter(user => !user.name.startsWith("Sheikh"));
    try{
        res.status(200).json({
            status:'sucess',
            numberOfConnectedUsers:Object.keys(connectedUsers).length,
            connectedUsers:filteredUsers
        })
    }catch(e){
        res.status(500).json({
            status:'fail',
            message:'internal server error'
        })
    }
})
app.use('/', express.static(path.join(__dirname, 'static')));

const httpServer = createServer(app);

let port = process.env.PORT || 5000;

initIO(httpServer);

httpServer.listen(port)
console.log("Server started on ", port);

getIO();