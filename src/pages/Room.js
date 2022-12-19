import React, {useEffect} from "react";
import {useRecoilState} from "recoil";
import {RoomIdState, RoomState} from "store/roomState";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import {HostState} from "store/hostState";
import {useNavigate} from "react-router";

function Room() {
  const navigate = useNavigate();
  const [roomId,] = useRecoilState(RoomIdState);
  const [room,] = useRecoilState(RoomState);
  const [isHost,] = useRecoilState(HostState);

  useEffect(() => {
    init();
  }, [room])

  const init = async() => {
    const _room = room;
    console.log(room.localParticipant);
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

      _room.on('participantEntered', (evt) => {
        console.log(`## ${evt.remoteParticipant.id} joined`);
      });
      _room.on('participantLeft', (evt) => {
        console.log(`## ${evt.remoteParticipantId} left`);
      });
    } // end of host event
    else {
      _room.on('connected', async (evt) => {
        if (!evt.remoteParticipants.length) {
          room.disconnect();
          ConnectLive.signOut();
          alert('No streaming starts yet');
          navigate('/');
        }
        let _remoteParticipants = []
        for (const participant of evt.remoteParticipants) {
          let videos = [];
          const unsubscribedVideos = participant.getUnsubscribedVideos();

          if (unsubscribedVideos.length) {
            const videoIds = unsubscribedVideos.map((video) => video.getVideoId());
            videos = await room.subscribe(videoIds);
          }

          _remoteParticipants.push({participant, videos});
          _remoteParticipants.forEach((remoteParticipant) => {
            const isSameId = remoteParticipant.participant.id === participant.id;
            if (isSameId) {
              const videos = participant.videos;
              const remoteContainer = document.querySelector('#remote-container');

              videos.forEach((video) => {
                const remoteVideo = video.attach();
                remoteContainer.textContent = '';
                remoteContainer.appendChild(remoteVideo);
              });
            }
          });
        }
      });
    } // end of guest event
  }



  return (
      <div className="container">
        <header>
          <h1>Room: {roomId}</h1>
          <button>Exit</button>
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