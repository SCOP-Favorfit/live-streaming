import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { CameraDeviceId, MicDeviceId } from "store/deviceState.js";

const DeviceSelect = ({ localMedia }) => {
  const [localCameraDevice, setLocalCameraDevice] = useState([]);
  const [, setCameraDeviceId] = useRecoilState(CameraDeviceId);

  const [localMicDevice, setLocalMicDevice] = useState([]);
  const [, setMicDeviceId] = useRecoilState(MicDeviceId);

  const handleCameraSelect = ($event) => {
    localMedia.switchCamera($event.target.value).then(() => {
      setCameraDeviceId($event.target.value);
    });
  };

  const handleMicSelect = async ($event) => {
    await localMedia.switchMic($event.target.value);
    setMicDeviceId($event.target.value);
  };

  useEffect(() => {
    (async () => {
      if (localMedia) {
        const cameraDevices = await localMedia.getCameraDevices();
        setLocalCameraDevice(cameraDevices);
        const micDevices = await localMedia.getMicDevices();
        setLocalMicDevice(micDevices);
      }
    })();
  }, [localMedia]);

  if (localCameraDevice.length && localMicDevice.length) {
    return (
      <div>
        <div>
          <label htmlFor="country">Camera</label>
          <select onChange={handleCameraSelect}>
            {localCameraDevice.map((item, i) => {
              return (
                <option key={i} value={item.deviceId}>
                  {item.label}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Mic</label>
          <select onChange={handleMicSelect}>
            {localMicDevice.map((item, i) => {
              return (
                <option key={i} value={item.deviceId}>
                  {item.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
};

export default DeviceSelect;
