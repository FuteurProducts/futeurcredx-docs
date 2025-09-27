# CORS Configuration for Production

## Backend CORS Setup (if you control https://futeur.app)

If you have access to the backend at `https://futeur.app`, configure it to allow CORS from your production domain:

### Express.js Example:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://futeurcredx.com',
    'https://www.futeurcredx.com',
    'http://localhost:8087' // For development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
```

### Nginx Example:
```nginx
location /api/ {
    add_header 'Access-Control-Allow-Origin' 'https://futeurcredx.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-API-Key' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    proxy_pass https://futeur.app;
}
```

## Environment Variables for Production

Set these in your production environment:

```bash
# For production deployment
VITE_API_BASE_URL=https://futeur.app
VITE_USE_MOCK_AUTH=false
```

## Testing Production Setup

1. **Local Production Test:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Check Network Tab:**
   - Open browser dev tools
   - Go to Network tab
   - Make API calls
   - Verify requests go to correct URLs

3. **Console Testing:**
   ```javascript
   // Test in production
   fetch('/api/v1').then(r => r.json()).then(console.log)
   ```
