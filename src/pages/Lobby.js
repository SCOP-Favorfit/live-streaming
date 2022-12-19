import React, {useState} from "react";
import {useNavigate} from "react-router";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import "./style.css";
import {useRecoilState} from "recoil";
import {HostState} from "store/hostState";
import {RoomIdState, RoomState} from "store/roomState";

function Lobby() {
  const navigate = useNavigate();
  const [isHost, setIsHost] = useRecoilState(HostState);
  const [createRoomId, setCreateRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [roomId, setRoomId] = useRecoilState(RoomIdState);
  const [room, setRoom] = useRecoilState(RoomState);
  const [connectingMsg, setConnectingMsg] = useState('');

  const joinRoom = async (evt) => {
    evt.preventDefault();

    await ConnectLive.signIn({
      serviceId: process.env.REACT_APP_KAKAO_ID,
      serviceSecret: process.env.REACT_APP_KAKAO_SECRET,
    })

    isHost ? setRoomId(createRoomId) : setRoomId(joinRoomId);

    const _room = ConnectLive.createRoom();
    if (!roomId) {
      alert('Enter Room Id');
      throw new Error('No Conference to Connect');
    }

    _room.on('connecting', async (evt) => {
      const progress = Math.floor(evt.progress);
      if (progress <= 33) {
        setConnectingMsg('Room Connected');
      } else if (progress <= 66) {
        setConnectingMsg('UpSession Succeed');
      } else if (progress <= 100) {
        setConnectingMsg('DownSession Succeed');
        navigate('/room');
      }
    });

    setConnectingMsg('');
    setRoom(_room);
    await room.connect(roomId);
  };

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
            <form onSubmit={joinRoom}>
              <input name="create" placeholder="Room ID" value={createRoomId} onChange={changeRoomId} />
              <button type="submit" onClick={() => setIsHost(true)}>Create Room</button>
            </form>
            <form onSubmit={joinRoom}>
              <input name="join" placeholder="Room ID" value={joinRoomId} onChange={changeRoomId}/>
              <button type="submit" onClick={() => setIsHost(false)}>Join Room</button>
            </form>
            <div>{connectingMsg}</div>
          </section>
        </main>
      </div>
  );
}

export default Lobby;