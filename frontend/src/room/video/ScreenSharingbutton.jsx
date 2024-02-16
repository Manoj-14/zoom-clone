import React, { useState } from "react";
import SwitchImg from "../../resources/images/switchToScreenSharing.svg";
import LocalScreenSharingPreview from "./LocalScreenSharingPreview";
import * as webRTCHandler from "../../utils/webRTCHandler";

const constraints = {
  audio: false,
  video: true,
};

const ScreenSharingbutton = () => {
  const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
  const [screenSharingSteram, setScreenSharingStream] = useState(null);
  const handleScheenShareToggle = async () => {
    if (!isScreenSharingActive) {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } catch (err) {
        console.log("Error in screen sharing");
        console.log(err);
      }
      if (stream) {
        setScreenSharingStream(stream);
        webRTCHandler.toggleScreenShare(isScreenSharingActive, stream);
        setIsScreenSharingActive(true);
      }
    } else {
      webRTCHandler.toggleScreenShare(isScreenSharingActive);
      // switch for video track from camera
      setIsScreenSharingActive(false);
      // stop screen share stream
      screenSharingSteram.getTracks().forEach((t) => t.stop());
      setScreenSharingStream(null);
    }
    // setIsScreenSharingActive(!isScreenSharingActive);
  };
  return (
    <>
      <div className="video_button_container">
        <img
          src={SwitchImg}
          alt="share screen"
          onClick={handleScheenShareToggle}
          className="video_button_image"
        />
      </div>
      {isScreenSharingActive && (
        <LocalScreenSharingPreview stream={screenSharingSteram} />
      )}
    </>
  );
};

export default ScreenSharingbutton;
