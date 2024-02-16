import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import JoinRoom from "./joinRoom/joinRoom";
import Room from "./room/room";
import Introduction from "./introduction/introduction";
import { connectWithSockerIOServer } from "./utils/wss";
function App() {
  useEffect(() => {
    connectWithSockerIOServer();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/join-room" element={<JoinRoom />}></Route>
        <Route path="/room" element={<Room />}></Route>
        <Route path="/" element={<Introduction />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
