# Getir Webhook Proxy

Bu proxy server, Getir'den gelen webhook'ları local development ortamına yönlendirir.

## Environment Variables

- `TARGET_URL`: Hedef URL (ngrok URL'i)
- `API_KEY`: API anahtarı

## Endpoints

- `GET /`: Health check
- `POST /webhook/getir/order-created`: Getir webhook proxy

## Deployment

Render.com'da deploy edilir.