const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Proxy service running' });
});

// Getir webhook proxy - Yeni sipariş
app.post('/webhook/getir/order-created', async (req, res) => {
  try {
    const targetUrl = process.env.TARGET_URL;
    const apiKey = process.env.API_KEY || 'b7f3e2c1-4a5d-4e8b-9c2a-1f6e7d8c9b0a';
    
    console.log('Order created webhook received, forwarding to:', targetUrl);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(req.body)
    });

    console.log('Forward response status:', response.status);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed' });
  }
});

// Getir webhook proxy - Sipariş iptali
app.post('/webhook/getir/order-cancelled', async (req, res) => {
  try {
    const targetUrl = process.env.TARGET_URL_CANCELLED;
    const apiKey = process.env.API_KEY || 'b7f3e2c1-4a5d-4e8b-9c2a-1f6e7d8c9b0a';
    
    console.log('Order cancelled webhook received, forwarding to:', targetUrl);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(req.body)
    });

    console.log('Forward response status:', response.status);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
}); 