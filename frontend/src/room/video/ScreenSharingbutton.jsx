import React, { useState } from "react";
import SwitchImg from "../../resources/images/switchToScreenSharing.svg";
const ScreenSharingbutton = () => {
  const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
  const handleScheenShareToggle = () => {
    setIsScreenSharingActive(!isScreenSharingActive);
  };
  return (
    <div className="video_button_container">
      <img
        src={SwitchImg}
        alt="share screen"
        onClick={handleScheenShareToggle}
        className="video_button_image"
      />
    </div>
  );
};

export default ScreenSharingbutton;
