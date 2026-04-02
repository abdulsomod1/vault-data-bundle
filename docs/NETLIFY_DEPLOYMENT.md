# 🚀 VAULT DATA - Netlify Deployment Guide

## **Fix for "Page Not Found" Error**

Your error is likely because Netlify wasn't properly configured for Next.js. Follow these steps:

---

## **✅ Step-by-Step Netlify Deployment**

### **Step 1: Prepare Your Project** (Local)

```bash
# Make sure all files are committed
git add .
git commit -m "Prepare for Netlify deployment"
git push origin master
```

### **Step 2: Connect to Netlify**

1. Go to **https://app.netlify.com**
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub**
4. Find and connect your **vault-data-bundle** repository
5. Click **Continue**

### **Step 3: Configure Build Settings**

On the **Site settings** screen, make sure these are set:

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |
| **Node version** | `18.17.1` or higher |

✅ These should auto-detect but verify them!

### **Step 4: Set Environment Variables**

1. Click **Site settings** → **Build & deploy** → **Environment**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://rgwgximvzbllfhqowmwp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd2d4aW12emJsbGZocW93bXdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODQ1NDksImV4cCI6MjA5MDY2MDU0OX0.P5P38DEhPmNyl9jUndPl09GBMYD062Efp6dzy7r89lg
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd2d4aW12emJsbGZocW93bXdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA4NDU0OSwiZXhwIjoyMDkwNjYwNTQ5fQ.u8T73rsFo2y5AefHFTAC4aNEyQ-4uFUyxWLLfVREtDs
```

3. Click **Save**

### **Step 5: Trigger Deploy**

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete (5-10 min)

✅ When you see **"Deploy successful"** you're done!

---

## **🔍 Debugging: If Still Getting "Page Not Found"**

### **Check 1: Build Output**

1. Netlify Dashboard → **Deploys**
2. Click the latest deploy
3. Under **Logs**, check for build errors
4. Look for any `Error` or `FAILED` messages

### **Check 2: Verify Files Created**

In the build logs, you should see:
- ✅ `Compiled successfully`
- ✅ `Created .next folder`
- ✅ `Generated static pages`

### **Check 3: Netlify Configuration**

Files we created for you:
- ✅ **`netlify.toml`** - Netlify build config
- ✅ **`next.config.js`** - Next.js optimization for Netlify

If build still fails, open terminal and run:

```bash
# Test build locally first
npm run build

# Should create .next/ folder
ls -la .next/
```

If `.next` folder exists locally, commit and push:

```bash
git add netlify.toml next.config.js
git commit -m "Add Netlify configuration"
git push origin master
```

---

## **🎯 Expected Working URL**

After successful deploy, your site URL will be:

```
https://vault-data-[random-id].netlify.app
```

Test these URLs:
- ✅ Home: `https://your-site.netlify.app/`
- ✅ Login: `https://your-site.netlify.app/login`
- ✅ Signup: `https://your-site.netlify.app/signup`

---

## **🛠️ Common Issues & Fixes**

| Issue | Fix |
|-------|-----|
| **Blank page** | Clear cache: `Ctrl+Shift+R` (hard refresh) |
| **404 on all pages** | Check `netlify.toml` redirect rules |
| **API endpoints 404** | API routes must be in `/app/api/` folder |
| **Env vars not loading** | Redeploy after adding env vars |
| **Build fails** | Check build logs for Node version mismatch |

---

## **📱 Testing After Deploy**

Once deployed, test:

1. **Homepage loads** ✅
2. **Can click navigation links** ✅
3. **Images load** ✅
4. **Forms submit** ✅
5. **API calls work** ✅

---

## **💡 Pro Tips**

- **Preview deploys**: Every push creates a preview link
- **Custom domain**: Add domain in Netlify → Site settings → Domain management
- **SSL**: Automatic HTTPS on all Netlify sites
- **Rollback**: Deploy tab shows all versions, click to rollback

---

## **Still Having Issues?**

Share the **error from Netlify build logs** and I'll debug it specifically!
