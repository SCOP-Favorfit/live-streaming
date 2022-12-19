import React from "react";
import {useRecoilState} from "recoil";
import {RoomIdState} from "store/roomState";

function Room() {
  const [roomId,] = useRecoilState(RoomIdState);

  return (
      <div className="container">
        <header>
          <h1>Room: {roomId}</h1>
        </header>
        <main>
          <div className="room-content">
            <section>Media</section>
            <section>Chat</section>
          </div>
        </main>
      </div>
  );
}

export default Room;