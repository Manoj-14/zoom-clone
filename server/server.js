const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const twilio = require("twilio");

const PORT = process.env.PORT || 5002;

const app = express();

const server = http.createServer(app);

app.use(cors());

let connectedUsers = [];
let rooms = [];

app.get("/api/room-exists/:roomId", (req, res) => {
  const { roomId } = req.params;
  const room = rooms.find((room) => room.id === roomId);
  if (room) {
    if (room.connectedUsers.length > 3) {
      return res.send({ roomExists: true, full: true });
    } else {
      return res.send({ roomExists: true, full: false });
    }
  } else {
    return res.send({ roomExists: false });
  }
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("create-new-room", (data) => {
    createNewRoomHandler(data, socket);
  });
  socket.on("join-room", (data) => {
    joinRoomHandler(data, socket);
  });

  socket.on("disconnect", () => {
    disconnectHandler(socket);
  });

  socket.on("conn-signal", (data) => {
    signalingHandler(data, socket);
  });

  socket.on("conn-init", (data) => {
    initializeConnectionHandler(data, socket);
  });
});
// socker io handlers
const createNewRoomHandler = (data, socket) => {
  console.log("Host is creating meeting");
  const { identity } = data;

  const roomId = uuidv4();

  const newUser = {
    identity,
    id: uuidv4(),
    socketId: socket.id,
    roomId,
  };

  // Push that user to connected user
  connectedUsers = [...connectedUsers, newUser];

  // create new room
  const newRoom = {
    id: roomId,
    connectedUsers: [newUser],
  };

  // join socket.io room
  socket.join(roomId);

  rooms = [...rooms, newRoom];

  // emit to client which created that room roomid
  socket.emit("room-id", { roomId });

  //  emit an event to all users connected to that room about new users
  socket.emit("room-update", { connectedUsers: newRoom.connectedUsers });
};

const joinRoomHandler = (data, socket) => {
  const { identity, roomId } = data;
  const newUser = {
    identity,
    id: uuidv4(),
    socketId: socket.id,
    roomId,
  };

  // join room as user which is trying to join room oassing room id
  const room = rooms.find((room) => room.id === roomId);
  room.connectedUsers = [...room.connectedUsers, newUser];

  //  join socket io room
  socket.join(roomId);
  // add new user to connected user array
  connectedUsers = [...connectedUsers, newUser];

  //  emit to all users in room to prepare for connection
  room.connectedUsers.forEach((user) => {
    if (user.socketId !== socket.id) {
      //send new user sockerId to all ather in room
      const data = {
        connectedUserSocketId: socket.id,
      };
      io.to(user.socketId).emit("conn-prepare", data); // -> request go to wss.js
    }
  });

  io.to(roomId).emit("room-update", { connectedUsers: room.connectedUsers });
};

const disconnectHandler = (socket) => {
  const user = connectedUsers.find((user) => user.socketId === socket.id);
  if (user) {
    const room = rooms.find((room) => room.id === user.roomId);
    room.connectedUsers = room.connectedUsers.filter(
      (user) => user.socketId != socket.id
    );
    // leave socket io room
    socket.leave(user.roomId);

    if (room.connectedUsers.length > 0) {
      // emit to all user which are still in the room that user disconnectes
      io.to(room.id).emit("user-disconnected", {
        socketId: socket.id,
      });

      socket.to(room.id).emit("room-update", {
        connectedUsers: room.connectedUsers,
      });
    } else {
      rooms = rooms.filter((room) => room.id != room.id);
    }
  }
};

const signalingHandler = (data, socket) => {
  const { connectedUserSocketId, signal } = data;
  const signalingData = { signal, connectedUserSocketId: socket.id };
  io.to(connectedUserSocketId).emit("conn-signal", signalingData);
};

// info for client which are already in room that they have prepared for incomming connection
const initializeConnectionHandler = (data, socket) => {
  const { connectedUserSocketId } = data;

  const initData = { connectedUserSocketId: socket.id };
  io.to(connectedUserSocketId).emit("conn-init", initData); // emit to wss.js
};

server.listen(PORT, () => {
  console.log("Server is listening on", PORT);
});
