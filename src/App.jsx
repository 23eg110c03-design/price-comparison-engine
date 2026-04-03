import React, { useState } from 'react';
import { Search, Image, Sparkles, Loader2, Info } from 'lucide-react';
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

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query);
      if (data.length === 0) {
        setError("No products found in Indian marketplaces. Please try a different search term.");
      }
      setResults(data);
    } catch (err) {
      setError("Failed to fetch product data. Ensure the proxy server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onIdentify = (name) => {
    setQuery(name);
    setShowPicker(false);
    // Use manual trigger for search
    handleSearchAutomated(name);
  };

  const handleSearchAutomated = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(searchQuery);
      setResults(data);
    } catch (err) {
      setError("Failed identifying product data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
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
          
          <form id="search-form" onSubmit={handleSearch} className="apple-search-wrapper">
            <div className="search-pill">
              <Search className="search-icon" size={20} />
                <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Mobiles, Kurtas, Groceries and more..."
                className="apple-input"
              />
              <div className="search-actions">
                <button 
                  type="button" 
                  onClick={() => setShowPicker(true)}
                  className="icon-btn"
                  title="Identify Product from Image"
                >
                  <Image size={20} />
                </button>
                <button type="submit" disabled={loading} className="search-submit">
                  {loading ? <Loader2 className="spin" size={20} /> : 'Search'}
                </button>
              </div>
            </div>
            <div className="api-notice">
              <Info size={14} />
              <span>Searching Flipkart, Amazon, Myntra & more</span>
            </div>
          </form>
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
        .app-shell { padding-bottom: 5rem; }
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
        
        .apple-search-wrapper { max-width: 720px; margin: 0 auto; }
        .search-pill { 
          display: flex; align-items: center; background: white; border: 1px solid #d2d2d7;
          border-radius: 980px; padding: 0.5rem 0.5rem 0.5rem 1.75rem; transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .search-pill:focus-within { border-color: var(--accent-blue); box-shadow: 0 0 0 4px rgba(0,113,227,0.1); }
        
        .search-icon { color: #86868b; margin-right: 1rem; }
        .apple-input { 
          border: none; outline: none; font-size: 1.15rem; flex-grow: 1; padding: 0.5rem 0;
          color: #1d1d1f; font-family: inherit;
        }
        .apple-input::placeholder { color: #86868b; }
        
        .search-actions { display: flex; align-items: center; gap: 0.5rem; }
        .icon-btn { 
          background: transparent; border: none; color: #86868b; padding: 0.75rem;
          border-radius: 50%; cursor: pointer; transition: all 0.2s;
        }
        .icon-btn:hover { background: #f5f5f7; color: #1d1d1f; }
        
        .search-submit { 
          background: var(--accent-blue); color: white; border: none; border-radius: 980px;
          padding: 0.6rem 1.75rem; font-weight: 600; font-size: 0.95rem; cursor: pointer;
          transition: all 0.2s;
        }
        .search-submit:hover { background: #0077ed; }
        
        .api-notice { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.25rem; color: #86868b; font-size: 0.9rem; }

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
