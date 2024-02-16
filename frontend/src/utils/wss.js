import io from "socket.io-client";
import store from "../store/store";
import { setParticipants, setRoomId } from "../store/action";
import * as webRTCHandler from "./webRTCHandler";

const SERVER = "http://localhost:5002";

let socket = null;

export const connectWithSockerIOServer = () => {
  socket = io(SERVER);
  socket.on("connect", () => {
    console.log("Successfully connected with socket io server");
    console.log(socket.id);
  });

  socket.on("room-id", (data) => {
    const { roomId } = data;
    store.dispatch(setRoomId(roomId));
  });

  socket.on("room-update", (data) => {
    const { connectedUsers } = data;
    console.log(connectedUsers);
    store.dispatch(setParticipants(connectedUsers));
  });
  // listener from server.js
  socket.on("conn-prepare", (data) => {
    const { connectedUserSocketId } = data; //socketId of new user
    webRTCHandler.prepareNewPeerConnection(connectedUserSocketId, false); //false because waiting for the signaling data

    // inform the user which just join the room that we have prepared for the new connection
    socket.emit("conn-init", { connectedUserSocketId: connectedUserSocketId }); // emit to server.js
  });

  socket.on("conn-signal", (data) => {
    webRTCHandler.handleSignalingData(data);
  });

  socket.on("conn-init", (data) => {
    const { connectedUserSocketId } = data;
    webRTCHandler.prepareNewPeerConnection(connectedUserSocketId, true);
  });

  socket.on("user-disconnected", (data) => {
    webRTCHandler.removePeerConnection(data);
  });
};

export const createNewRoom = (identity) => {
  // emit an event to server that need to create a room
  const data = {
    identity,
  };
  socket.emit("create-new-room", data);
};

export const joinRoom = (identity, roomId) => {
  // emit an event to server that need to join a room
  const data = {
    roomId,
    identity,
  };
  socket.emit("join-room", data);
};

export const signalPeerData = (data) => {
  socket.emit("conn-signal", data);
};
