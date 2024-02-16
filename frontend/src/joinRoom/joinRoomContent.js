import React, { useState } from "react";
import JoinRoomInputs from "./joinRoomInputs";
import { connect } from "react-redux";
import OnlyWithAudioCheckbox from "./onlyWithAudioCheckbox";
import {
  setConnectOnlyWithAudio,
  setIdentity,
  setRoomId,
} from "../store/action";
import ErrorMessage from "./errorMessage";
import JoinRoomButtons from "./joinRoomButtons";
import { getRoomExists } from "../utils/api";
import { useNavigate } from "react-router-dom";

const JoinRoomContent = (props) => {
  const {
    isRoomHost,
    setConnectOnlyWithAudio,
    connectOnlyWithAudio,
    setIdentityAction,
    setRoomIdAction,
  } = props;
  const [roomIdValue, setRoomIdValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const handleJoinRoom = async () => {
    setIdentityAction(nameValue);
    if (isRoomHost) {
      createRoom();
    } else {
      await joinRoom();
    }
  };

  const joinRoom = async () => {
    const responseMessage = await getRoomExists(roomIdValue);
    const { roomExists, full } = responseMessage;
    if (roomExists) {
      if (full) {
        setErrorMessage("Meeting is full please try again later");
      } else {
        setRoomIdAction(roomIdValue);
        navigate("/room");
      }
    } else {
      setErrorMessage("Room not found. Check your meeting Id");
    }
  };

  const createRoom = () => {
    navigate("/room");
  };

  return (
    <>
      <JoinRoomInputs
        roomIdValue={roomIdValue}
        setRoomIdValue={setRoomIdValue}
        nameValue={nameValue}
        setNameValue={setNameValue}
        isRoomHost={isRoomHost}
      />
      <OnlyWithAudioCheckbox
        setConnectOnlyWithAudio={setConnectOnlyWithAudio}
        connectOnlyWithAudio={connectOnlyWithAudio}
      />
      <ErrorMessage errorMessage={errorMessage} />
      <JoinRoomButtons
        isRoomHost={isRoomHost}
        handleJoinRoom={handleJoinRoom}
      />
    </>
  );
};
const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapActionToProps = (dispatch) => {
  return {
    setConnectOnlyWithAudio: (onlyAudio) =>
      dispatch(setConnectOnlyWithAudio(onlyAudio)),
    setIdentityAction: (identity) => {
      dispatch(setIdentity(identity));
    },
    setRoomIdAction: (roomId) => {
      dispatch(setRoomId(roomId));
    },
  };
};

export default connect(mapStoreStateToProps, mapActionToProps)(JoinRoomContent);
