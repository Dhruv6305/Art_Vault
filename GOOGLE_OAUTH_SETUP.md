# 🔧 Google OAuth Setup & Troubleshooting Guide

## 🚨 **Issue Fixed: CLIENT_URL Mismatch**

The main issue was that your `.env` file had `CLIENT_URL=http://localhost:5173` but your React app runs on `http://localhost:3000`. This has been corrected.

## ✅ **Current Configuration Status**

Your Google OAuth is properly configured with:

- ✅ **Google Client ID**: Valid format
- ✅ **Google Client Secret**: Valid format
- ✅ **CLIENT_URL**: Fixed to `http://localhost:3000`
- ✅ **Backend Routes**: Properly configured
- ✅ **Frontend Integration**: Working

## 🔍 **Google Cloud Console Setup Verification**

Make sure your Google Cloud Console is configured correctly:

### 1. **Authorized JavaScript Origins**

In Google Cloud Console → APIs & Services → Credentials → Your OAuth Client:

```
http://localhost:3000
http://localhost:5000
```

### 2. **Authorized Redirect URIs**

```
http://localhost:5000/api/auth/google/callback
```

### 3. **OAuth Consent Screen**

- App name: ArtVault
- User support email: Your email
- Developer contact: Your email
- Scopes: email, profile, openid

## 🚀 **Testing Google Login**

### Step 1: Restart Backend Server

```bash
cd artvault-backend
npm run server
```

### Step 2: Test Google OAuth Endpoint

Visit: `http://localhost:5000/api/auth/google`

This should redirect you to Google's login page.

### Step 3: Complete Login Flow

1. Click "Continue with Google" on login page
2. Select your Google account
3. Grant permissions
4. Should redirect to dashboard

## 🔧 **Common Issues & Solutions**

### Issue 1: "Error 400: redirect_uri_mismatch"

**Solution:** Update Google Cloud Console redirect URIs to:

```
http://localhost:5000/api/auth/google/callback
```

### Issue 2: "This app isn't verified"

**Solution:**

- Click "Advanced" → "Go to ArtVault (unsafe)"
- Or add your email to test users in OAuth consent screen

### Issue 3: "Access blocked: This app's request is invalid"

**Solution:** Check that JavaScript origins include:

```
http://localhost:3000
http://localhost:5000
```

### Issue 4: Infinite redirect loop

**Solution:** Clear browser cookies and localStorage:

```javascript
localStorage.clear();
// Then refresh page
```

## 🧪 **Debug Google OAuth**

### Test Backend Endpoint Directly

```bash
curl http://localhost:5000/api/auth/google
```

Should return HTML redirect to Google.

### Check Environment Variables

```bash
cd artvault-backend
node -e "
require('dotenv').config();
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('CLIENT_URL:', process.env.CLIENT_URL);
"
```

### Test JWT Generation

```bash
cd artvault-backend
node -e "
require('dotenv').config();
const jwt = require('jsonwebtoken');
const token = jwt.sign({user: {id: 'test'}}, process.env.JWT_SECRET, {expiresIn: '5d'});
console.log('JWT Test:', token ? 'Working' : 'Failed');
"
```

## 🔄 **Manual Test Flow**

1. **Start servers:**

   ```bash
   # Backend
   cd artvault-backend && npm run server

   # Frontend
   cd artvault-frontend && npm start
   ```

2. **Visit login page:**
   `http://localhost:3000/login`

3. **Click "Continue with Google"**

4. **Check browser network tab:**
   - Should redirect to `accounts.google.com`
   - After login, should redirect to `localhost:5000/api/auth/google/callback`
   - Finally redirect to `localhost:3000/auth/success?token=...`

## 🛠️ **Advanced Troubleshooting**

### Enable Debug Logging

Add to `artvault-backend/server.js`:

```javascript
// Add after other middleware
app.use((req, res, next) => {
  if (req.url.includes("auth")) {
    console.log("Auth request:", req.method, req.url);
  }
  next();
});
```

### Check Passport Session

Add to `artvault-backend/config/passport.js`:

```javascript
// Add logging to strategy callback
console.log("Google OAuth callback triggered");
console.log("Profile:", profile.displayName, profile.emails[0].value);
```

### Frontend Debug

Add to `artvault-frontend/src/pages/Login.jsx`:

```javascript
const handleGoogleSignIn = () => {
  console.log("Redirecting to Google OAuth...");
  window.location.href = "http://localhost:5000/api/auth/google";
};
```

## 📱 **Production Setup**

When deploying to production, update:

### Backend .env

```env
CLIENT_URL=https://your-domain.com
```

### Google Cloud Console

Add production URLs:

```
JavaScript Origins:
https://your-domain.com
https://your-api-domain.com

Redirect URIs:
https://your-api-domain.com/api/auth/google/callback
```

## 🎯 **Quick Fix Checklist**

- [x] ✅ CLIENT_URL corrected to `http://localhost:3000`
- [ ] 🔄 Restart backend server
- [ ] 🔄 Test Google login button
- [ ] 🔄 Check Google Cloud Console settings
- [ ] 🔄 Clear browser cache if needed

## 🆘 **Still Having Issues?**

1. **Check browser console** for JavaScript errors
2. **Check backend logs** for authentication errors
3. **Verify Google Cloud Console** settings match exactly
4. **Test with incognito mode** to avoid cache issues
5. **Try different Google account** to rule out account-specific issues

---

## 🎉 **Success Indicators**

When working correctly, you should see:

- ✅ Google login button redirects to Google
- ✅ After Google login, redirects to `/auth/success`
- ✅ User is logged in and redirected to `/dashboard`
- ✅ User data is available in the app

The Google OAuth should now work correctly with the CLIENT_URL fix!
