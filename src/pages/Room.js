import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router";
import {useRecoilState} from "recoil";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import {RoomIdState, RoomState} from "store/roomState";
import {HostState} from "store/hostState";
import {LocalMediaState} from "store/localState";
import Chat from "components/Chat";
import LocalVideo from "components/LocalVideo";
import "styles/style.css";

function Room() {
  const navigate = useNavigate();
  const [roomId] = useRecoilState(RoomIdState);
  const [room] = useRecoilState(RoomState);
  const [isHost, setIsHost] = useRecoilState(HostState);
  const [localMedia, setLocalMedia] = useRecoilState(LocalMediaState);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const RC = useRef();

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
      setLocalMedia(_localMedia);
      await _room.publish([_localMedia]);
    } // end of host event
    else {
      _room.on('connected', async (evt) => {
        if (!evt.remoteParticipants.length) {
          room.disconnect();
          ConnectLive.signOut();
          alert('No streaming starts yet');
          navigate('/');
        }

        let _remoteParticipants = [];
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
              videos.forEach((video) => {
                const remoteVideo = video.attach();
                RC.textContent = '';
                RC.current.appendChild(remoteVideo);
              });
            }
          });
          setRemoteParticipants((oldRemoteParticipants) => [...oldRemoteParticipants, participant.id]);
        }
      });
    } // end of guest event
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
    _room.on('remoteVideoPublished', () => {
      console.log('## remote video published');
    });
    _room.on('remoteVideoUnpublished', () => {
      console.log('## remote video unpublished');
    });
    _room.on('remoteVideoStateChanged', () => {
      console.log('## remote video state changed');
    });
    room.on('disconnected', async () => {
      disconnectRoom();
    });
  }

  const disconnectRoom = async() => {
    room.disconnect();
    ConnectLive.signOut();
    if (localMedia) localMedia.stop();
    setLocalMedia(null);
    setIsHost(false);
    navigate('/');
  }

  return (
      <div className="container">
        <header className="room-header">
          <h1 className="room-title">{roomId}</h1>
          <div className="localParticipant-name">{room.localParticipant.id}</div>
          <button onClick={disconnectRoom}>Exit</button>
        </header>
        <main>
          <div className="room-content">
            <section className="room-video-container">
              {isHost ? <LocalVideo /> : null}
              <div ref={RC}></div>
              <div>
                <h1>Participants</h1>
                {remoteParticipants.map((participant) => (<div key={participant}>{participant}</div>))}
              </div>
            </section>
            <section className="room-chat-container">
              <Chat />
            </section>
          </div>
        </main>
      </div>
  );
}

export default Room;