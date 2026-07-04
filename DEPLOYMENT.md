# Authentication & Deployment Guide

## Problem Solved
Fixed the logout-on-refresh issue that occurs when the app is deployed online.

### Root Cause
- The vite proxy only works in development
- Production builds had no way to know where the backend API is located
- AuthContext was using relative URLs that pointed to the frontend domain instead of the backend
- Token validation on refresh was failing in production

## Deployment Instructions

### For Development
No changes needed. Continue using:
```bash
npm run dev
```
The vite proxy in `vite.config.ts` will handle `/api` requests to `http://localhost:3001`.

### For Production (Vercel, Netlify, etc.)

#### 1. Set Environment Variable
When deploying, set the `VITE_API_URL` environment variable to your backend URL.

**Example values:**
- `https://api.yourdomain.com` (if backend is separate domain)
- `https://yourdomain.com` (if backend is at same domain with `/api` prefix)
- `http://localhost:3001` (if testing locally)

**How to set it:**

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.com`
   - Select which environments (Production, Preview, Development)

**Netlify:**
1. Go to Site Settings → Build & Deploy → Environment
2. Add build environment variables:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.com`

**Docker / Self-hosted:**
```bash
export VITE_API_URL=https://your-backend-url.com
npm run build
```

#### 2. Check `.env` file
Your `.env` file in `frontend/` already has the configuration:
```
VITE_API_URL=http://localhost:3001  # Development
# VITE_API_URL=https://api.yourdomain.com  # Production (uncomment and update)
```

#### 3. Build & Deploy
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

## How It Works

### Development Flow
1. Frontend on `http://localhost:5173`
2. API requests to `/api/*` are proxied to `http://localhost:3001` via vite
3. Token is stored in localStorage
4. On page refresh:
   - Token is loaded from localStorage
   - AuthContext validates token by calling `http://localhost:3001/api/auth/me`
   - User data is restored
   - You stay logged in ✅

### Production Flow
1. Frontend served from your deployed domain (e.g., `https://yourapp.com`)
2. `VITE_API_URL` env var is set during build, tells app where backend is
3. API requests go to `${VITE_API_URL}/api/*`
4. Token is stored in localStorage (persists across browser sessions)
5. On page refresh:
   - Token is loaded from localStorage
   - AuthContext validates token by calling `${VITE_API_URL}/api/auth/me`
   - User data is restored
   - You stay logged in ✅

## Files Modified
- `frontend/src/lib/api-config.ts` - NEW: API configuration utility
- `frontend/src/contexts/AuthContext.tsx` - UPDATED: Use correct API endpoint with base URL
- `frontend/src/lib/auth.ts` - UPDATED: Initialize base URL configuration
- `frontend/.env.example` - UPDATED: Added clear environment variable template

## Testing Before Deployment

### Test locally (Dev Mode)
```bash
cd frontend
npm run dev
```
1. Log in
2. Open DevTools → Application → LocalStorage
3. Verify `auth_token` is present
4. Refresh page - should stay logged in ✅
5. Check Network tab - requests should go to `http://localhost:3001`

### Test Production Build Locally
```bash
cd frontend
npm run build
npm run preview
```
1. Log in
2. Refresh page - should stay logged in ✅
3. Check Network tab - requests should use the configured `VITE_API_URL`

## Troubleshooting

### Still Logging Out on Refresh
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly (log it in browser devtools)
3. Check that backend `/api/auth/me` endpoint returns correct user data
4. Check that JWT token hasn't expired

### CORS Errors
If you see CORS errors in the browser console:
1. Check that backend has proper CORS headers configured
2. Verify the backend is running and accessible from the frontend domain
3. Check backend `.env` has correct `CORS_ORIGIN` settings

### Token Still in LocalStorage but User is Null
1. Token might be expired - check JWT expiration in backend
2. Token might be corrupted - clear localStorage and log in again
3. Backend `/api/auth/me` endpoint might be returning error

### API Calls to Wrong URL
1. Check that `VITE_API_URL` environment variable is set
2. Run `npm run build` again after setting the env var
3. Check `import.meta.env.VITE_API_URL` in browser console

## API Call Helper (Optional)

If you want to gradually refactor other fetch calls, use the `apiCall` helper:

```typescript
import { apiCall } from "@/lib/api-config";

// Instead of:
// fetch("/api/verification", { headers: { Authorization: ... } })

// Use:
const data = await apiCall("/api/verification");
// - Automatically includes auth token
// - Automatically uses correct base URL
// - Handles errors consistently
```

