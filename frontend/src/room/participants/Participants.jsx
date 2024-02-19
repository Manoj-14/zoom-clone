import React from "react";
import { connect } from "react-redux";
import { setActiveConversation } from "../../store/action";

const SingleParticipants = (props) => {
  const { identity, lastItem, participant, setActiveConversation, socketId } =
    props;

  const handleOpenActiveConversation = () => {
    if (participant.socketId !== socketId) {
      setActiveConversation(participant);
    }
  };
  return (
    <>
      <p
        className="participants_paragraph"
        onClick={handleOpenActiveConversation}
      >
        {identity}
      </p>
      {!lastItem && <span className="participants_separator_line"></span>}
    </>
  );
};

const Participants = ({ participants, setActiveConversation, socketId }) => {
  return (
    <div className="participants_container">
      {participants &&
        participants.map((participant, index) => {
          return (
            <SingleParticipants
              key={participant.identity}
              identity={participant.identity}
              lastItem={participants.length === index + 1}
              participant={participant}
              setActiveConversation={setActiveConversation}
              socketId={socketId}
            />
          );
        })}
    </div>
  );
};

const mapStoreStateToprops = (state) => {
  return {
    ...state,
  };
};

const mapActionStoreProps = (dispatch) => {
  return {
    setActiveConversation: (activeConversation) => {
      dispatch(setActiveConversation(activeConversation));
    },
  };
};

export default connect(mapStoreStateToprops, mapActionStoreProps)(Participants);
