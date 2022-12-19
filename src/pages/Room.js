import React, {useState, useEffect} from "react";
import {useRecoilState} from "recoil";
import {RoomIdState, RoomState} from "store/roomState";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import {HostState} from "store/hostState";
import {useNavigate} from "react-router";
import Chat from "components/Chat";

function Room() {
  const navigate = useNavigate();
  const [roomId,] = useRecoilState(RoomIdState);
  const [room,] = useRecoilState(RoomState);
  const [isHost, setIsHost] = useRecoilState(HostState);
  const [localMedia, setLocalMedia] = useState(null);
  const [remoteParticipants, setRemoteParticipants] = useState([]);

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
          setRemoteParticipants((oldRemoteParticipants) => [...oldRemoteParticipants, participant.id]);
        }
      });
    } // end of guest event
    room.on('disconnected', async () => {
      disconnectRoom();
    });
    _room.on('participantEntered', (evt) => {
      setRemoteParticipants((oldRemoteParticipants) => [
        ...oldRemoteParticipants,
        evt.remoteParticipant.id,
      ]);
    });
    _room.on('participantLeft', (evt) => {
      setRemoteParticipants((oldRemoteParticipants) => {
        return oldRemoteParticipants.filter((participant) => {
          return evt.remoteParticipantId !== participant;
        });
      });
    });
  }

  const disconnectRoom = () => {
    room.disconnect();
    ConnectLive.signOut();
    localMedia?.stop();
    setLocalMedia(null);
    setIsHost(false);
    navigate('/');
  }

  return (
      <div className="container">
        <header>
          <h1>Room: {roomId}</h1>
          <button onClick={disconnectRoom}>Exit</button>
        </header>
        <main>
          <div className="room-content">
            <section>
              <div id="local-container"></div>
              <div id="remote-container"></div>
              <div>
                <h1>Participants</h1>
                {remoteParticipants.map((participant) => (<div key={participant}>{participant}</div>))}
              </div>
            </section>
            <section>
              <Chat />
            </section>
          </div>
        </main>
      </div>
  );
}

export default Room;