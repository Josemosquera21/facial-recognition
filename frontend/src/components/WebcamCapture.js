import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  return (
    <div className="webcam-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button onClick={capture} className="capture-button">
        Capturar Foto
      </button>
    </div>
  );
};

export default WebcamCapture;