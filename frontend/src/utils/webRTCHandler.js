import { setShowOverlay } from "../store/action";
import store from "../store/store";
import * as wss from "./wss";
import Peer from "simple-peer";

import * as process from "process";

window.global = window;
window.process = process;
window.Buffer = [];

const defaultConstraints = {
  audio: true,
  video: {
    width: 480,
    height: 360,
  },
};
let localStream;

export const getLocalPreviewAndInitRoomConnection = async (
  isRoomHost,
  identity,
  roomid = null
) => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      console.log("Successfully received local stream");
      localStream = stream;
      showLocalvideoPreview(localStream);
      store.dispatch(setShowOverlay(false));
      isRoomHost ? wss.createNewRoom(identity) : wss.joinRoom(identity, roomid);
    })
    .catch((err) => {
      console.log("error occoured when trying to get access to local stream");
      console.log(err);
    });
};

let peers = {};
let streams = [];
//configuration to get internt info using stun server
const getConfiguration = () => {
  return {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };
};

export const prepareNewPeerConnection = (
  connectedUserSocketId,
  isInitiator
) => {
  const configuration = getConfiguration();
  peers[connectedUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
  });
  // when getting signal from peer
  peers[connectedUserSocketId].on("signal", (data) => {
    const signalData = {
      signal: data,
      connectedUserSocketId: connectedUserSocketId,
    };
    wss.signalPeerData(signalData);
  });

  peers[connectedUserSocketId].on("stream", (stream) => {
    console.log("new stream came");

    addStream(stream, connectedUserSocketId);
    streams = [...streams, stream];
  });
};

export const handleSignalingData = (data) => {
  peers[data.connectedUserSocketId].signal(data.signal);
};

export const removePeerConnection = (data) => {
  const { socketId } = data;
  console.log(socketId);
  const videoContainer = document.getElementById(socketId);
  const videoElement = document.getElementById(`${socketId}-video`);
  if (videoContainer && videoElement) {
    const tracks = videoElement.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    videoElement.srcObject = null;
    videoContainer.removeChild(videoElement);

    videoContainer.parentElement.removeChild(videoContainer);

    if (peers[socketId]) {
      console.log("peers socket present");
      peers[socketId].destroy();
      console.log("peers socket destroyed");
    }
    delete peers[socketId];
    console.log("peers socket deleted");
  }
};

// UI Video
const showLocalvideoPreview = (stream) => {
  // show local video preview
  const videosContainer = document.getElementById("videos_portal");
  videosContainer.classList.add("videos_portal_styles");
  const videoContainer = document.createElement("div");
  videoContainer.classList.add("video_track_container");
  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.srcObject = stream;
  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };
  videoContainer.appendChild(videoElement);
  videosContainer.appendChild(videoContainer);
};

const addStream = (stream, connectedUserSocketId) => {
  // display incomming stream
  const videosContainer = document.getElementById("videos_portal");
  const videoContainer = document.createElement("div");
  videoContainer.id = connectedUserSocketId;
  videoContainer.classList.add("video_track_container");
  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.srcObject = stream;
  videoElement.id = `${connectedUserSocketId}-video`;
  videoElement.onloadedmetadata = () => {
    videoElement.play();
  };
  videoContainer.appendChild(videoElement);
  videosContainer.appendChild(videoContainer);
  videoElement.addEventListener("click", () => {
    if (videoElement.classList.contains("full_screen")) {
      videoElement.classList.remove("full_screen");
    } else {
      videoElement.classList.add("full_screen");
    }
  });
};
