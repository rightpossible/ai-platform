# SSO Integration Guide for Developers

## 🚀 Overview

This guide explains how to integrate your application with our platform's Single Sign-On (SSO) system. Our SSO allows users to seamlessly access your app from our dashboard without requiring separate authentication.

**What you'll learn:**
- How our SSO system works
- How to implement the required `/auth/sso` endpoint
- JWT token validation and user creation
- Security best practices
- Testing and troubleshooting

---

## 🏗️ How Our SSO Works

### User Flow
1. **User clicks your app** in our dashboard
2. **We generate a secure JWT token** containing user information
3. **User is redirected** to your app's SSO endpoint with the token
4. **Your app validates the token** and creates/logs in the user
5. **User is authenticated** and can use your application

### Security Features
- **JWT tokens** with HMAC-SHA256 signing
- **5-minute expiration** for security
- **One-time use tokens** (cannot be reused)
- **Nonce protection** against replay attacks
- **IP and User-Agent tracking**

---

## 🔧 Implementation Requirements

### 1. SSO Endpoint
Your application **must** implement this endpoint:

```
POST /auth/sso
```

### 2. Token Parameter
Tokens are sent as URL query parameters:

```
https://your-app.com/auth/sso?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 JWT Token Structure

### Token Payload
```json
{
  "userId": "string",           // Unique user ID from our platform
  "email": "string",           // User's email address
  "name": "string",            // User's display name
  "role": "string",            // User role: "member", "admin", "owner"
  "targetApp": "string",       // Your app's slug identifier
  "permissions": ["string"],   // Array of user permissions
  "expiresAt": 1704067200000, // Expiration timestamp (Unix)
  "issuedAt": 1704066900000,  // Issue timestamp (Unix)
  "nonce": "string"           // Unique nonce for replay protection
}
```

### Example Decoded Token
```json
{
  "userId": "64f8b1a2c4e5f6a7b8c9d0e1",
  "email": "john@company.com",
  "name": "John Doe",
  "role": "member",
  "targetApp": "your-app-slug",
  "permissions": ["read", "write"],
  "expiresAt": 1704067200000,
  "issuedAt": 1704066900000,
  "nonce": "a1b2c3d4e5f6g7h8"
}
```

---

## 🛠️ Implementation Examples

### Node.js/Express Implementation

#### 1. Install Dependencies
```bash
npm install jsonwebtoken crypto
```

#### 2. SSO Endpoint Implementation
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Your JWT secret (get this from our platform)
const JWT_SECRET = process.env.SSO_JWT_SECRET;

app.post('/auth/sso', async (req, res) => {
  try {
    // Get token from query parameter
    const token = req.query.token;
    
    if (!token) {
      return res.status(400).json({ error: 'SSO token is required' });
    }

    // Validate the JWT token
    const payload = jwt.verify(token, JWT_SECRET, { 
      algorithms: ['HS256'] 
    });

    // Additional security checks
    if (payload.expiresAt < Date.now()) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    if (payload.targetApp !== 'your-app-slug') {
      return res.status(401).json({ error: 'Token not intended for this app' });
    }

    // Validate token is one-time use (call our validation API)
    const isValidToken = await validateTokenWithPlatform(token);
    if (!isValidToken) {
      return res.status(401).json({ error: 'Token has been used or is invalid' });
    }

    // Check if user exists in your database
    let user = await User.findOne({ platformUserId: payload.userId });
    
    if (!user) {
      // Create new user
      user = await User.create({
        platformUserId: payload.userId,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        permissions: payload.permissions
      });
    } else {
      // Update existing user info
      user.email = payload.email;
      user.name = payload.name;
      user.role = payload.role;
      user.permissions = payload.permissions;
      await user.save();
    }

    // Create session for user
    req.session.userId = user.id;
    req.session.platformUserId = payload.userId;

    // Redirect to your app's dashboard
    res.redirect('/dashboard');

  } catch (error) {
    console.error('SSO authentication failed:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Helper function to validate token with our platform
async function validateTokenWithPlatform(token) {
  try {
    const response = await fetch('https://our-platform.com/api/sso/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PLATFORM_API_KEY}`
      },
      body: JSON.stringify({ token })
    });
    
    const result = await response.json();
    return result.valid;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}
```

### Python/Django Implementation

#### 1. Install Dependencies
```bash
pip install PyJWT cryptography requests
```

#### 2. SSO View Implementation
```python
import jwt
import time
import requests
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import User

@csrf_exempt
def sso_auth(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    # Get token from query parameter
    token = request.GET.get('token')
    
    if not token:
        return JsonResponse({'error': 'SSO token is required'}, status=400)
    
    try:
        # Validate JWT token
        payload = jwt.decode(
            token, 
            settings.SSO_JWT_SECRET, 
            algorithms=['HS256']
        )
        
        # Additional security checks
        if payload['expiresAt'] < int(time.time() * 1000):
            return JsonResponse({'error': 'Token has expired'}, status=401)
        
        if payload['targetApp'] != 'your-app-slug':
            return JsonResponse({'error': 'Token not intended for this app'}, status=401)
        
        # Validate token is one-time use
        if not validate_token_with_platform(token):
            return JsonResponse({'error': 'Token has been used or is invalid'}, status=401)
        
        # Get or create user
        user, created = User.objects.get_or_create(
            platform_user_id=payload['userId'],
            defaults={
                'email': payload['email'],
                'name': payload['name'],
                'role': payload['role'],
                'permissions': payload['permissions']
            }
        )
        
        if not created:
            # Update existing user
            user.email = payload['email']
            user.name = payload['name']
            user.role = payload['role']
            user.permissions = payload['permissions']
            user.save()
        
        # Create session
        request.session['user_id'] = user.id
        request.session['platform_user_id'] = payload['userId']
        
        # Redirect to dashboard
        return HttpResponseRedirect('/dashboard/')
        
    except jwt.InvalidTokenError as e:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    except Exception as e:
        return JsonResponse({'error': 'Authentication failed'}, status=500)

def validate_token_with_platform(token):
    try:
        response = requests.post(
            'https://our-platform.com/api/sso/validate',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {settings.PLATFORM_API_KEY}'
            },
            json={'token': token}
        )
        result = response.json()
        return result.get('valid', False)
    except:
        return False
```

### PHP/Laravel Implementation

#### 1. Install Dependencies
```bash
composer require firebase/php-jwt
```

#### 2. SSO Controller
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;

class SSOController extends Controller
{
    public function authenticate(Request $request)
    {
        $token = $request->query('token');
        
        if (!$token) {
            return response()->json(['error' => 'SSO token is required'], 400);
        }
        
        try {
            // Validate JWT token
            $payload = JWT::decode($token, new Key(env('SSO_JWT_SECRET'), 'HS256'));
            
            // Security checks
            if ($payload->expiresAt < (time() * 1000)) {
                return response()->json(['error' => 'Token has expired'], 401);
            }
            
            if ($payload->targetApp !== 'your-app-slug') {
                return response()->json(['error' => 'Token not intended for this app'], 401);
            }
            
            // Validate one-time use
            if (!$this->validateTokenWithPlatform($token)) {
                return response()->json(['error' => 'Token invalid or used'], 401);
            }
            
            // Get or create user
            $user = User::updateOrCreate(
                ['platform_user_id' => $payload->userId],
                [
                    'email' => $payload->email,
                    'name' => $payload->name,
                    'role' => $payload->role,
                    'permissions' => json_encode($payload->permissions)
                ]
            );
            
            // Create session
            auth()->login($user);
            
            return redirect('/dashboard');
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Authentication failed'], 401);
        }
    }
    
    private function validateTokenWithPlatform($token)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('PLATFORM_API_KEY'),
            'Content-Type' => 'application/json'
        ])->post('https://our-platform.com/api/sso/validate', [
            'token' => $token
        ]);
        
        return $response->json()['valid'] ?? false;
    }
}
```

---

## 🔒 Security Requirements

### 1. JWT Secret Management
- **Never hardcode** the JWT secret in your code
- **Use environment variables** to store secrets
- **Keep secrets secure** and rotate them periodically

```bash
# .env file
SSO_JWT_SECRET=your-secret-from-our-platform
PLATFORM_API_KEY=your-api-key-from-our-platform
```

### 2. Token Validation Steps
```javascript
// Complete validation checklist
function validateSSOToken(token) {
  // 1. Verify JWT signature
  const payload = jwt.verify(token, JWT_SECRET);
  
  // 2. Check expiration
  if (payload.expiresAt < Date.now()) {
    throw new Error('Token expired');
  }
  
  // 3. Verify target app
  if (payload.targetApp !== YOUR_APP_SLUG) {
    throw new Error('Wrong target app');
  }
  
  // 4. Validate one-time use with our platform
  if (!await validateWithPlatform(token)) {
    throw new Error('Token already used');
  }
  
  return payload;
}
```

### 3. Database Security
- **Never store JWT tokens** in your database
- **Hash sensitive data** where appropriate
- **Use unique indexes** on platformUserId

```sql
-- Example user table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  platform_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing Your Implementation

### 1. Test Token Generation
We provide a test endpoint to generate tokens for development:

```bash
curl -X POST https://our-platform.com/api/sso/test-token \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "targetApp": "your-app-slug",
    "testUser": {
      "email": "test@example.com",
      "name": "Test User",
      "role": "member"
    }
  }'
```

### 2. Test Your SSO Endpoint
```bash
# Test with a valid token
curl -X POST "https://your-app.com/auth/sso?token=VALID_TEST_TOKEN"

# Test with invalid token
curl -X POST "https://your-app.com/auth/sso?token=invalid"

# Test with expired token
curl -X POST "https://your-app.com/auth/sso?token=EXPIRED_TOKEN"
```

### 3. Test User Creation
```javascript
// Verify user data in your database
const testUser = await User.findOne({ 
  platformUserId: 'test-user-id' 
});

console.log('User created:', testUser);
// Should show: email, name, role, permissions
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Invalid Token" Errors
```javascript
// Check token format
console.log('Token received:', token);
console.log('Token length:', token.length);

// Verify JWT secret
console.log('Using secret:', JWT_SECRET?.substring(0, 10) + '...');
```

#### 2. "Token Expired" Errors
```javascript
// Check server time synchronization
console.log('Server time:', new Date().toISOString());
console.log('Token expires at:', new Date(payload.expiresAt).toISOString());
```

#### 3. "Token Already Used" Errors
```javascript
// This is normal behavior - tokens are single-use
// User should click the app link again to get a new token
```

### Debug Mode
```javascript
// Enable debug logging
app.post('/auth/sso', async (req, res) => {
  const DEBUG = process.env.NODE_ENV === 'development';
  
  if (DEBUG) {
    console.log('SSO Debug Info:');
    console.log('Token:', req.query.token?.substring(0, 50) + '...');
    console.log('Headers:', req.headers);
  }
  
  // ... rest of implementation
});
```

---

## 📋 Integration Checklist

### Before Going Live
- [ ] **JWT secret** configured in environment variables
- [ ] **SSO endpoint** implemented at `/auth/sso`
- [ ] **Token validation** with all security checks
- [ ] **User creation/update** logic implemented
- [ ] **Session management** working correctly
- [ ] **Error handling** for all failure cases
- [ ] **Testing** completed with our test tokens
- [ ] **HTTPS** enabled in production
- [ ] **Database indexes** on platformUserId created

### Production Setup
- [ ] **Environment variables** properly configured
- [ ] **API keys** obtained from our platform
- [ ] **App registered** in our platform (provides JWT secret)
- [ ] **SSO URL** configured in our app settings
- [ ] **Error monitoring** and logging enabled
- [ ] **Rate limiting** implemented if needed

---

## 🚀 Going Live

### 1. Register Your App
Contact our platform team to register your application and receive:
- **App slug** (unique identifier)
- **JWT secret** for token validation
- **API key** for platform communication

### 2. Configure SSO URL
In our platform admin, set your SSO URL:
```
https://your-app.com/auth/sso
```

### 3. Test End-to-End
1. Create a test user in our platform
2. Add your app to the test user's subscription
3. Login to our platform as the test user
4. Click your app icon
5. Verify successful authentication in your app

---

## 🆘 Support

### Development Support
- **Email**: dev-support@our-platform.com
- **Discord**: Join our developer community
- **Documentation**: https://docs.our-platform.com

### Common Resources
- **JWT Debugger**: https://jwt.io (for testing tokens)
- **Test Environment**: https://dev.our-platform.com
- **Status Page**: https://status.our-platform.com

### Emergency Contact
For production issues affecting user authentication:
- **Emergency Line**: +1-XXX-XXX-XXXX
- **Email**: urgent@our-platform.com

---

## 📚 Additional Resources

### Code Examples
- **Complete Examples**: https://github.com/our-platform/sso-examples
- **Starter Templates**: https://github.com/our-platform/app-templates

### Security Guidelines
- **OWASP JWT Security**: https://owasp.org/www-project-web-security-testing-guide/
- **Our Security Policy**: https://our-platform.com/security

### API Reference
- **Platform API Docs**: https://api.our-platform.com/docs
- **SSO Validation Endpoint**: https://api.our-platform.com/sso/validate

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Compatible With**: All modern web frameworks supporting JWT

Need help? Contact our developer support team! 🚀
