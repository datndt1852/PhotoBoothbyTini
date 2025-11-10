import React, { useState, useRef, useEffect } from 'react';
import './App.css'; // Chúng ta sẽ tạo file này ở bước 3

function App() {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Canvas ẩn để chụp ảnh

  // 1. Hàm để khởi động camera
  const startCamera = async () => {
    setError(null);
    setCapturedImage(null); // Xóa ảnh cũ
    try {
      // Yêu cầu quyền truy cập webcam
      const streamData = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 }, // Ưu tiên Full HD
          height: { ideal: 1080 },
          facingMode: 'user' // Ưu tiên camera trước (cho điện thoại)
        },
        audio: false, // Không cần âm thanh
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

  // 2. Tự động gán stream vào thẻ <video> khi 'stream' thay đổi
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  // 3. Hàm chụp ảnh
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Đặt kích thước canvas bằng kích thước video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Vẽ khung hình hiện tại từ video lên canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Lấy dữ liệu ảnh từ canvas (dưới dạng base64)
    const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0); // Chất lượng 90%
    setCapturedImage(imageDataUrl);

    // Dừng stream (nếu muốn, hoặc để chụp tiếp)
    // stopCamera(); 
  };

  // 4. Hàm xóa ảnh đã chụp để chụp lại
  const clearPhoto = () => {
    setCapturedImage(null);
    // Nếu camera chưa chạy, hãy khởi động lại
    if (!stream) {
      startCamera();
    }
  };

  // 5. Hàm dừng camera (nếu cần)
  // const stopCamera = () => {
  //   if (stream) {
  //     stream.getTracks().forEach(track => track.stop());
  //     setStream(null);
  //   }
  // };

  return (
    <div className="app-container">
      {error && <div className="error-message">{error}</div>}

      {/* Canvas ẩn, dùng để xử lý ảnh */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="camera-view">
        {capturedImage ? (
          // Hiển thị ảnh đã chụp
          <img src={capturedImage} alt="Captured" className="captured-image" />
        ) : (
          // Hiển thị video feed
          <video ref={videoRef} className="video-feed" autoPlay playsInline />
        )}
      </div>

      <div className="controls">
        {!stream && !capturedImage && (
          <button onClick={startCamera}>Bắt đầu Camera</button>
        )}

        {stream && !capturedImage && (
          <button onClick={capturePhoto} className="btn-capture">
            Chụp!
          </button>
        )}

        {capturedImage && (
          <>
            <button onClick={clearPhoto}>Chụp Lại</button>
            <a href={capturedImage} download="my-photo.jpg" className="btn-download">
              Tải ảnh
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default App;