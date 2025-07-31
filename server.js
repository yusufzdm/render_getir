const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Food Order Platform Webhook Proxy v2.0',
    supportedPlatforms: ['getir', 'trendyol'],
    endpoints: [
      '/webhook/getir/order-created',
      '/webhook/getir/order-cancelled', 
      '/webhook/trendyol/created',
      '/webhook/trendyol/shipped',
      '/webhook/trendyol/delivered',
      '/webhook/trendyol/cancelled',
      '/webhook/trendyol/unsupplied'
    ]
  });
});

// Generic webhook proxy function
async function forwardWebhook(platform, eventType, req, res) {
  try {
    const baseUrl = process.env.TARGET_URL; // ngrok URL
    const apiKey = process.env.API_KEY || 'b7f3e2c1-4a5d-4e8b-9c2a-1f6e7d8c9b0a';
    
    // YENİ generic endpoint format
    const targetUrl = `${baseUrl}/api/webhooks/${platform}/${eventType}`;
    
    console.log(`${platform.toUpperCase()} ${eventType} webhook received, forwarding to:`, targetUrl);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-platform': platform,
        'x-event-type': eventType
      },
      body: JSON.stringify(req.body)
    });

    const responseText = await response.text();
    console.log(`Forward response status: ${response.status}, body:`, responseText);
    
    if (response.ok) {
      res.status(200).json({ success: true, platform, eventType });
    } else {
      res.status(response.status).json({ 
        success: false, 
        error: 'Backend processing failed',
        details: responseText 
      });
    }
  } catch (error) {
    console.error(`Proxy error for ${platform} ${eventType}:`, error);
    res.status(500).json({ 
      success: false, 
      error: 'Proxy failed', 
      platform, 
      eventType,
      details: error.message 
    });
  }
}

// ======================
// GETIR WEBHOOK ENDPOINTS
// ======================

// Getir - Yeni sipariş
app.post('/webhook/getir/order-created', async (req, res) => {
  await forwardWebhook('getir', 'order-created', req, res);
});

// Getir - Sipariş iptali  
app.post('/webhook/getir/order-cancelled', async (req, res) => {
  await forwardWebhook('getir', 'order-cancelled', req, res);
});

// ======================
// TRENDYOL WEBHOOK ENDPOINTS
// ======================

// Trendyol - Sipariş oluşturuldu
app.post('/webhook/trendyol/created', async (req, res) => {
  await forwardWebhook('trendyol', 'created', req, res);
});

// Trendyol - Sipariş kargoya verildi
app.post('/webhook/trendyol/shipped', async (req, res) => {
  await forwardWebhook('trendyol', 'shipped', req, res);
});

// Trendyol - Sipariş teslim edildi
app.post('/webhook/trendyol/delivered', async (req, res) => {
  await forwardWebhook('trendyol', 'delivered', req, res);
});

// Trendyol - Sipariş iptal edildi
app.post('/webhook/trendyol/cancelled', async (req, res) => {
  await forwardWebhook('trendyol', 'cancelled', req, res);
});

// Trendyol - Ürün tedarik edilemedi
app.post('/webhook/trendyol/unsupplied', async (req, res) => {
  await forwardWebhook('trendyol', 'unsupplied', req, res);
});

// Trendyol - Kurye yaklaştı
app.post('/webhook/trendyol/couriernearby', async (req, res) => {
  await forwardWebhook('trendyol', 'couriernearby', req, res);
});

// Trendyol - Alım tahmini hesaplandı
app.post('/webhook/trendyol/pickupetacalculated', async (req, res) => {
  await forwardWebhook('trendyol', 'pickupetacalculated', req, res);
});

// Trendyol - Mağaza değişti
app.post('/webhook/trendyol/storechanged', async (req, res) => {
  await forwardWebhook('trendyol', 'storechanged', req, res);
});

// Trendyol - Satıcı değişti
app.post('/webhook/trendyol/sellerchanged', async (req, res) => {
  await forwardWebhook('trendyol', 'sellerchanged', req, res);
});

// ======================
// SERVER STARTUP
// ======================

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Food Order Platform Webhook Proxy v2.0 running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/`);
  console.log(`🎯 Target URL: ${process.env.TARGET_URL}`);
  console.log(`🔑 API Key: ${process.env.API_KEY ? '***SET***' : 'DEFAULT'}`);
}); 
