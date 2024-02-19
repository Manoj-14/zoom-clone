import React, { useState } from "react";
import SendMessageBtn from "../../../resources/images/sendMessageButton.svg";
import * as wss from "../../../utils/wss";
import { connect } from "react-redux";

const NewMessage = ({ activeConversation, identity }) => {
  const [message, setMessage] = useState("");

  const handleTextChange = (event) => {
    setMessage((prevMsg) => event.target.value);
  };
  const sendMessage = () => {
    wss.sendDirectMessage({
      receiverSocketId: activeConversation.socketId,
      identity: identity,
      messageContent: message,
    });
    setMessage("");
  };

  return (
    <div className="new_message_container new_message_direct_border">
      <input
        type="text"
        className="new_message_input"
        value={message}
        onChange={(e) => handleTextChange(e)}
        placeholder="Type your message.."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <img
        className="new_message_button"
        src={SendMessageBtn}
        alt="send message"
        onClick={sendMessage}
      />
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(NewMessage);
