import React from "react";

const LeaveRoomButton = () => {
  const handleRoomConnection = () => {
    const siteUrl = window.location.origin;
    window.location.href = siteUrl;
  };
  return (
    <div className="video_button_container">
      <button className="video_button_end" onClick={handleRoomConnection}>
        Leave room
      </button>
    </div>
  );
};

export default LeaveRoomButton;
