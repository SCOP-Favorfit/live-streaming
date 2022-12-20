import React, {useEffect, useRef} from "react";
import {useRecoilState} from "recoil";
import {LocalMediaState} from "store/localState";

function LocalVideo() {
  const ref = useRef(null);
  const [localMedia] = useRecoilState(LocalMediaState);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!localMedia) {
      return;
    }
    ref.current.srcObject = localMedia.video.getMediaStream();
  }, [ref, localMedia]);

  return (
      <div>
        <video ref={ref} muted autoPlay playsInline></video>
      </div>
  );
}

export default LocalVideo;
