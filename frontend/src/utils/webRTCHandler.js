import { setMessages, setShowOverlay } from "../store/action";
import store from "../store/store";
import * as wss from "./wss";
import Peer from "simple-peer";

import * as process from "process";
import { fetchTurnCredentials, getTURNIceServers } from "./turn";

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

const onlyAudioConstraints = {
  audio: true,
  video: false,
};
let localStream;

export const getLocalPreviewAndInitRoomConnection = async (
  isRoomHost,
  identity,
  roomid = null,
  onlyAudio
) => {
  await fetchTurnCredentials();
  const constraints = onlyAudio ? onlyAudioConstraints : defaultConstraints;
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      console.log("Successfully received local stream");
      localStream = stream;
      showLocalvideoPreview(localStream);
      store.dispatch(setShowOverlay(false));
      isRoomHost
        ? wss.createNewRoom(identity, onlyAudio)
        : wss.joinRoom(identity, roomid, onlyAudio);
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
  const TURNIceServers = getTURNIceServers();
  if (TURNIceServers) {
    return {
      iceServers: [
        {
          url: "stun:stun.l.google.com:19302",
        },
        ...TURNIceServers,
      ],
    };
  } else {
    console.warn("Using only stunt server");
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
  }
};

const messangerChannel = "messanger";

export const prepareNewPeerConnection = (
  connectedUserSocketId,
  isInitiator
) => {
  const configuration = getConfiguration();
  peers[connectedUserSocketId] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream,
    channelName: messangerChannel,
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

  peers[connectedUserSocketId].on("data", (data) => {
    const messageData = JSON.parse(data);
    appendNewMessage(messageData);
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

  if (store.getState().connectOnlyWithAudio) {
    videoContainer.appendChild(getAudioOnlyLabel());
  } else {
    videoContainer.style.position = "static";
  }
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
  videoElement.addEventListener("click", () => {
    if (videoElement.classList.contains("full_screen")) {
      videoElement.classList.remove("full_screen");
    } else {
      videoElement.classList.add("full_screen");
    }
  });
  videoContainer.appendChild(videoElement);

  const participants = store.getState().participants;
  const participant = participants.find(
    (p) => p.socketId === connectedUserSocketId
  );
  if (participant?.onlyAudio) {
    videoContainer.appendChild(getAudioOnlyLabel(participant.identity));
  } else {
    videoContainer.style.position = "static";
  }
  videosContainer.appendChild(videoContainer);
};

const getAudioOnlyLabel = (identity = "") => {
  const labelContainer = document.createElement("div");
  labelContainer.classList.add("label_only_audio_container");

  const label = document.createElement("p");
  label.classList.add("label_only_audio_text");
  label.innerHTML = `Only audio ${identity}`;

  labelContainer.appendChild(label);
  return labelContainer;
};

//Buttons logic
export const toggleMic = (isMuted) => {
  localStream.getAudioTracks()[0].enabled = isMuted ? true : false;
};

export const toggleCamere = (isDisabled) => {
  localStream.getVideoTracks()[0].enabled = isDisabled ? true : false;
};

export const toggleScreenShare = (
  isScreenSharingActive,
  screenShaingStream = null
) => {
  if (isScreenSharingActive) {
    switchVideoTracks(localStream);
  } else {
    switchVideoTracks(screenShaingStream);
  }
};

const switchVideoTracks = (stream) => {
  for (let socket_id in peers) {
    for (let index in peers[socket_id].streams[0].getTracks()) {
      for (let index2 in stream.getTracks()) {
        if (
          peers[socket_id].streams[0].getTracks()[index].kind ===
          stream.getTracks()[index2].kind
        ) {
          peers[socket_id].replaceTrack(
            peers[socket_id].streams[0].getTracks()[index],
            stream.getTracks()[index2],
            peers[socket_id].streams[0]
          );
          break;
        }
      }
    }
  }
};
//Messages
const appendNewMessage = (messageData) => {
  const messages = store.getState().messages;
  store.dispatch(setMessages([...messages, messageData]));
};

export const sendMessageUsingDataChannel = (messageContent) => {
  const identity = store.getState().identity;

  const localMessageResponse = {
    content: messageContent,
    identity,
    messageCreatedByMe: true,
  };

  appendNewMessage(localMessageResponse);
  const messageData = {
    content: messageContent,
    identity,
  };

  const stringifiedMessageData = JSON.stringify(messageData);
  for (let socketId in peers) {
    peers[socketId].send(stringifiedMessageData);
  }
};
