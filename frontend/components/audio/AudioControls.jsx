import React from 'react';
import{ AiOutlinePause as Pause, 
  AiOutlinePlayCircle as Play } from "react-icons/ai"
import {BiSkipNext as Next,
  BiSkipPrevious as Prev} from "react-icons/bi"
import "../../styles/Audio.module.css"

const AudioControls = ({
    isPlaying,
      onPlayPauseClick,
    onPrevClick,
    onNextClick,
  }) => ( 
    <div className="audio-controls">
    <button
      type="button"
      className="prev"
      aria-label="Previous"
      onClick={onPrevClick}
    >
      <Prev size={35}/>
    </button>
    {isPlaying ? (
      <button
        type="button"
        className="pause"
        onClick={() => onPlayPauseClick(false)}
        aria-label="Pause"
      >
        <Pause size={35} />
      </button>
    ) : (
      <button
        type="button"
        className="play"
        onClick={() => onPlayPauseClick(true)}
        aria-label="Play"
      >
        <Play size={35} />
      </button>
    )}
    <button
      type="button"
      className="next"
      aria-label="Next"
      onClick={onNextClick}
    >
      <Next size={35} />
    </button>
  </div>
  )
  
export default AudioControls;