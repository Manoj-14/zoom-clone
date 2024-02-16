import React from "react";
import ConnectingButton from "./connectingButton";
import { useNavigate } from "react-router-dom";

const ConnectingButtons = () => {
  let history = useNavigate();

  const pushToJoinRoomPage = () => {
    history("/join-room");
  };
  const pushToJoinRoomPageAsHost = () => {
    history("/join-room?host=true");
  };
  return (
    <div className="connecting_button_container">
      <ConnectingButton
        buttonText="Join a meeting"
        onClickHandler={pushToJoinRoomPage}
      />
      <ConnectingButton
        createRoomButton={true}
        buttonText="Host a meeting"
        onClickHandler={pushToJoinRoomPageAsHost}
      />
    </div>
  );
};

export default ConnectingButtons;
