import React, { useState } from "react";
import MicButtonImg from "../../resources/images/mic.svg";
import MicOffButtonImg from "../../resources/images/micOff.svg";
import * as webRTCHandler from "../../utils/webRTCHandler";

const MicButton = () => {
  const [isMicMuted, setMicMuted] = useState(false);

  const handleMicButtonPressed = () => {
    webRTCHandler.toggleMic(isMicMuted);
    setMicMuted(!isMicMuted);
  };
  return (
    <div className="video_button_container">
      <img
        src={isMicMuted ? MicOffButtonImg : MicButtonImg}
        alt="mic"
        onClick={handleMicButtonPressed}
        className="video_button_image"
      />
    </div>
  );
};

export default MicButton;
