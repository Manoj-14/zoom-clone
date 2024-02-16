import React from "react";
import { connect } from "react-redux";

const SingleParticipants = (props) => {
  const { identity, lastItem, participant } = props;
  return (
    <>
      <p className="participants_paragraph">{identity}</p>
      {!lastItem && <span className="participants_separator_line"></span>}
    </>
  );
};

const Participants = ({ participants }) => {
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

export default connect(mapStoreStateToprops)(Participants);
