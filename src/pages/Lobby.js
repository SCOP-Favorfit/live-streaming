import React from "react";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import "./style.css";

function Lobby() {
  return (
      <div className="container">
        <header>
          <h1>Live Streaming</h1>
        </header>
        <main>
          <section className="connect-room">
            <form>
              <input placeholder="Room ID" />
              <button>Create Room</button>
            </form>
            <form>
              <input placeholder="Room ID" />
              <button>Join Room</button>
            </form>
          </section>
        </main>
      </div>
  );
}

export default Lobby;