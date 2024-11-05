const { Server } = require('socket.io');
let IO;
const connectedUsers = {};
module.exports.connectedUsers=connectedUsers;
module.exports.initIO = (httpServer) => {
    IO = new Server(httpServer, {
        cors: {
            origin: 'http://176.126.78.159:5171', 
            methods: ['GET', 'POST'],
            allowedHeaders: ['my-custom-header'], 
            credentials: true
        }
    });

    IO.use((socket, next) => {
        if (socket.handshake.query) {
            let userName = socket.handshake.query.name;
            socket.user = userName;
            next();
        }
    });

    IO.on('connection', (socket) => {
        socket.join(socket.user);
        connectedUsers[socket.id] = 
        {
            name:socket.user,
            startSora:socket.handshake.query?.startSora||0,
            endSora:socket.handshake.query?.endSora||0,
            startAya:socket.handshake.query?.startAya||0,
            endAya:socket.handshake.query?.endAya||0
        };
        IO.emit('user_connected', { id: socket.id, name: socket.user });
        const filteredUsers = Object.values(connectedUsers).filter(user => !user.name.startsWith("Sheikh"));
        IO.emit('connectedUsersUpdated', Object.values(filteredUsers));
        const simplifiedConnectedUsers = Object.keys(connectedUsers).reduce((result, key) => {
            result[key] = connectedUsers[key].name; 
            return result;
          }, {});
        socket.emit('all_users', simplifiedConnectedUsers);

        socket.on('disconnect', () => {
            if (connectedUsers[socket.id]) {
                delete connectedUsers[socket.id];
                IO.emit('user_disconnected', socket.id);
                IO.emit('connectedUsersUpdated', Object.values(connectedUsers).filter(user => !user.name.startsWith("Sheikh")));
            }
        });
        // Handle incoming call
        socket.on('call', (data) => {
            let callee = data.name;
            let rtcMessage = data.rtcMessage;
            let callType = data.type; // Get call type (voice or video)

            socket.to(callee).emit("newCall", {
                caller: socket.user,
                rtcMessage: rtcMessage,
                callType: callType // Send call type
            });
        });

        // Handle answered call
        socket.on('answerCall', (data) => {
            let caller = data.caller;
            let rtcMessage = data.rtcMessage;

            socket.to(caller).emit("callAnswered", {
                callee: socket.user,
                rtcMessage: rtcMessage
            });
        });
        // Handle ICE candidates
        socket.on('endCall', (data) => {
            let otherUser = data.otherUser;
            socket.to(otherUser).emit("callEnded", {
                from: socket.user
            });
        });

        socket.on('ICEcandidate', (data) => {
            let otherUser = data.user;
            let rtcMessage = data.rtcMessage;

            socket.to(otherUser).emit("ICEcandidate", {
                sender: socket.user,
                rtcMessage: rtcMessage
            });
        });
    });
};

module.exports.getIO = () => {
    if (!IO) {
        throw Error("IO not initialized.");
    } else {
        return IO;
    }
};
