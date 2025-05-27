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
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          zIndex: 2,
          width: '100%',
          padding: '0 20px'
        }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '1rem',
            textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
            color: 'orange'
          }}>
          모르는 개 산책
        </h1>
        <p
          style={{
            fontSize: '1.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            color: '#ffffff',
            lineHeight: '1.8'
          }}>
          산책, 돌봄, 그외 서비스
          <br />
          반려견을 사랑하는 사람과 안전하게 연결하는 플랫폼
        </p>
      </div>
    </div>
  )
}

export default BackgroundVideo
