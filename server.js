import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
    if (error.response) {
      console.error('SerpApi Amazon Error Data:', error.response.data);
    } else {
      console.error('SerpApi Amazon Error Message:', error.message);
    }
    res.status(500).json({ error: 'Failed to fetch results from Amazon' });
  }
});

// Proxy endpoint for eBay (as Flipkart alternative in SerpApi)
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
    console.error('SerpApi Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch results from eBay' });
  }
});

// Proxy endpoint for Google Shopping India (Coverage for Flipkart, Myntra, etc.)
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

    // Assuming image is a base64 Data URL, we need it exactly as required by OpenAI
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
                text: 'Identify the main product in this image. Return only its exact search-friendly name. Return nothing else, no conversational text.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: image, // Use the base64 data URL
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

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
