import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';

const CameraDetector = ({ onIdentify, onClose }) => {
  const videoRef = useRef(null);
  const [identifying, setIdentifying] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const detectObject = async () => {
    if (videoRef.current) {
      setIdentifying(true);
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const response = await fetch('http://localhost:3001/api/identify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.product) {
            onIdentify(data.product);
          }
        } else {
          console.error('Failed to analyze image with OpenAI');
        }
      } catch (err) {
        console.error('API Error:', err);
      } finally {
        setIdentifying(false);
      }
    }
  };

  return (
    <div className="camera-modal animate-fade-in">
      <div className="glass-card camera-container">
        <button onClick={onClose} className="close-btn"><X/></button>
        
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="video-feed"
        />
        <div className="camera-controls">
          <button 
            onClick={detectObject} 
            disabled={identifying}
            className="btn-primary camera-trigger"
          >
            {identifying ? 'Scanning with AI...' : <><Camera /> Identify Product</>}
          </button>
        </div>
      </div>
      
      <style>{`
        .camera-modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .camera-container {
          width: 100%;
          max-width: 600px;
          position: relative;
          padding: 0;
          overflow: hidden;
          background: #000;
        }
        .video-feed {
          width: 100%;
          height: auto;
          min-height: 400px;
          object-fit: cover;
        }
        .close-btn {
          position: absolute;
          top: 1rem; right: 1rem;
          background: rgba(255,255,255,0.1);
          border: none; color: white;
          padding: 0.5rem; border-radius: 50%;
          cursor: pointer; z-index: 10;
        }
        .camera-controls {
          position: absolute;
          bottom: 2rem; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 1rem;
        }
        .loading-overlay {
          height: 400px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1rem;
        }
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .predictions {
          position: absolute;
          top: 1rem; left: 1rem;
          padding: 1rem; border-radius: 1rem;
          max-width: 250px;
        }
        .predictions ul { list-style: none; margin-top: 0.5rem; }
        .predictions li { 
          display: flex; justify-content: space-between;
          padding: 0.25rem 0; cursor: pointer;
        }
        .predictions li:hover { color: var(--accent-secondary); }
        .prob { opacity: 0.6; font-size: 0.8rem; }
      `}</style>
    </div>
  );
};

export default CameraDetector;
