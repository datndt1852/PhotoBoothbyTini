import React from 'react';
import './styles/SelectLayoutStep.css';

function SelectLayoutStep({ onLayoutSelect }) {
  return (
    <div className="select-layout-container">
      <h1>Chọn Bố Cục Ảnh</h1>
      <div className="button-group">
        <button onClick={() => onLayoutSelect(3)}>Chụp 3 Ảnh</button>
        <button onClick={() => onLayoutSelect(4)}>Chụp 4 Ảnh</button>
      </div>
    </div>
  );
}

export default SelectLayoutStep;