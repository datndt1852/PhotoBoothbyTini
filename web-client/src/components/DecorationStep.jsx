import React, { useRef } from 'react';
import './styles/DecorationStep.css';

function DecorationStep({ capturedImages }) {
  const canvasRef = useRef(null);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || capturedImages.length === 0) return;

    const ctx = canvas.getContext('2d');
    
    const imagesToLoad = capturedImages.map(imgData => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imgData;
      });
    });

    try {
      const loadedImages = await Promise.all(imagesToLoad);

      const firstImage = loadedImages[0];
      const imgWidth = firstImage.width;
      const imgHeight = firstImage.height;

      const canvasWidth = imgWidth;
      const canvasHeight = imgHeight * loadedImages.length;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      let currentY = 0;
      for (const img of loadedImages) {
        ctx.drawImage(img, 0, currentY, imgWidth, imgHeight);
        currentY += imgHeight;
      }

      const link = document.createElement('a');
      link.download = 'my-photo-strip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error) {
      console.error("Lỗi khi ghép ảnh:", error);
    }
  };

  return (
    <div className="decoration-container">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="stitched-view">
        <div className="stitched-image-wrapper">
          {capturedImages.map((imgSrc, index) => (
            <img key={index} src={imgSrc} alt={`Photo ${index + 1}`} />
          ))}
        </div>
      </div>

      <div className="decoration-controls">
        <h2>Hoàn Thành!</h2>
        <button onClick={handleDownload} className="btn-download-final">
          Tải Ảnh Ghép
        </button>
      </div>
    </div>
  );
}

export default DecorationStep;