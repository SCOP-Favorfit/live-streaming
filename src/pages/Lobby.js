import React, {useState} from "react";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import "./style.css";

function Lobby() {
  const [createRoomId, setCreateRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');


  const changeRoomId = (evt) => {
    evt.target.name === 'create' ? setCreateRoomId(evt.target.value) : setJoinRoomId(evt.target.value);
  }

  return (
      <div className="container">
        <header>
          <h1>Live Streaming</h1>
        </header>
        <main>
          <section className="connect-room">
            <form>
              <input name="create" placeholder="Room ID" value={createRoomId} onChange={changeRoomId} />
              <button>Create Room</button>
            </form>
            <form>
              <input name="join" placeholder="Room ID" value={joinRoomId} onChange={changeRoomId}/>
              <button>Join Room</button>
            </form>
          </section>
        </main>
      </div>
  );
}

export default Lobby;