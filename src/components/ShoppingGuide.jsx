import React from 'react';
import { ShoppingCart, ShoppingBag, Laptop, Utensils, Baby, Info } from 'lucide-react';

const ShoppingGuide = () => {
  const categories = [
    {
      title: 'All-in-one',
      icon: <ShoppingCart size={22} />,
      sites: [
        { name: 'Amazon India', desc: 'The everything store' },
        { name: 'Flipkart', desc: 'Electronics & fashion' },
        { name: 'Snapdeal', desc: 'Budget & deals' },
        { name: 'Meesho', desc: 'Value-first reseller' }
      ]
    },
    {
      title: 'Fashion',
      icon: <ShoppingBag size={22} />,
      sites: [
        { name: 'Myntra', desc: 'Clothes & lifestyle' },
        { name: 'Ajio', desc: 'Trendy & brands' },
        { name: 'Tata CLiQ', desc: 'Luxury & tech' },
        { name: 'Nykaa', desc: 'Beauty & cosmetics' }
      ]
    },
    {
      title: 'Electronics',
      icon: <Laptop size={22} />,
      sites: [
        { name: 'Reliance Digital', desc: 'Home & gadgets' },
        { name: 'Croma', desc: 'Electronics expert' }
      ]
    },
    {
      title: 'Essentials',
      icon: <Utensils size={22} />,
      sites: [
        { name: 'BigBasket', desc: 'Grocery specialist' },
        { name: 'JioMart', desc: 'Daily essentials' }
      ]
    }
  ];

  return (
    <div className="shopping-guide animate-spring">
      <div className="guide-header">
        <h2>Expert Choice Guide</h2>
        <p>Where to shop for the best results</p>
      </div>

      <div className="guide-grid">
        {categories.map((cat, idx) => (
          <div key={idx} className="guide-card apple-card">
            <div className="card-top">
              <div className="icon-circle">{cat.icon}</div>
              <h4>{cat.title}</h4>
            </div>
            <div className="site-grid">
              {cat.sites.map((site, sIdx) => (
                <div key={sIdx} className="site-row">
                  <span className="site-name">{site.name}</span>
                  <span className="site-desc">{site.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="tip-cards">
        <div className="tip-card apple-card">
          <Info size={18} />
          <span>Use <b>Amazon</b> or <b>Flipkart</b> for one-day delivery.</span>
        </div>
        <div className="tip-card apple-card">
          <Info size={18} />
          <span>Check <b>Myntra</b> for the latest fashion trends.</span>
        </div>
      </div>

      <style>{`
        .shopping-guide { margin: 6rem 0; }
        .guide-header { text-align: center; margin-bottom: 3.5rem; }
        .guide-header h2 { font-size: 2.2rem; margin-bottom: 0.5rem; }
        .guide-header p { color: var(--text-secondary); font-size: 1.1rem; }
        
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .guide-card { padding: 2rem; }
        .card-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .icon-circle { background: #f5f5f7; padding: 0.75rem; border-radius: 50%; color: var(--accent-blue); }
        .guide-card h4 { font-size: 1.25rem; font-weight: 600; }
        
        .site-grid { display: grid; gap: 1.5rem; }
        .site-row { display: flex; flex-direction: column; }
        .site-name { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
        .site-desc { font-size: 0.85rem; color: var(--text-secondary); }
        
        .tip-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3rem; }
        .tip-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem 2rem; color: var(--text-primary); font-size: 0.95rem; }
        .tip-card b { font-weight: 600; }
      `}</style>
    </div>
  );
};

export default ShoppingGuide;
