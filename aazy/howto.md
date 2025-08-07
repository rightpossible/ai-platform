# ERPNext SaaS Integration Guide for NextJS Team

## Overview
This document explains how to integrate your NextJS application (running on localhost:3000) with our ERPNext SaaS backend running on WSL.

## Architecture
- **NextJS App**: `http://localhost:3000` (Windows)
- **ERPNext Backend**: WSL Ubuntu (Windows Subsystem for Linux)
- **Customer Sites**: `username.localhost:8000` (created automatically)

## How It Works

### 1. User Journey
1. User visits NextJS app at `localhost:3000`
2. User signs up and pays
3. Payment success triggers site creation
4. User receives email with their personal business platform
5. User accesses `http://username.localhost:8000` with full business suite

### 2. When Payment Succeeds - What You Need to Do

#### Step 1: Call Site Creation API
When payment is successful, your NextJS app needs to call our site creation script.

**Required Data:**
- `username` (will become subdomain: username.localhost)
- `email` (customer email)
- `password` (customer's chosen password)

#### Step 2: API Communication Options

**Option A: HTTP Request to WSL (Recommended)**
```
POST http://localhost:8080/create-customer-site
Body: {
  "username": "johndoe",
  "email": "john@company.com", 
  "password": "userpassword123"
}
```

**Option B: Direct Script Execution**
If NextJS and WSL are on same machine, you can directly execute the script.

#### Step 3: Expected Response
```json
{
  "success": true,
  "message": "Site created successfully",
  "data": {
    "site_url": "http://johndoe.localhost:8000",
    "username": "Administrator", 
    "password": "userpassword123",
    "email": "john@company.com"
  }
}
```

## WSL Communication Setup

### Method 1: HTTP API Server (Recommended)

We'll create a simple API server on WSL that your NextJS app can call.

**API Endpoints:**
- `POST /create-customer-site` - Creates new customer site
- `GET /check-site/{username}` - Checks if site exists
- `DELETE /delete-site/{username}` - Deletes customer site

### Method 2: Direct Script Call

If you prefer direct script execution:
```bash
# From Windows Command Prompt
wsl bash /home/mr-right/apps-hosting/erpnext/create_customer_site.sh username email password
```

## Required Integration Points

### 1. Payment Success Handler
```javascript
// When Stripe/PayPal payment succeeds
async function handlePaymentSuccess(paymentData) {
  const { username, email, password } = paymentData;
  
  // Call our ERPNext API
  const response = await fetch('http://localhost:8080/create-customer-site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Send welcome email with site details
    await sendWelcomeEmail(email, result.data);
    
    // Redirect user or show success page
    router.push(`/welcome?site=${result.data.site_url}`);
  } else {
    // Handle error
    console.error('Site creation failed:', result.error);
  }
}
```

### 2. Welcome Email Template
Send user their login details:
```
Subject: Your Business Platform is Ready! 🎉

Hi there!

Your complete business management platform has been created:

🌐 Access your platform: http://username.localhost:8000
👤 Username: Administrator  
🔑 Password: [their chosen password]

What you can do:
✅ Manage customers and sales (CRM)
✅ Handle accounting and invoicing
✅ Manage employees and payroll (HR)
✅ Track projects and tasks
✅ Manage inventory and warehouses
✅ Create support tickets
✅ Generate business reports

Start building your business today!
```

### 3. Error Handling
```javascript
// Handle common errors
if (!result.success) {
  switch (result.error) {
    case 'username_exists':
      // Show "Username already taken" message
      break;
    case 'site_creation_failed':
      // Show "Technical error, please try again" message
      break;
    case 'invalid_credentials':
      // Show "Invalid username/password format" message
      break;
    default:
      // Show generic error message
  }
}
```

## Testing Locally

### 1. Start ERPNext Backend
```bash
# In WSL
cd ~/frappe-bench
bench start
```

### 2. Test Site Creation
```bash
# In WSL
cd ~/apps-hosting/erpnext
./create_customer_site.sh testuser test@example.com password123
```

### 3. Verify Site Works
Open browser: `http://testuser.localhost:8000`
Login: Administrator / password123

### 4. Test from NextJS
Your NextJS app should be able to call the API and create sites automatically.

## Production Differences

### Development (Current)
- Sites: `http://username.localhost:8000`
- Manual bench start required
- No SSL certificates

### Production
- Sites: `https://username.yourdomain.com`
- Automatic startup (no manual bench start)
- SSL certificates automatically generated
- Professional custom branding

## Required Environment Variables

For your NextJS app, you'll need:
```env
ERPNEXT_API_URL=http://localhost:8080
ERPNEXT_API_KEY=your_api_key_here
MYSQL_ROOT_PASSWORD=rightal.com
DEFAULT_ADMIN_PASSWORD=rightal.com
```

## Site Creation Time
- Average creation time: 3-5 minutes
- User gets email notification when ready
- All business applications included automatically

## Available Applications
Each customer site includes:
- **CRM & Sales** - Lead management, opportunities, customers
- **Accounting** - Invoicing, payments, financial reports  
- **HR Management** - Employees, payroll, leave management
- **Project Management** - Tasks, timesheets, project tracking
- **Inventory** - Stock management, warehouses
- **Customer Support** - Ticketing system
- **Analytics** - Business intelligence and reports
- **File Management** - Document storage and sharing
- **Knowledge Base** - Wiki and documentation

## Support & Troubleshooting

### Common Issues:
1. **Site creation timeout** - Normal for first-time, takes 3-5 minutes
2. **Port 8000 not accessible** - Check if bench is running
3. **Database connection error** - Verify MySQL is running

### Debug Commands:
```bash
# Check if site exists
bench --site username.localhost list-apps

# Check site status  
bench --site username.localhost console

# View logs
tail -f ~/frappe-bench/logs/web.log
```

## Next Steps
1. Set up HTTP API server on WSL
2. Implement payment success handler in NextJS
3. Create welcome email template
4. Test complete flow locally
5. Prepare for production deployment

## Contact
For technical questions about ERPNext integration, contact the backend team.



api docs



# ERPNext SaaS API Documentation

## Overview
This API provides complete site management for your ERPNext SaaS platform. It allows you to create, delete, check, and list customer sites programmatically.

**Base URL**: `http://localhost:8080`

---

## 🚀 Getting Started

### Prerequisites
- ERPNext backend running (`bench start`)
- API server running (`python3 api_server.py`)

### Authentication
Currently, no authentication is required. In production, implement proper API key authentication.

---

## 📡 API Endpoints

### 1. Create Customer Site
Creates a new ERPNext site for a customer with automatic branding.

**Endpoint**: `POST /create-customer-site`

**Request Body**:
```json
{
  "username": "string",    // Required: Customer username (will become sitename.localhost)
  "email": "string",       // Required: Customer email address
  "password": "string"     // Required: Administrator password for the site
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Site created successfully",
  "data": {
    "site_url": "http://customer.localhost:8000",
    "username": "Administrator",
    "password": "securepass",
    "email": "customer@email.com"
  }
}
```

**Error Response** (500):
```json
{
  "success": false,
  "error": "Site creation failed",
  "details": "Error details here"
}
```

**Example**:
```bash
curl -X POST http://localhost:8080/create-customer-site \
  -H "Content-Type: application/json" \
  -d '{
    "username": "acme",
    "email": "admin@acme.com",
    "password": "secure123"
  }'
```

---

### 2. Delete Customer Site
Permanently deletes a customer's ERPNext site and all associated data.

**Endpoint**: `POST /delete-customer-site`

**Request Body**:
```json
{
  "username": "string"     // Required: Customer username to delete
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Site deleted successfully",
  "data": {
    "site_name": "customer.localhost",
    "username": "customer"
  }
}
```

**Error Response** (200):
```json
{
  "success": false,
  "error": "Site does not exist",
  "details": "Site customer.localhost not found"
}
```

**Example**:
```bash
curl -X POST http://localhost:8080/delete-customer-site \
  -H "Content-Type: application/json" \
  -d '{"username": "acme"}'
```

---

### 3. Check Site Existence
Checks if a customer site exists without creating or modifying it.

**Endpoint**: `GET /check-site/{username}`

**URL Parameters**:
- `username`: Customer username to check

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "site_name": "customer.localhost",
    "username": "customer",
    "exists": true,
    "site_url": "http://customer.localhost:8000"
  }
}
```

**If site doesn't exist**:
```json
{
  "success": true,
  "data": {
    "site_name": "customer.localhost",
    "username": "customer",
    "exists": false,
    "site_url": null
  }
}
```

**Example**:
```bash
curl http://localhost:8080/check-site/acme
```

---

### 4. List All Sites
Returns a list of all customer sites in the system.

**Endpoint**: `GET /list-sites`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Found 3 sites",
  "data": {
    "sites": [
      {
        "site_name": "customer1.localhost",
        "username": "customer1",
        "site_url": "http://customer1.localhost:8000",
        "path": "/home/mr-right/frappe-bench/sites/customer1.localhost"
      },
      {
        "site_name": "customer2.localhost",
        "username": "customer2",
        "site_url": "http://customer2.localhost:8000",
        "path": "/home/mr-right/frappe-bench/sites/customer2.localhost"
      }
    ],
    "count": 2
  }
}
```

**Example**:
```bash
curl http://localhost:8080/list-sites
```

---

### 5. API Status
Returns the health status of the API server and available endpoints.

**Endpoint**: `GET /api-status`

**Success Response** (200):
```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "status": "healthy",
    "total_sites": 5,
    "available_endpoints": [
      "POST /create-customer-site",
      "POST /delete-customer-site",
      "GET /list-sites",
      "GET /check-site/{username}",
      "GET /api-status"
    ]
  }
}
```

**Example**:
```bash
curl http://localhost:8080/api-status
```

---

## 🔧 Integration Examples

### JavaScript/NextJS Integration

#### Check Username Availability
```javascript
async function checkUsernameAvailable(username) {
  try {
    const response = await fetch(`http://localhost:8080/check-site/${username}`);
    const data = await response.json();
    return !data.data.exists; // true if available, false if taken
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
}
```

#### Create Customer Site
```javascript
async function createCustomerSite(username, email, password) {
  try {
    const response = await fetch('http://localhost:8080/create-customer-site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Site created:', data.data.site_url);
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
}
```

#### Delete Customer Site
```javascript
async function deleteCustomerSite(username) {
  try {
    const response = await fetch('http://localhost:8080/delete-customer-site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting site:', error);
    return false;
  }
}
```

#### List All Customer Sites
```javascript
async function getAllCustomerSites() {
  try {
    const response = await fetch('http://localhost:8080/list-sites');
    const data = await response.json();
    return data.data.sites;
  } catch (error) {
    console.error('Error fetching sites:', error);
    return [];
  }
}
```

### Python Integration

```python
import requests
import json

BASE_URL = "http://localhost:8080"

def create_customer_site(username, email, password):
    """Create a new customer site"""
    payload = {
        "username": username,
        "email": email,
        "password": password
    }
    
    response = requests.post(
        f"{BASE_URL}/create-customer-site",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    
    return response.json()

def check_site_exists(username):
    """Check if a site exists"""
    response = requests.get(f"{BASE_URL}/check-site/{username}")
    data = response.json()
    return data["data"]["exists"]

def delete_customer_site(username):
    """Delete a customer site"""
    payload = {"username": username}
    
    response = requests.post(
        f"{BASE_URL}/delete-customer-site",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    
    return response.json()

def list_all_sites():
    """Get all customer sites"""
    response = requests.get(f"{BASE_URL}/list-sites")
    data = response.json()
    return data["data"]["sites"]
```

---

## 🛡️ Error Handling

### Common Error Responses

**400 Bad Request**:
```json
{
  "error": "Invalid request format"
}
```

**404 Not Found**:
```json
{
  "error": "Not Found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error message"
}
```

### Best Practices

1. **Always check the `success` field** in the response
2. **Handle network errors** with try-catch blocks
3. **Validate usernames** before creating sites
4. **Check site existence** before attempting operations
5. **Log errors** for debugging and monitoring

---

## 🔒 Security Considerations

### Current Implementation
- No authentication required (development only)
- CORS enabled for all origins
- Local network access only

### Production Recommendations
1. **Implement API key authentication**
2. **Add rate limiting** to prevent abuse
3. **Validate and sanitize** all input data
4. **Use HTTPS** for all communications
5. **Restrict CORS** to known domains
6. **Add request logging** for audit trails
7. **Implement proper error messages** (don't expose internal details)

---

## 🚀 What Each Customer Gets

When a site is created via the API, customers automatically receive:

### Core Business Platform
- **Accounting & Finance**: Full ERP with invoicing, expenses, financial reports
- **Sales & CRM**: Lead management, opportunities, quotations
- **Inventory Management**: Stock tracking, warehouses, purchasing
- **Manufacturing**: Production planning, work orders, quality control
- **Projects**: Task management, timesheets, profitability tracking
- **HR & Payroll**: Employee management, attendance, salary processing

### Professional Branding
- **Custom Branding**: "BusinessPro Platform" and "AI all in one" branding
- **White-label Experience**: No ERPNext references visible to customers
- **Professional Interface**: Clean, branded user experience

### Site Details
- **URL**: `http://username.localhost:8000`
- **Login**: Administrator / [customer's chosen password]
- **Database**: Isolated MySQL database per customer
- **Backup**: Automatic backups (in production setup)

---

## 📞 Support

For technical support or questions about this API:

1. **Check the logs** in your API server console
2. **Verify ERPNext backend** is running (`bench start`)
3. **Test endpoints** using the provided curl examples
4. **Review error messages** for specific issues

---

## 🔄 Version History

**Version 1.0** (Current)
- Site creation with automatic branding
- Site deletion with validation
- Site existence checking
- Site listing and enumeration
- API health monitoring
- CORS support for web integration

---

**Last Updated**: January 2025  
**API Version**: 1.0  
**Compatible with**: ERPNext v15, Frappe Framework
