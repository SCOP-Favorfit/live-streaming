import React, {useEffect} from "react";
import {useRecoilState} from "recoil";
import {RoomIdState, RoomState} from "store/roomState";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import {HostState} from "store/hostState";

function Room() {
  const [roomId,] = useRecoilState(RoomIdState);
  const [room,] = useRecoilState(RoomState);
  const [isHost,] = useRecoilState(HostState);

  useEffect(() => {
    init();
  }, [room])

  const init = async() => {
    const _room = room;
    if (isHost) {
      const _localMedia = await ConnectLive.createLocalMedia({
        video: true,
        audio: true,
      });

      const localVideo = _localMedia.video?.attach();
      const localContainer = document.querySelector('#local-container');
      localContainer.textContent = '';
      localContainer.appendChild(localVideo)
      await room.publish([_localMedia]);

      room.on('participantEntered', (evt) => {
        console.log(`## ${evt.remoteParticipant.id} joined`);
      });
      room.on('participantLeft', (evt) => {
        console.log(`## ${evt.remoteParticipantId} left`);
      });
    } // end of host event
    else {

    } // end of guest event
  }

  return (
      <div className="container">
        <header>
          <h1>Room: {roomId}</h1>
        </header>
        <main>
          <div className="room-content">
            <section>
              <div id="local-container"></div>
              <div id="remote-container"></div>
            </section>
            <section>Chat</section>
          </div>
        </main>
      </div>
  );
}

export default Room;