import React from "react";
import { useState } from "react";
import SendMessageButton from "../../resources/images/sendMessageButton.svg";
import * as webRTCHandler from "../../utils/webRTCHandler";

const NewMessage = () => {
  const [message, setMessage] = useState("");

  //   const handleKeyPressed = (event) => {
  //     if ((event.key = "Enter")) {
  //       event.preventDefault();
  //       sendMessage();
  //     } else {
  //       console.log(event.key);
  //     }
  //   };

  const handleTextChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    if (message.length > 0) {
      webRTCHandler.sendMessageUsingDataChannel(message);
    }
    setMessage("");
  };
  return (
    <div className="new_message_container">
      <input
        name="message"
        type="text"
        value={message}
        onChange={(e) => handleTextChange(e)}
        placeholder="Type your message..."
        className="new_message_input"
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />
      <img
        src={SendMessageButton}
        alt="send message"
        onClick={sendMessage}
        className="new_message_buttom"
      />
    </div>
  );
};

export default NewMessage;
