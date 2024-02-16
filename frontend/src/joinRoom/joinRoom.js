import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./joinRoom.css";
import { setIsRoomHost } from "../store/action";
import { connect } from "react-redux";
import JoinRoomTitle from "./joinRoomTitle";
import JoinRoomContent from "./joinRoomContent";

const JoinRoom = (props) => {
  const { setIsRoomHostAction, isRoomHost } = props;
  const search = useLocation().search;

  useEffect(() => {
    const isRoomHost = new URLSearchParams(search).get("host");
    if (isRoomHost) {
      setIsRoomHostAction(true);
    } else {
      setIsRoomHostAction(false);
    }
  }, []);
  return (
    <div className="join_room_page_container">
      <div className="join_room_page_panel">
        <JoinRoomTitle isRoomHost={isRoomHost} />
        <JoinRoomContent />
      </div>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};
const mapActionsToProps = (dispatch) => {
  return {
    setIsRoomHostAction: (isRoomHost) => dispatch(setIsRoomHost(isRoomHost)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinRoom);
