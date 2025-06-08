// src/components/BackgroundVideo.tsx

import React from 'react'

const BackgroundVideo: React.FC = () => {
  return (
    <div
      className="background-video-container"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0
        }}>
        <source src="/assets/video/main-background.mp4" type="video/mp4" />
        <source src="/assets/video/main-background.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}
      />
    </div>
  )
}

export default BackgroundVideo
