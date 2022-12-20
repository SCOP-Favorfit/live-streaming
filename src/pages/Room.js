import React, {useState, useEffect} from "react";
import {useRecoilState} from "recoil";
import {RoomIdState, RoomState} from "store/roomState";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import {HostState} from "store/hostState";
import {useNavigate} from "react-router";
import Chat from "components/Chat";
import "styles/style.css";
import {LocalMediaState} from "store/localState";
import LocalVideo from "components/LocalVideo";

function Room() {
  const navigate = useNavigate();
  const [roomId] = useRecoilState(RoomIdState);
  const [room] = useRecoilState(RoomState);
  const [isHost, setIsHost] = useRecoilState(HostState);
  const [localMedia, setLocalMedia] = useRecoilState(LocalMediaState);
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
      setLocalMedia(_localMedia);
    } // end of host event
    else {
      _room.on('connected', async (evt) => {
        if (!evt.remoteParticipants.length) {
          room.disconnect();
          ConnectLive.signOut();
          alert('No streaming starts yet');
          navigate('/');
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

  const disconnectRoom = async() => {
    room.disconnect();
    ConnectLive.signOut();
    localMedia?.stop();
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
              {isHost ?
                <div>
                  <button>mic</button>
                  <button>video</button>
                </div> : null}
              <LocalVideo />
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