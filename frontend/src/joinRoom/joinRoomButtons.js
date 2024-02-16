import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ buttonText, cancelButton = false, onClickHandler }) => {
  const buttonClass = cancelButton
    ? "join_room_cancel_button"
    : "join_room_success_button";
  return (
    <button onClick={onClickHandler} className={buttonClass}>
      {buttonText}
    </button>
  );
};

const JoinRoomButtons = ({ handleJoinRoom, isRoomHost }) => {
  const successbuttonText = isRoomHost ? "Host" : "Join";
  const navigation = useNavigate();

  const pushTointroductionPage = () => {
    navigation("/");
  };
  return (
    <div className="join_room_buttons_container">
      <Button buttonText={successbuttonText} onClickHandler={handleJoinRoom} />
      <Button
        buttonText="Cancel"
        cancelButton={true}
        onClickHandler={pushTointroductionPage}
      />
    </div>
  );
};

export default JoinRoomButtons;
