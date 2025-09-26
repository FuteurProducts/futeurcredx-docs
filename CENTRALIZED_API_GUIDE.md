# Centralized API Services Guide

This guide explains how to use the centralized API services for login, register, and dashboard operations.

## Overview

The centralized API architecture consists of three main services:

1. **`apiService`** - Core HTTP client with authentication, error handling, and interceptors
2. **`authService`** - Authentication operations (login, register, user management)
3. **`dashboardService`** - Dashboard operations (API keys, stats, testing)

## Quick Start

```typescript
import { authService, dashboardService, apiService } from './services'

// Login user
const authResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

// Get API keys
const apiKeys = await dashboardService.getApiKeys()

// Create API key
const newKey = await dashboardService.createApiKey({
  name: 'My API Key',
  scopes: ['read', 'write']
})
```

## Services

### 1. API Service (`apiService`)

Core HTTP client with built-in features:

```typescript
import apiService from './services/api'

// Basic usage
const response = await apiService.get('/api/v1/endpoint')
const response = await apiService.post('/api/v1/endpoint', data)
const response = await apiService.put('/api/v1/endpoint', data)
const response = await apiService.delete('/api/v1/endpoint')

// With custom config
const response = await apiService.request('/api/v1/endpoint', {
  method: 'POST',
  headers: { 'Custom-Header': 'value' },
  body: { key: 'value' },
  timeout: 5000,
  retries: 3
})
```

**Features:**
- Automatic authentication headers
- Request/response interceptors
- Retry logic with exponential backoff
- Timeout handling
- Error handling and transformation
- Logging in development mode

### 2. Auth Service (`authService`)

Authentication operations:

```typescript
import authService from './services/authService'

// Login
const authResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

// Register
const authResponse = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
})

// Get current user
const user = await authService.getCurrentUser()

// Check authentication
const isAuthenticated = authService.isAuthenticated()

// Logout
authService.logout()
```

**Features:**
- JWT token management
- Automatic token storage
- Mock mode for development
- Error handling with specific error types

### 3. Dashboard Service (`dashboardService`)

Dashboard and API key operations:

```typescript
import dashboardService from './services/dashboardService'

// Get API keys
const apiKeys = await dashboardService.getApiKeys()

// Create API key
const newKey = await dashboardService.createApiKey({
  name: 'My API Key',
  scopes: ['read', 'write'],
  expiresInDays: 30,
  ipWhitelist: ['192.168.1.1'],
  geoRestrictions: ['US', 'CA']
})

// Revoke API key
await dashboardService.revokeApiKey('key-id')

// Get API stats
const stats = await dashboardService.getApiStats()

// Test API endpoint
const result = await dashboardService.testApiEndpoint(
  '/api/v1/credit-report',
  'GET',
  undefined,
  'api-key-here'
)
```

## Configuration

### Environment Variables

```bash
# Enable mock mode for development
VITE_USE_MOCK_AUTH=true

# Set API base URL
VITE_API_BASE_URL=https://futeur.app
```

### Mock Mode

When `VITE_USE_MOCK_AUTH=true` or in development mode, services use localStorage for data persistence:

- **Users**: Stored in `localStorage.mockUsers`
- **API Keys**: Stored in `localStorage.mockApiKeys`
- **Tokens**: Stored in `localStorage.authToken`

## Error Handling

All services return structured error objects:

```typescript
try {
  const result = await authService.login(credentials)
} catch (error) {
  console.error('Error:', error.message)
  console.error('Code:', error.code)
  console.error('Field:', error.field) // For validation errors
}
```

**Common Error Codes:**
- `INVALID_CREDENTIALS` - Wrong email/password
- `USER_EXISTS` - Email already registered
- `VALIDATION_ERROR` - Invalid input data
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `NOT_FOUND` - Resource not found
- `NETWORK_ERROR` - Connection issues

## Integration with React Context

The services are designed to work with React Context:

```typescript
// In your AuthContext
import { authService, dashboardService } from '../services'

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [apiKeys, setApiKeys] = useState([])

  const login = async (email, password) => {
    try {
      const authResponse = await authService.login({ email, password })
      setUser(authResponse.user)
      await refreshApiKeys()
    } catch (error) {
      // Handle error
    }
  }

  const refreshApiKeys = async () => {
    try {
      const keys = await dashboardService.getApiKeys()
      setApiKeys(keys)
    } catch (error) {
      // Handle error
    }
  }

  // ... rest of context implementation
}
```

## Advanced Usage

### Custom Interceptors

```typescript
import apiService from './services/api'

// Add request interceptor
apiService.addRequestInterceptor((config) => {
  // Add custom headers
  config.headers['X-Custom-Header'] = 'value'
  return config
})

// Add response interceptor
apiService.addResponseInterceptor((response) => {
  // Log responses
  console.log('Response received:', response.status)
  return response
})

// Add error interceptor
apiService.addErrorInterceptor((error) => {
  // Custom error handling
  if (error.status === 401) {
    // Redirect to login
    window.location.href = '/login'
  }
  return error
})
```

### Direct API Calls

```typescript
import apiService from './services/api'

// Set API key for requests
apiService.setApiKey('your-api-key-here')

// Make authenticated request
const response = await apiService.get('/api/v1/protected-endpoint')

// Clear API key
apiService.setApiKey(null)
```

## Migration from Old Implementation

### Before (Old Way)
```typescript
// Scattered fetch calls
const response = await fetch('/api/v1/api-keys', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
})

if (!response.ok) {
  const errorText = await response.text()
  throw new Error(`HTTP ${response.status}: ${errorText}`)
}

const result = await response.json()
```

### After (New Way)
```typescript
// Centralized service call
const result = await dashboardService.createApiKey(data)
```

## Benefits

1. **Centralized Logic** - All API calls go through consistent services
2. **Error Handling** - Standardized error handling across the app
3. **Authentication** - Automatic token management
4. **Retry Logic** - Built-in retry with exponential backoff
5. **Logging** - Development logging for debugging
6. **Type Safety** - Full TypeScript support
7. **Mock Mode** - Easy development with mock data
8. **Interceptors** - Flexible request/response modification

## Best Practices

1. **Use Services in Context** - Keep API calls in context providers
2. **Handle Errors** - Always wrap service calls in try/catch
3. **Loading States** - Use loading states for better UX
4. **Error Messages** - Display user-friendly error messages
5. **Mock Mode** - Use mock mode for development and testing
6. **Type Safety** - Use TypeScript interfaces for all data

## Examples

See `src/examples/ServiceUsageExample.tsx` for complete usage examples.

## Troubleshooting

### Common Issues

1. **CORS Errors** - Make sure Vite proxy is configured correctly
2. **Authentication Errors** - Check if token is valid and not expired
3. **Network Errors** - Verify API base URL and network connectivity
4. **Mock Mode Issues** - Clear localStorage if mock data is corrupted

### Debug Mode

Enable debug logging by setting `enableLogging: true` in apiService config:

```typescript
const apiService = new ApiService({
  enableLogging: true
})
```

This will log all requests and responses to the console.
