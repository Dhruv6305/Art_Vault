# 🔧 Google OAuth Port Mismatch - FIXED!

## 🎯 **Problem Identified**

Your frontend is running on **port 5173** (Vite default), but the backend `.env` was configured for **port 3000** (React default). This caused the OAuth redirect to fail.

## ✅ **Solution Applied**

### **Backend Configuration Updated:**

- ✅ `CLIENT_URL` changed from `http://localhost:3000` to `http://localhost:5173`
- ✅ CORS origins updated to prioritize port 5173
- ✅ OAuth callback will now redirect to correct port

### **Google Cloud Console Settings:**

You need to update your Google Cloud Console to match:

1. **Go to:** [Google Cloud Console](https://console.cloud.google.com/)
2. **Navigate to:** APIs & Services → Credentials
3. **Select your OAuth Client ID**
4. **Update Authorized JavaScript Origins:**
   ```
   http://localhost:5173
   http://localhost:5000
   ```
5. **Update Authorized Redirect URIs:**
   ```
   http://localhost:5000/api/auth/google/callback
   ```

## 🚀 **Testing Steps**

### **Step 1: Restart Backend Server**

```bash
cd artvault-backend
npm run server
```

### **Step 2: Verify Frontend is Running**

Your frontend should be accessible at: `http://localhost:5173`

### **Step 3: Test Google Login**

1. Go to: `http://localhost:5173/login`
2. Click "Continue with Google"
3. Complete Google authentication
4. Should redirect to: `http://localhost:5173/auth/success?token=...`
5. Should automatically redirect to dashboard

## 🔍 **Port Verification**

### **Check Running Services:**

```bash
# Check frontend (should show port 5173)
netstat -ano | findstr :5173

# Check backend (should show port 5000)
netstat -ano | findstr :5000
```

### **Expected URLs:**

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:5000`
- **Google Login:** `http://localhost:5000/api/auth/google`
- **OAuth Callback:** `http://localhost:5000/api/auth/google/callback`
- **Success Redirect:** `http://localhost:5173/auth/success?token=...`

## 🛠️ **If Still Having Issues**

### **Clear Browser Cache:**

The browser might have cached the old redirect URL. Try:

- Hard refresh (Ctrl+Shift+R)
- Incognito/private mode
- Clear browser data

### **Verify Google Cloud Console:**

Make sure the JavaScript origins and redirect URIs exactly match:

- JavaScript Origins: `http://localhost:5173`
- Redirect URIs: `http://localhost:5000/api/auth/google/callback`

### **Check Backend Logs:**

When you try Google login, you should see:

```
Google OAuth attempt for: your-email@domain.com
Linking existing email account with Google: your-email@domain.com
Redirecting to success page with token
```

## 🎉 **Expected Success Flow**

1. **Click Google Login** → Redirects to Google
2. **Google Authentication** → Redirects to backend callback
3. **Backend Processing** → Generates JWT token
4. **Redirect to Frontend** → `localhost:5173/auth/success?token=...`
5. **Token Processing** → Saves to localStorage
6. **Final Redirect** → Dashboard at `localhost:5173/dashboard`

## 📱 **Alternative Testing**

If you prefer to use port 3000:

1. Stop your current frontend server
2. Change the start script to use port 3000
3. Update `.env` back to `CLIENT_URL=http://localhost:3000`
4. Update Google Cloud Console to use port 3000

But using port 5173 (current setup) should work perfectly once you update Google Cloud Console!

---

## 🚀 **Ready to Test!**

The port mismatch is now fixed. Update your Google Cloud Console settings and try the Google login again!
