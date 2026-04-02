# 🔧 VAULT DATA - Netlify Quick Troubleshooting

## **If You See "Page Not Found" on Netlify:**

### **Immediate Fixes (Try These First)**

1. **Hard Refresh Browser**
   ```
   Windows: Ctrl + Shift + R
   Mac: Cmd + Shift + R
   ```

2. **Check Netlify Build Status**
   - Go to Netlify Dashboard
   - Click **Deploys** tab
   - Look for red/green status
   - If RED: Click deploy to see error logs

3. **Verify These Files Exist:**
   ```
   ✅ netlify.toml (in project root)
   ✅ next.config.js (in project root)
   ✅ package.json (has build script)
   ```

---

## **Solution: Netlify Configuration**

We've created the correct configuration for you:

**File 1: `netlify.toml`** - Tells Netlify how to build Next.js
- Build command: `npm run build`
- Publish directory: `.next`
- Includes redirects for routing

**File 2: Updated `next.config.js`** - Optimizes Next.js for Netlify
- Sets `output: 'standalone'`
- Disables image optimization (not supported on Netlify)
- Configures rewrites

---

## **Deploy Process:**

### **Option A: Fresh Deploy (Recommended)**

```bash
# 1. Local verification
npm run build
npm run dev

# 2. Push changes
git add .
git commit -m "Add Netlify config"
git push origin master

# 3. In Netlify Dashboard
# - Click "Deploy site" or wait for auto-deploy
# - Monitor build in "Deploys" tab
```

### **Option B: Redeploy Existing Site**

If already connected to Netlify:

1. Netlify Dashboard → **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait 5-10 minutes

---

## **Verify Build Succeeded:**

After deploy completes, look for:

✅ Green checkmark in Deploys  
✅ "Published" status  
✅ No red errors in logs  
✅ URL generated (e.g., `https://vault-data-abc123.netlify.app`)

---

## **Test the Live Site:**

Visit your Netlify URL and test:

| Page | Expected Result |
|------|-----------------|
| `/` | Hero section visible |
| `/login` | Login form visible |
| `/signup` | Signup form visible |
| `/dashboard` | Redirects to login (if not logged in) |

---

## **If Build Still Fails:**

1. **Check build logs:**
   - Netlify Dashboard → Click failed deploy
   - Expand build log section
   - Share error message

2. **Common errors:**

   **Error: "command not found: next"**
   → Solution: `npm install` not running
   → Fix: Push updated `package-lock.json`

   **Error: "ENOENT: no such file or directory"**
   → Solution: Missing environment variables
   → Fix: Add env vars in Netlify dashboard

   **Error: "Module not found"**
   → Solution: Dependency missing
   → Fix: Run `npm install` locally, commit lock file

---

## **Quick Checklist:**

- [ ] Run `npm run build` locally (works?)
- [ ] `netlify.toml` exists in root
- [ ] `next.config.js` exists in root
- [ ] `.env.local` has Supabase credentials
- [ ] Env vars added in Netlify dashboard
- [ ] GitHub repo pushed to master branch
- [ ] Netlify connected to GitHub repo
- [ ] Build command is `npm run build`
- [ ] Publish directory is `.next`

---

## **Still Need Help?**

Run this locally and share the output:

```bash
npm run build 2>&1 | tail -50
```

This shows the last 50 lines of build output - helps identify specific issues!
