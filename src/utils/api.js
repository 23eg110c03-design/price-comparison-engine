const PROXY_URL = '/api/search';

export const searchProducts = async (query) => {
  try {
    const [amazonRes, ebayRes, indiaRes] = await Promise.all([
      fetch(`${PROXY_URL}/amazon?q=${encodeURIComponent(query)}`).then(r => r.json()),
      fetch(`${PROXY_URL}/ebay?q=${encodeURIComponent(query)}`).then(r => r.json()),
      fetch(`${PROXY_URL}/india?q=${encodeURIComponent(query)}`).then(r => r.json())
    ]);

    const products = [];

    // Helper to map results
    const mapItems = (items, defaultPlatform, badgeClass) => {
      if (!items) return;
      items.slice(0, 10).forEach(item => { 
        let priceDisplay = 'Check Site';
        let platform = item.source || defaultPlatform;
        
        // Extract raw price string
        if (typeof item.price === 'string') {
          priceDisplay = item.price;
        } else if (item.price && typeof item.price === 'object' && item.price.raw) {
          priceDisplay = item.price.raw;
        } else if (item.extracted_price) {
          priceDisplay = `₹${item.extracted_price}`;
        }

        // Standardize to INR symbol
        priceDisplay = priceDisplay.replace(/Rs\.|INR/gi, '₹').trim();
        if (!priceDisplay.includes('₹') && /\d/.test(priceDisplay)) {
          priceDisplay = `₹${priceDisplay}`;
        }

        // Standardize platform badges for Indian sites
        let currentBadge = badgeClass;
        const lowPlatform = platform.toLowerCase();
        if (lowPlatform.includes('flipkart')) { platform = 'Flipkart'; currentBadge = 'badge-flipkart'; }
        if (lowPlatform.includes('myntra')) { platform = 'Myntra'; currentBadge = 'badge-myntra'; }
        if (lowPlatform.includes('ajio')) { platform = 'Ajio'; currentBadge = 'badge-ajio'; }
        if (lowPlatform.includes('amazon')) { platform = 'Amazon'; currentBadge = 'badge-amazon'; }

        // Extract the best available direct link
        const finalLink = item.link || item.product_link || item.serpapi_link || '#';

        products.push({
          id: `${platform.toLowerCase()}-${item.position || Math.random()}`,
          title: item.title,
          price: priceDisplay,
          currency: '₹',
          image: item.thumbnail || item.image,
          link: finalLink,
          platform: platform,
          badgeClass: currentBadge
        });
      });
    };

    // Map Results - Prioritize Indian Results first
    mapItems(indiaRes.shopping_results, 'Indian Market', 'badge-india');
    mapItems(amazonRes.organic_results || amazonRes.shopping_results, 'Amazon', 'badge-amazon');
    mapItems(ebayRes.shopping_results || ebayRes.organic_results, 'eBay', 'badge-ebay');

    console.log('Processed Products:', products);
    return products;
  } catch (error) {
    console.error('API integration error:', error);
    return [];
  }
};

// Generate month-wise price history (Mocked for Demo as real historical data is limited in SerpApi base tier)
export const getPriceHistory = (basePrice) => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  
  // Use a default for demo if basePrice is 0
  const startPrice = basePrice > 0 ? basePrice : 1500; 
  let currentPrice = startPrice;

  const data = months.map((month, i) => {
    // Generate a trend-based fluctuation
    const volatility = startPrice * 0.12;
    const trend = i > 3 ? -volatility : (volatility * 0.8) * (Math.random() - 0.4); 
    currentPrice = Math.max(startPrice * 0.7, currentPrice + trend);
    
    return {
      month,
      price: Math.round(currentPrice)
    };
  });
  return data;
};
