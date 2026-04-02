const axios = require('axios');
async function test() {
  try {
    console.log("Testing India-specific search endpoint...");
    const res = await axios.get('http://localhost:3001/api/search/india?q=earbuds');
    console.log("India Results Keys:", Object.keys(res.data));
    if (res.data.shopping_results) {
      console.log("Found Shopping Results:", res.data.shopping_results.length);
      console.log("First Result:", {
        title: res.data.shopping_results[0].title,
        price: res.data.shopping_results[0].price,
        source: res.data.shopping_results[0].source
      });
    } else {
      console.log("No shopping results found. Data:", JSON.stringify(res.data).substring(0, 500));
    }
  } catch (e) {
    console.error("Test failed:", e.message);
  }
}
test();
