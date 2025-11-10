// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import SelectLayoutStep from './components/SelectLayoutStep.jsx';
import DecorationStep from './components/DecorationStep.jsx';
import CaptureStep from './components/CaptureStep.jsx';

function App() {
  // 1. Quản lý bước
  const [currentStep, setCurrentStep] = useState('select_layout'); // 'select_layout', 'capture', 'decorate'
  
  // 2. Quản lý số lượng ảnh (layout)
  const [photoLayoutCount, setPhotoLayoutCount] = useState(0);

  // 3. Quản lý các ảnh đã chụp (state được nâng lên)
  const [capturedImages, setCapturedImages] = useState([]);

  // Hàm được gọi từ SelectLayoutStep
  const handleLayoutSelect = (count) => {
    setPhotoLayoutCount(count);
    // Khởi tạo một mảng rỗng với đúng số lượng
    setCapturedImages(Array(count).fill(null));
    setCurrentStep('capture');
  };

  // Hàm được gọi từ CaptureStep khi chụp xong
  const handleCaptureComplete = (images) => {
    setCapturedImages(images);
    setCurrentStep('decorate');
  };

  // Render component dựa trên bước hiện tại
  const renderStep = () => {
    switch (currentStep) {
      case 'select_layout':
        return <SelectLayoutStep onLayoutSelect={handleLayoutSelect} />;
      
      case 'capture':
        return (
          <CaptureStep
            layoutCount={photoLayoutCount}
            initialImages={capturedImages}
            onCaptureComplete={handleCaptureComplete}
          />
        );
      
      case 'decorate':
        return <DecorationStep capturedImages={capturedImages} />;

      default:
        return <SelectLayoutStep onLayoutSelect={handleLayoutSelect} />;
    }
  };

  return (
    <div className="app-wrapper">
      {renderStep()}
    </div>
  );
}

export default App;