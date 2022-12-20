import React, {useState, useEffect, useRef} from "react";
import {useRecoilState} from "recoil";
import {LocalMediaState} from "store/localState";
import ConnectLive from "@connectlive/connectlive-web-sdk";
import {RoomState} from "../store/roomState";

function LocalVideo() {
  const ref = useRef(null);
  const [room] = useRecoilState(RoomState);
  const [localMedia, setLocalMedia] = useRecoilState(LocalMediaState);
  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!localMedia) {
      return;
    }
    ref.current.srcObject = localMedia.video.getMediaStream();
  }, [ref, localMedia]);

  const handleEnabledVideo = async () => {
    console.log('## handle enabled video');
    const enabled = !videoEnabled;
    setVideoEnabled(enabled);

    if (localMedia) {
      localMedia.video.setEnabled(enabled);
    } else {
      const media = await ConnectLive.createLocalMedia({
        audio: true,
        video: true,
      });

      setLocalMedia(media);
      await room.publish([media]);
    }
  };

  return (
      <div>
        <video ref={ref} muted autoPlay playsInline></video>
        <button onClick={handleEnabledVideo}>video on/off</button>
      </div>
  );
}

export default LocalVideo;
