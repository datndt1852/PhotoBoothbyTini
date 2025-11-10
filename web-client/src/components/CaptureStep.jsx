import React, { useState, useRef, useEffect } from "react";
import "./styles/CaptureStep.css";

function CaptureStep({ layoutCount, initialImages, onCaptureComplete }) {
  const [stream, setStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState(initialImages);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const firstEmpty = initialImages.findIndex((img) => img === null);
    setCurrentSlot(firstEmpty === -1 ? 0 : firstEmpty);
  }, [initialImages]);

  const startCamera = async () => {
    setError(null);
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
        },
        audio: false,
      });
      setStream(streamData);
    } catch (err) {
      console.error("Lỗi truy cập camera:", err);
      if (err.name === "NotAllowedError") {
        setError("Bạn đã từ chối quyền truy cập camera.");
      } else {
        setError("Không tìm thấy camera hoặc đã xảy ra lỗi.");
      }
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    let cropSize = Math.min(videoWidth, videoHeight);
    let offsetX = (videoWidth - cropSize) / 2;
    let offsetY = (videoHeight - cropSize) / 2;

    canvas.width = cropSize;
    canvas.height = cropSize;

    context.drawImage(
      video,
      offsetX,
      offsetY,
      cropSize,
      cropSize,
      0,
      0,
      cropSize,
      cropSize
    );

    const imageDataUrl = canvas.toDataURL("image/jpeg", 1.0);

    const newImages = [...capturedImages];
    newImages[currentSlot] = imageDataUrl;
    setCapturedImages(newImages);

    const nextEmptySlot = newImages.findIndex((img) => img === null);

    if (nextEmptySlot === -1) {
      setCurrentSlot(0);
      onCaptureComplete(newImages);
    } else {
      setCurrentSlot(nextEmptySlot);
    }
  };

  const selectSlotToRetake = (index) => {
    setCurrentSlot(index);
  };

  const clearSlot = (index, e) => {
    e.stopPropagation();
    const newImages = [...capturedImages];
    newImages[index] = null;
    setCapturedImages(newImages);
    setCurrentSlot(index);
  };

  return (
    <div className="app-container">
      {error && <div className="error-message">{error}</div>}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="main-view">
        <div className="camera-view">
          <video ref={videoRef} className="video-feed" autoPlay playsInline />
        </div>
        <div className="controls">
          {!stream && <button onClick={startCamera}>Bắt đầu Camera</button>}
          {stream && (
            <button onClick={capturePhoto} className="btn-capture">
              Chụp Ô {currentSlot + 1}/ {layoutCount}
            </button>
          )}
        </div>
      </div>

      <div className="results-gallery">
        {capturedImages.map((img, index) => (
          <div
            key={index}
            className={`photo-slot ${index === currentSlot ? "active" : ""}`}
            onClick={() => selectSlotToRetake(index)}
          >
            {img ? (
              <>
                <img
                  src={img}
                  alt={`Capture ${index + 1}`}
                  className="captured-image"
                />
                <button
                  className="btn-clear-slot"
                  onClick={(e) => clearSlot(index, e)}
                >
                  X
                </button>
              </>
            ) : (
              <div className="empty-slot">{index + 1}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CaptureStep;
