const axios = require('axios');
async function test() {
  try {
    console.log("Testing India-specific search endpoint (earbuds)...");
    const res = await axios.get('http://localhost:3001/api/search/india?q=earbuds');
    console.log("India Results Keys:", Object.keys(res.data));
    if (res.data.shopping_results) {
      console.log("Found Shopping Results:", res.data.shopping_results.length);
      const topResults = res.data.shopping_results.slice(0, 3).map(item => ({
        title: item.title,
        price: item.price,
        source: item.source
      }));
      console.log("Top 3 Results:", JSON.stringify(topResults, null, 2));
    } else {
      console.log("No shopping results found.");
    }
  } catch (e) {
    console.error("Test failed:", e.message);
  }
}
test();
