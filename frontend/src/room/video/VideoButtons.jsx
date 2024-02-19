import React from "react";
import MicButton from "./MicButton";
import CameraButton from "./CameraButton";
import LeaveRoomButton from "./LeaveRoomButton";
import ScreenSharingbutton from "./ScreenSharingbutton";
import { connect } from "react-redux";

const VideoButtons = (props) => {
  const { connectOnlyWithAudio } = props;
  return (
    <div className="video_buttons_container">
      <MicButton />
      {!connectOnlyWithAudio && <CameraButton />}
      <LeaveRoomButton />
      {!connectOnlyWithAudio && <ScreenSharingbutton />}
    </div>
  );
};

const mapStateStoreToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStateStoreToProps)(VideoButtons);
