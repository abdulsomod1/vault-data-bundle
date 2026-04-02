# 🚀 QUICK START - Connect Supabase to VAULT DATA

## **4 Easy Steps** (5 minutes)

### **Step 1: Get Credentials from Supabase** ⚡
1. Open **Supabase Dashboard**: https://app.supabase.com
2. Select your project
3. Click **Settings** ⚙️ → **API**
4. **Copy these 3 values:**
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Key** (long string starting with `eyJ...`)
   - **Service Role Key** (long string starting with `eyJ...`)

### **Step 2: Update `.env.local`** 📝
Open `c:\Data-website\.env.local` and replace:

```bash
# Line 2: Paste your Project URL here
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co

# Line 3: Paste your Anon Key here
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Line 4: Paste your Service Role Key here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://wfghijklmnop1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZ2hpamtsbW5vcDEyMzQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NDgxMjAwMCwiZXhwIjoxOTYwMzg4MDAwfQ.abcdefghijklmnopqrstuvwxyz123456789
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZ2hpamtsbW5vcDEyMzQiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ0ODEyMDAwLCJleHAiOjk5OTk5OTk5OTl9.xyz987654321mnopqrstuvwxyz123456789abcdef
```

✅ **Don't forget to save the file!**

### **Step 3: Verify Database Schema** 📊
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Copy entire content from `c:\Data-website\database\schema.sql`
4. Paste it in SQL Editor
5. Click **Execute** ▶️
6. ✅ You should see "Query succeeded" (no errors)

### **Step 4: Test Connection** 🧪
1. Open terminal in project root
2. Run:
   ```bash
   npm install
   npm run dev
   ```
3. Open browser: `http://localhost:3000`
4. Try signup with an email
5. Check **Supabase Dashboard → Authentication → Users** - you should see your new user ✅

---

## **What's Connected:**

| Component | Uses | Environment Variable |
|-----------|------|----------------------|
| **Frontend** (signup, login, buy data) | Anon Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Backend API** (wallet, orders, admin) | Service Role Key | `SUPABASE_SERVICE_ROLE_KEY` |
| **Database** | Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| **Payments** | Paystack | `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` |

---

## **Troubleshooting**

| Problem | Solution |
|---------|----------|
| "Missing Supabase environment variables" | Make sure `.env.local` has correct values and no extra spaces |
| "Failed to connect" | Restart dev server (`npm run dev`) after updating `.env.local` |
| "Table doesn't exist" | Run schema.sql in Supabase SQL Editor |
| "Row level security" error | Make sure schema.sql ran successfully with RLS policies |

---

## **📚 What to Read Next**

1. **[`SUPABASE_CREDENTIALS_GUIDE.md`](SUPABASE_CREDENTIALS_GUIDE.md)** - Detailed setup (if you get stuck)
2. **[`STARTUP_GUIDE.md`](STARTUP_GUIDE.md)** - Full project quickstart
3. **[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)** - Deploy to production

---

**You're all set! 🎉 Your VAULT DATA is now connected to Supabase.**
