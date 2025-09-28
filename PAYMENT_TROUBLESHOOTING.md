# 🚨 Payment System Troubleshooting Guide

## Quick Diagnosis

If you're experiencing payment failures, follow these steps:

### 1. **Access the Payment Debugger**

Visit: `http://localhost:3000/payment-debug`

This will run comprehensive diagnostics and show you exactly what's failing.

### 2. **Common Issues & Solutions**

#### ❌ **"Payment processing failed. Please try again."**

**Possible Causes:**

- Backend server not running
- Authentication issues
- Database connection problems
- Missing artwork data

**Solutions:**

1. **Check Backend Server:**

   ```bash
   cd artvault-backend
   npm run server
   ```

   Should show: "Server started on port 5000"

2. **Verify Authentication:**

   - Make sure you're logged in
   - Check browser localStorage for 'token'
   - Try logging out and back in

3. **Check Database:**
   - Ensure MongoDB is running
   - Verify artwork exists with quantity > 0

#### ❌ **"Network error. Please check your connection"**

**Solutions:**

1. Check if backend is running on port 5000
2. Verify CORS settings in backend
3. Check browser console for network errors

#### ❌ **"No token, authorization denied"**

**Solutions:**

1. Log out and log back in
2. Clear browser localStorage
3. Check if JWT_SECRET is set in backend .env

#### ❌ **"Artwork not found"**

**Solutions:**

1. Ensure artwork exists in database
2. Check artwork ID is valid
3. Verify artwork has quantity > 0

### 3. **Step-by-Step Testing**

#### Test 1: Basic Connectivity

```bash
# In browser console:
fetch('http://localhost:5000/api/artworks')
  .then(r => r.json())
  .then(console.log)
```

#### Test 2: Authentication

```bash
# Check if token exists:
localStorage.getItem('token')
```

#### Test 3: Manual Order Creation

Use the Payment Debugger's "Test Payment Flow" button.

### 4. **Backend Checklist**

Ensure these are working:

- [ ] MongoDB running
- [ ] Backend server on port 5000
- [ ] JWT_SECRET in .env file
- [ ] nodemailer installed
- [ ] All routes properly configured

### 5. **Frontend Checklist**

Ensure these are working:

- [ ] User is logged in
- [ ] Token exists in localStorage
- [ ] Artwork data is loaded
- [ ] No console errors

### 6. **Database Checklist**

Verify these collections exist:

- [ ] users
- [ ] artworks (with quantity > 0)
- [ ] orders
- [ ] notifications

### 7. **Environment Variables**

Backend `.env` should have:

```env
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb://localhost:27017/artvault
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 8. **Quick Fixes**

Try these in order:

1. **Restart Everything:**

   ```bash
   # Backend
   cd artvault-backend
   npm run server

   # Frontend (new terminal)
   cd artvault-frontend
   npm start
   ```

2. **Clear Browser Data:**

   - Clear localStorage
   - Clear cookies
   - Hard refresh (Ctrl+Shift+R)

3. **Check Logs:**
   - Backend console for errors
   - Browser console for errors
   - Network tab for failed requests

### 9. **Advanced Debugging**

If issues persist:

1. **Enable Detailed Logging:**
   Add to PaymentForm.jsx:

   ```javascript
   console.log("Debug info:", {
     user: user,
     artwork: artwork,
     orderData: orderData,
     token: localStorage.getItem("token"),
   });
   ```

2. **Check Backend Logs:**
   Look for errors in backend console when payment fails

3. **Database Inspection:**
   ```bash
   # Connect to MongoDB
   mongo
   use artvault
   db.artworks.find({quantity: {$gt: 0}})
   ```

### 10. **Test Data Setup**

If no artworks exist:

1. Log in as an artist
2. Go to "Add Artwork"
3. Create test artwork with quantity > 0
4. Try payment again

### 11. **Emergency Fallback**

If all else fails:

1. Use `/test-payment` route
2. This uses mock data and should always work
3. If this fails, it's a fundamental system issue

## 🆘 Still Having Issues?

1. Run the Payment Debugger: `/payment-debug`
2. Check all console logs
3. Verify all services are running
4. Try with a fresh browser/incognito mode

## 📞 Support Commands

```bash
# Check if backend is running
curl http://localhost:5000

# Check if API is responding
curl http://localhost:5000/api/artworks

# Check MongoDB connection
mongo --eval "db.adminCommand('ismaster')"

# Check Node.js version
node --version

# Check npm packages
npm list --depth=0
```

---

**Remember:** The Payment Debugger at `/payment-debug` will give you the most accurate diagnosis of what's failing in your specific setup.
