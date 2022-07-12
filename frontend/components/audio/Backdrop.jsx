import React, { useEffect } from 'react';
import "../../styles/Audio.module.css"
const Backdrop = ({
  activeColor,
  trackIndex,
  isPlaying,
}) => {
  useEffect(() => {
    document.documentElement.style.setProperty('--active-color', activeColor);
  }, [trackIndex]);

  return (
    <div className={`color-backdrop ${isPlaying ? 'playing' : 'idle'}`} />
  );
};

export default Backdrop;