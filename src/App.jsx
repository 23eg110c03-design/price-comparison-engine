import React, { useState, useRef } from 'react';
import { Search, Image, Sparkles, Loader2, Info, AlertCircle, X } from 'lucide-react';
import ImagePicker from './components/ImagePicker';
import ProductDashboard from './components/ProductDashboard';
import ShoppingGuide from './components/ShoppingGuide';
import { searchProducts } from './utils/api';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  
  // Dual-Input States
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedName, setAttachedName] = useState('');
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    // Combine identified name and manual text
    const combinedQuery = (attachedName ? `${attachedName} ${query}` : query).trim();
    if (!combinedQuery) return;

    setLoading(true);
    setResults([]);
    setError(null);
    try {
      const data = await searchProducts(combinedQuery);
      if (data && data.length > 0) {
        setResults(data);
      } else {
        setError(`No products found for "${combinedQuery}". Try different keywords.`);
      }
    } catch (err) {
      setError("Search failed. Please ensure the proxy server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onIdentify = (name, image) => {
    setAttachedName(name);
    setAttachedImage(image);
    setShowPicker(false);
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result;
      setAttachedImage(base64Image);
      setAttachedName('');
      setIsIdentifying(true);
      
      try {
        const response = await fetch('/api/identify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image })
        });
        const data = await response.json();
        if (data.product) {
          setAttachedName(data.product);
        }
      } catch (err) {
        console.error('Identification Error:', err);
      } finally {
        setIsIdentifying(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearAttachment = () => {
    setAttachedImage(null);
    setAttachedName('');
  };

  return (
    <div 
      className="app-shell" 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} 
      onDragLeave={() => setIsDragging(false)} 
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
    >
      <header className="apple-header animate-spring">
        <div className="container">
          <div className="nav-brand">
            <Sparkles className="brand-logo" size={28} />
            <h1>PriceAI <span className="region-badge">India</span></h1>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero-section animate-spring">
          <h2 className="hero-title">The best way to shop.</h2>
          <p className="hero-subtitle">Compare prices across all Indian marketplaces in one place.</p>
          
          <div 
            className={`apple-search-wrapper ${isDragging ? 'dragging' : ''} ${attachedImage ? 'has-attachment' : ''}`} 
            onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; processFile(file); }}
          >
            <form id="search-form" onSubmit={handleSearch} className="search-pill">
              <div className="input-content">
                {attachedImage && (
                  <div className="minimized-preview animate-fade-in">
                    <img src={attachedImage} alt="Attachment" />
                    <div className="attachment-info">
                      <span className="attachment-label">Searching for:</span>
                      <strong className="attachment-name">
                        {isIdentifying ? <Loader2 className="spin" size={14} /> : attachedName || 'Identifying...'}
                      </strong>
                    </div>
                    <button type="button" className="clear-attachment" onClick={clearAttachment}><X size={14}/></button>
                  </div>
                )}
                
                <div className="text-input-row">
                  <Search className="search-icon" size={20} />
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={attachedImage ? "Add details (color, size, etc.)" : "Search for Mobiles, Kurtas, Groceries..."}
                    className="apple-input"
                  />
                </div>
              </div>

              <div className="search-actions">
                <button 
                  type="button" 
                  onClick={() => setShowPicker(true)}
                  className="icon-btn"
                  title="Upload Image"
                >
                  <Image size={20} />
                </button>
                <button type="submit" disabled={loading || isIdentifying} className="search-submit">
                  {loading ? <Loader2 className="spin" size={20} /> : (attachedImage ? 'Search Both' : 'Search')}
                </button>
              </div>
            </form>
            
            <div className="api-notice">
              <Info size={14} />
              <span>{isDragging ? 'Drop Image Here' : 'Search Flipkart, Amazon, Myntra & more'}</span>
            </div>
          </div>
        </section>

        {error && (
          <div className="error-card animate-spring">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {results.length > 0 && <ProductDashboard products={results} />}
        
        <ShoppingGuide />
      </main>

      {showPicker && (
        <ImagePicker 
          onIdentify={onIdentify} 
          onClose={() => setShowPicker(false)} 
        />
      )}

      <style>{`
        .app-shell { min-height: 100vh; transition: background 0.3s ease; }
        .apple-header { 
          padding: 1.5rem 0; background: rgba(251, 251, 253, 0.8); 
          backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 100;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .nav-brand { display: flex; align-items: center; gap: 0.75rem; }
        .brand-logo { color: var(--accent-blue); }
        .nav-brand h1 { font-size: 1.4rem; font-weight: 700; margin: 0; }
        
        .hero-section { text-align: center; padding: 6rem 0 4rem; }
        .hero-title { font-size: 3.5rem; font-weight: 700; letter-spacing: -0.04em; margin-bottom: 1rem; color: #1d1d1f; }
        .hero-subtitle { font-size: 1.5rem; color: #86868b; margin-bottom: 3.5rem; font-weight: 400; }
        
        .apple-search-wrapper { max-width: 720px; margin: 0 auto; transition: transform 0.3s ease; }
        .apple-search-wrapper.dragging { transform: scale(1.02); }
        
        .search-pill { 
          display: flex; background: white; border: 1px solid #d2d2d7;
          border-radius: 32px; padding: 0.5rem; transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          position: relative; overflow: hidden;
        }
        .apple-search-wrapper.dragging .search-pill { border-color: var(--accent-blue); border-style: dashed; background: rgba(0, 113, 227, 0.02); }
        .search-pill:focus-within { border-color: var(--accent-blue); box-shadow: 0 0 0 4px rgba(0,113,227,0.1); }
        
        .input-content { flex-grow: 1; display: flex; flex-direction: column; }
        .text-input-row { display: flex; align-items: center; padding-left: 1.25rem; }
        
        .minimized-preview {
          margin: 0.5rem 0.75rem 0.75rem;
          padding: 0.75rem 1rem;
          background: #f5f5f7;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }
        .minimized-preview img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .attachment-info { display: flex; flex-direction: column; text-align: left; }
        .attachment-label { font-size: 0.7rem; color: #86868b; text-transform: uppercase; letter-spacing: 0.03em; }
        .attachment-name { font-size: 0.95rem; color: #1d1d1f; }
        .clear-attachment {
          position: absolute; top: -8px; right: -8px;
          background: #1d1d1f; color: white; border: none; border-radius: 50%;
          width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .search-icon { color: #86868b; margin-right: 1rem; }
        .apple-input { 
          border: none; outline: none; font-size: 1.15rem; width: 100%; padding: 0.8rem 0;
          color: #1d1d1f; font-family: inherit; background: transparent;
        }
        
        .search-actions { display: flex; align-items: center; gap: 0.5rem; margin-left: 1rem; }
        .icon-btn { 
          background: transparent; border: none; color: #86868b; padding: 0.75rem;
          border-radius: 50%; cursor: pointer; transition: all 0.2s;
        }
        .icon-btn:hover { background: #f5f5f7; color: #1d1d1f; }
        
        .search-submit { 
          background: var(--accent-blue); color: white; border: none; border-radius: 980px;
          padding: 0.8rem 1.75rem; font-weight: 600; font-size: 0.95rem; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .search-submit:hover { background: #0077ed; }
        .search-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .api-notice { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.25rem; color: #86868b; font-size: 0.9rem; }
        .dragging .api-notice { color: var(--accent-blue); font-weight: 600; }

        .error-card { 
          background: #fff2f2; border: 1px solid #ffdada; border-radius: 14px; 
          padding: 1.25rem; color: #ff3b30; display: flex; align-items: center; gap: 0.75rem;
          margin-top: 2rem; justify-content: center;
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
