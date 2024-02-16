import React from "react";
import MicButton from "./MicButton";
import CameraButton from "./CameraButton";
import LeaveRoomButton from "./LeaveRoomButton";
import ScreenSharingbutton from "./ScreenSharingbutton";

const VideoButtons = (props) => {
  return (
    <div className="video_buttons_container">
      <MicButton />
      <CameraButton />
      <LeaveRoomButton />
      <ScreenSharingbutton />
    </div>
  );
};

export default VideoButtons;
