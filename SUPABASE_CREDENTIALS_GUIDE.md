# 🔐 Supabase Credentials Setup Guide

## **Complete Step-by-Step Instructions**

### **📍 Step 1: Get Your Supabase Credentials**

#### **1️⃣ Find Your Project URL & API Keys**

1. Go to your **Supabase Dashboard** → [https://app.supabase.com](https://app.supabase.com)
2. Select your **project** from the list
3. Click **Settings** ⚙️ (bottom left sidebar)
4. Click **API** tab

You'll see:
```
┌─────────────────────────────────────────┐
│ Project URL: https://YOUR_ID.supabase.co│
│                                           │
│ API Keys:                                │
│ • anon public  → pk_anon_ABC...XYZ       │
│ • service_role → sk_service_ABC...XYZ   │
└─────────────────────────────────────────┘
```

---

#### **2️⃣ Copy These Exact Values**

| Variable | Source | Where to Paste |
|----------|--------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (copy full URL) | `.env.local` line 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon public** key | `.env.local` line 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** key (KEEP SECRET!) | `.env.local` line 4 |

---

### **📝 Step 2: Fill in Your `.env.local` File**

Your `.env.local` file is located at: `c:\Data-website\.env.local`

**Example of what it looks like BEFORE (with placeholders):**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

**Example of what it looks like AFTER (with real values):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprMTIzNDU2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDMyMjU4MDAsImV4cCI6MTk1ODQwNTgwMH0.abc123...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprMTIzNDU2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0MzIyNTgwMCwiZXhwIjo5OTk5OTk5OTk5fQ.xyz987...
```

---

### **💳 Step 3: Get Paystack Credentials (Payment)**

If using Paystack for payments:

1. Go to **Paystack Dashboard** → [https://dashboard.paystack.com](https://dashboard.paystack.com)
2. Click **Settings** → **API Keys & Webhooks**
3. You'll see:
   - **Public Key** (starts with `pk_live_` or `pk_test_`)
   - **Secret Key** (starts with `sk_live_` or `sk_test_`)

Copy to `.env.local`:
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_abc123xyz456...
PAYSTACK_SECRET_KEY=sk_live_abc123xyz456...
```

**ℹ️ Use Test Keys for Development:**
- Test URL: https://checkout.paystack.com (automatically detects test keys)
- Live URL: Same, but uses live keys in production

---

### **✅ Complete `.env.local` Example**

```bash
# =============================================
# SUPABASE CONFIGURATION
# =============================================
NEXT_PUBLIC_SUPABASE_URL=https://yourproject123456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =============================================
# PAYMENT INTEGRATION (Paystack)
# =============================================
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_abc123xyz456...
PAYSTACK_SECRET_KEY=sk_test_abc123xyz456...

# =============================================
# API CONFIGURATION
# =============================================
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development

# =============================================
# EMAIL CONFIGURATION (Optional)
# =============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# =============================================
# APP CONFIGURATION
# =============================================
NEXT_PUBLIC_APP_NAME=VAULT DATA
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### **🔗 How These Connect to Your Project**

```
┌─────────────────────────────────────────────────┐
│            Your Next.js App                      │
│                                                  │
│  Frontend Components:                            │
│  • /app/login → uses SUPABASE_URL + ANON_KEY    │
│  • /app/dashboard → queries database via RLS    │
│  • /app/dashboard/buy → uses PAYSTACK_PUBLIC_KEY│
│                                                  │
│  Backend API Routes:                            │
│  • /api/wallet/fund → uses SERVICE_ROLE_KEY    │
│  • /api/orders/create → uses PAYSTACK_SECRET   │
│  • /api/admin/stats → uses SERVICE_ROLE_KEY    │
│                                                  │
└─────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│        Supabase Backend (PostgreSQL)             │
│                                                  │
│  • users table                                   │
│  • wallets table                                 │
│  • orders table                                  │
│  • transactions table                            │
│  • data_plans table                              │
│  • sim_sources table                             │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

### **🧪 Test Your Connection**

After filling in `.env.local`, restart your app and:

1. **In terminal:** `npm run dev`
2. **Open browser:** `http://localhost:3000`
3. **Go to signup:** Create an account
4. **Check Supabase Dashboard:** 
   - Settings → Authentication → Users
   - You should see your new user listed ✅

---

### **⚠️ Important Security Notes**

1. **NEVER commit `.env.local`** to Git (it's in `.gitignore` already ✅)
2. **`SUPABASE_SERVICE_ROLE_KEY`** - Keep SECRET, only use in backend
3. **`NEXT_PUBLIC_*` variables** - These are public (visible in frontend), safe to expose
4. **Use Environment Variables for Production** - Vercel has a "Environment Variables" section in project settings

---

### **🚀 For Production Deployment (Vercel)**

When deploying to Vercel:

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://yourproject.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = pk_live_...
   PAYSTACK_SECRET_KEY = sk_live_...
   ```
4. Click **Deploy**

---

### **❓ Troubleshooting**

**Problem:** "Failed to connect to Supabase"
- ✅ Check `.env.local` values are copied exactly (no extra spaces)
- ✅ Verify URL starts with `https://`
- ✅ Check Supabase project is online (Dashboard shows green status)

**Problem:** "Table doesn't exist"
- ✅ Run the schema.sql in Supabase SQL Editor
- ✅ Verify all tables exist: Dashboard → SQL Editor → Run `SELECT * FROM information_schema.tables`

**Problem:** "Permission denied" or "row level security"
- ✅ Check RLS policies are created (run full schema.sql)
- ✅ Verify user role in users table is 'user' or 'admin'

---

## ✅ Checklist

- [ ] Enable Authentication in Supabase (Settings > Authentication)
- [ ] Run schema.sql in Supabase SQL Editor
- [ ] Copy Project URL to `.env.local` line 2
- [ ] Copy Anon Key to `.env.local` line 3
- [ ] Copy Service Role Key to `.env.local` line 4
- [ ] (Optional) Add Paystack keys if using payments
- [ ] Run `npm install` (if not done yet)
- [ ] Run `npm run dev`
- [ ] Test signup at http://localhost:3000/signup
- [ ] Verify user appears in Supabase Dashboard

**All set! Your Supabase is now connected to your project.** 🎉
