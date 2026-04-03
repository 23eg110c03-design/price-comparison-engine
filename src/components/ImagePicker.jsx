import React, { useRef, useState } from 'react';
import { Image, X, Loader2, UploadCloud } from 'lucide-react';

const ImagePicker = ({ onIdentify, onClose }) => {
  const fileInputRef = useRef(null);
  const [identifying, setIdentifying] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      identifyProduct(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const identifyProduct = async (base64Image) => {
    setIdentifying(true);
    try {
      const response = await fetch('http://localhost:3001/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.product) {
          onIdentify(data.product);
        }
      } else {
        console.error('Failed to analyze image');
      }
    } catch (err) {
      console.error('API Error:', err);
    } finally {
      setIdentifying(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="picker-modal animate-fade-in">
      <div className="glass-card picker-container">
        <button onClick={onClose} className="close-btn"><X/></button>
        
        <div className="upload-area" onClick={!identifying ? triggerFileInput : undefined}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            style={{ display: 'none' }}
          />
          
          {preview ? (
            <div className="preview-wrapper">
              <img src={preview} alt="Preview" className="image-preview" />
              {identifying && (
                <div className="overlay">
                  <Loader2 className="spin" size={48} />
                  <span>Analyzing with AI...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="placeholder">
              <UploadCloud size={64} className="upload-icon" />
              <h3>Choose a photo</h3>
              <p>Select a product image from your gallery for instant AI identification.</p>
              <button className="btn-primary mt-4">Browse Gallery</button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .picker-modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .picker-container {
          width: 100%;
          max-width: 500px;
          position: relative;
          padding: 2.5rem;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .close-btn {
          position: absolute;
          top: 1.25rem; right: 1.25rem;
          background: #f5f5f7;
          border: none; color: #1d1d1f;
          padding: 0.5rem; border-radius: 50%;
          cursor: pointer; z-index: 10;
          transition: all 0.2s;
        }
        .close-btn:hover { background: #e8e8ed; }
        
        .upload-area {
          border: 2px dashed #d2d2d7;
          border-radius: 20px;
          min-height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          background: #fafafa;
          overflow: hidden;
          position: relative;
        }
        .upload-area:hover {
          border-color: var(--accent-blue);
          background: rgba(0, 113, 227, 0.02);
        }
        
        .placeholder {
          text-align: center;
          padding: 2rem;
        }
        .upload-icon { color: var(--accent-blue); margin-bottom: 1.5rem; opacity: 0.8; }
        .placeholder h3 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #1d1d1f; }
        .placeholder p { color: #86868b; line-height: 1.5; font-size: 0.95rem; }
        
        .preview-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-preview {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--accent-blue);
          font-weight: 600;
        }
        .spin { animation: spin 1.5s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .mt-4 { margin-top: 1.5rem; }
      `}</style>
    </div>
  );
};

export default ImagePicker;
