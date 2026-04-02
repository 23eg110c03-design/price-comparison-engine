import { ExternalLink, TrendingDown, TrendingUp, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';
import PriceTrendChart from './PriceTrendChart';
import { getPriceHistory } from '../utils/api';

const ProductDashboard = ({ products }) => {
  if (!products || products.length === 0) return null;

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    // Robust cleaning for currency symbols and separator commas
    const cleaned = priceStr.toString().replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned);
    return (isNaN(value) || value <= 0) ? 0 : value;
  };

  // Filter for valid prices (greater than 0) before sorting
  const validProducts = products.filter(p => parsePrice(p.price) > 0);
  const sortedByPrice = [...validProducts].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  
  // Use best valid offer, or fallback to first product if none are "valid"
  const bestOffer = sortedByPrice[0] || products[0];
  const historyData = getPriceHistory(parsePrice(bestOffer?.price) || 1000); // Fallback to 1000 for realistic demo if all 0

  // Dynamic Analysis Logic
  const prices = historyData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const minMonth = historyData.find(d => d.price === minPrice)?.month;
  const currentPrice = prices[prices.length - 1];
  const prevPrice = prices[prices.length - 2];
  
  const isTrendingDown = currentPrice < prevPrice;
  const isAtLow = currentPrice <= minPrice * 1.08; // Within 8% of historical low

  const getRecommendation = () => {
    if (isAtLow && isTrendingDown) return { text: "Best time to buy ✅", type: 'success', advice: "Price is at a historical low and trending down. Grab it now!" };
    if (isAtLow) return { text: "Peak value detected 👍", type: 'success', advice: "Price is currently very close to its local minimum." };
    if (isTrendingDown) return { text: "Wait for it... ⏳", type: 'warning', advice: "Price is dropping. You might save more if you wait a few more days." };
    return { text: "Price is peaking 📈", type: 'info', advice: "Currently above average. Consider waiting for the next dip." };
  };

  const rec = getRecommendation();
  const DEFAULT_IMAGE = 'https://via.placeholder.com/200?text=No+Image';

  return (
    <div className="dashboard animate-spring">
      {/* Smart Insights Panel */}
      <div className="insight-panel glass-card">
        <div className="insight-header">
          <div className="insight-title">
            <ShoppingBag className="text-accent" size={24} />
            <h2>Market Insights</h2>
          </div>
          <div className={`rec-badge rec-${rec.type}`}>
            {rec.text}
          </div>
        </div>
        
        <div className="insight-grid">
          <div className="insight-item">
            <span className="label">Historical Low</span>
            <div className="value-row">
              <CheckCircle2 size={18} className="text-success" />
              <span className="value">₹{minPrice.toLocaleString()} ({minMonth})</span>
            </div>
          </div>
          <div className="insight-item">
            <span className="label">Current Trend</span>
            <div className="value-row">
              {isTrendingDown ? <TrendingDown size={18} color="#28cd41" /> : <TrendingUp size={18} color="#ff3b30" />}
              <span className="value">{isTrendingDown ? 'Decreasing' : 'Increasing'}</span>
            </div>
          </div>
          <div className="insight-item">
            <span className="label">Expert Advice</span>
            <p className="advice-text">{rec.advice}</p>
          </div>
        </div>

        <PriceTrendChart data={historyData} />
      </div>

      <div className="section-title">
        <h3>Available Offers</h3>
        <p>Compared across trusted marketplaces</p>
      </div>

      <div className="grid-comparison">
        {products.map((product) => {
          const isLowest = product.id === bestOffer?.id;
          return (
            <div key={product.id} className={`apple-card ${isLowest ? 'featured' : ''}`}>
              {isLowest && <div className="best-price-ribbon">Best Value</div>}
              <div className="platform-tag">{product.platform}</div>
              <div className="img-wrapper">
                <img 
                  src={product.image || DEFAULT_IMAGE} 
                  alt={product.title} 
                  onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                />
              </div>
              <div className="content">
                <h4 title={product.title}>{product.title}</h4>
                <div className="bottom-row">
                  <div className="price-stack">
                    <span className="price-label">Price</span>
                    <span className="price-val">{product.price}</span>
                  </div>
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="buy-btn">
                    Buy <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .dashboard { margin-top: 4rem; }
        .insight-panel { margin-bottom: 4rem; }
        .insight-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .insight-title { display: flex; align-items: center; gap: 0.75rem; }
        .insight-title h2 { font-size: 1.5rem; }
        
        .rec-badge { 
          padding: 0.6rem 1.25rem; border-radius: 980px; font-weight: 600; font-size: 0.95rem;
        }
        .rec-success { background: rgba(40, 205, 65, 0.1); color: #28cd41; }
        .rec-warning { background: rgba(255, 159, 10, 0.1); color: #ff9f0a; }
        .rec-info { background: rgba(0, 113, 227, 0.1); color: #0071e3; }
        
        .insight-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
        .insight-item .label { font-size: 0.85rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem; }
        .value-row { display: flex; align-items: center; gap: 0.5rem; }
        .value { font-size: 1.25rem; font-weight: 600; }
        .advice-text { font-size: 1rem; color: var(--text-primary); margin-top: 0.25rem; }

        .section-title { margin-bottom: 2rem; text-align: center; }
        .section-title h3 { font-size: 1.75rem; margin-bottom: 0.5rem; }
        .section-title p { color: var(--text-secondary); }

        .grid-comparison { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        
        .apple-card { 
          background: var(--bg-white); border: 1px solid var(--glass-border); border-radius: 22px; 
          overflow: hidden; display: flex; flex-direction: column; transition: all 0.4s cubic-bezier(0.2, 1, 0.2, 1);
          position: relative; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .apple-card:hover { transform: scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .apple-card.featured { border-color: var(--accent-blue); }
        
        .best-price-ribbon { 
          position: absolute; top: 1.25rem; right: 1.25rem; background: var(--accent-blue); 
          color: white; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.75rem; font-weight: 600; 
          z-index: 10;
        }
        .platform-tag { position: absolute; top: 1.25rem; left: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; z-index: 10; }
        
        .img-wrapper { background: white; padding: 3rem 2rem 1.5rem; display: flex; justify-content: center; height: 260px; }
        .img-wrapper img { max-width: 100%; height: 100%; object-fit: contain; }
        
        .content { padding: 1.5rem 2rem 2rem; flex-grow: 1; display: flex; flex-direction: column; }
        .content h4 { font-size: 1.1rem; line-height: 1.4; margin-bottom: 1.5rem; color: var(--text-primary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 3rem; }
        
        .bottom-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; }
        .price-stack { display: flex; flex-direction: column; }
        .price-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
        .price-val { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
        
        .buy-btn { background: var(--bg-soft); color: var(--accent-blue); padding: 0.6rem 1.2rem; border-radius: 12px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s; }
        .buy-btn:hover { background: var(--accent-blue); color: white; }
      `}</style>
    </div>
  );
};

export default ProductDashboard;
