import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Use CORS for cross-origin search requests
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PriceAI Proxy Serverless Function is active' });
});

// Proxy endpoint for Amazon Search
app.get('/api/search/amazon', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter required' });

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'amazon',
        k: q,
        api_key: process.env.SERPAPI_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('SerpApi Amazon Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch results from Amazon' });
  }
});

// Proxy endpoint for eBay (Flipkart alternative)
app.get('/api/search/ebay', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter required' });

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'ebay',
        _nkw: q,
        api_key: process.env.SERPAPI_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('SerpApi eBay Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch results from eBay' });
  }
});

// Proxy endpoint for Google Shopping India
app.get('/api/search/india', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter required' });

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_shopping',
        q: q,
        gl: 'in',
        hl: 'en',
        location: 'India',
        api_key: process.env.SERPAPI_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('SerpApi India Search Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch results from Indian marketplaces' });
  }
});

// Proxy endpoint for OpenAI image identification
app.post('/api/identify', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Image parameter required' });

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and identify the specific commercial product shown. Focus on the brand name, model, and primary category. Return ONLY a concise, search-optimized product title (e.g., "Sony WH-1000XM4 Headphones") that would yield the best shopping results. If the product is not clearly identifiable, provide the most likely specific search term. Return nothing else.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: image, 
                },
              },
            ],
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const productName = response.data.choices[0].message.content.trim();
    res.json({ product: productName });
  } catch (error) {
    console.error('OpenAI Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to identify the image.' });
  }
});

// For Vercel, the app must be exported
export default app;
