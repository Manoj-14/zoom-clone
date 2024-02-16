import React from "react";
import Logo from "../resources/images/logo.png";
import "./introduction.css";
import ConnectingButtons from "./connectingButtons";

const Introduction = (props) => {
  return (
    <div className="introduction_page_container">
      <div className="introduction_page_panel">
        <img src={Logo} alt="Logo" className="introduction_page_image" />
        <ConnectingButtons />
      </div>
    </div>
  );
};

export default Introduction;
