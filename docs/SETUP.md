# Setup and Deployment Guide

A professional, production-ready VTU (Virtual Top-Up) and data selling website built with Next.js, React, TailwindCSS, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Paystack or Flutterwave account

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/vault-data.git
cd vault-data
npm install
```

### 2. Setup Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key

NEXT_PUBLIC_APP_NAME=VAULT DATA
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Setup Supabase Database

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Copy entire content from `database/schema.sql`
5. Paste and execute in Supabase SQL Editor
6. Verify all tables are created

### 4. Create Initial Data Plans

In Supabase SQL Editor, add sample data plans:

```sql
INSERT INTO data_plans (network, plan_name, data_size, price, validity_days, is_active)
VALUES
  ('mtn', 'MTN 1GB', '1GB', 250.00, 30, true),
  ('mtn', 'MTN 2GB', '2GB', 500.00, 30, true),
  ('mtn', 'MTN 5GB', '5GB', 1000.00, 30, true),
  ('airtel', 'Airtel 1GB', '1GB', 250.00, 30, true),
  ('airtel', 'Airtel 2GB', '2GB', 500.00, 30, true),
  ('glo', 'Glo 1GB', '1GB', 240.00, 30, true),
  ('glo', 'Glo 2GB', '2GB', 480.00, 30, true),
  ('9mobile', '9mobile 1GB', '1GB', 220.00, 30, true);
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📁 Project Structure

```
vault-data/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── wallet/             # Wallet management
│   │   ├── orders/             # Order management
│   │   ├── admin/              # Admin endpoints
│   │   └── payments/           # Payment verification
│   ├── admin/                  # Admin dashboard pages
│   ├── dashboard/              # User dashboard pages
│   ├── login/                  # Auth pages
│   ├── signup/
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── common/                 # Shared UI components
│   ├── dashboard/              # Dashboard components
│   ├── home/                   # Landing page sections
│   └── layout/                 # Layout components
├── lib/
│   ├── supabase.ts            # Supabase client config
│   ├── auth.ts                # Auth functions
│   ├── api-helpers.ts         # API utilities
│   ├── payment.ts             # Payment functions
│   └── utils.ts               # Helper functions
├── types/
│   └── index.ts               # TypeScript types
├── styles/
│   └── globals.css            # Global styles
├── database/
│   └── schema.sql             # Database schema
└── docs/
    ├── SETUP.md               # This file
    ├── DEPLOYMENT.md          # Deployment guide
    └── SUPABASE_SETUP.md      # Detailed Supabase setup
```

---

## 🔐 Authentication Setup

### Supabase Auth Configuration

1. In Supabase dashboard, go to **Authentication → Settings**
2. Set your site URL and redirect URLs:

```
Site URL: http://localhost:3000
Redirect URLs:
  - http://localhost:3000/dashboard
  - http://localhost:3000/admin
  - http://localhost:3000/auth/callback
```

3. Enable Email/Password auth provider

### Creating Admin Users

1. Sign up a regular account
2. Go to Supabase dashboard → SQL Editor
3. Run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@vault.com';
```

---

## 💳 Payment Integration

### Paystack Setup

1. Sign up at [Paystack](https://dashboard.paystack.com/signup)
2. Get your keys from Dashboard → Settings → API Keys
3. Add to `.env.local`:

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

### Flutterwave Setup (Optional)

1. Sign up at [Flutterwave](https://dashboard.flutterwave.com/signup)
2. Get your keys from Settings → API
3. Add to `.env.local`:

```env
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_XXXXX
FLUTTERWAVE_SECRET_KEY=FLWSECK_XXXXX
```

---

## 📊 Database Schema Overview

### Core Tables

- **users**: User profiles with role-based access (admin, user)
- **wallets**: User wallet balances and stats
- **transactions**: Financial transactions (credit/debit)
- **orders**: Data/Airtime orders with status tracking
- **data_plans**: Available data plans by network and type
- **sims**: SIM card and data source management
- **notifications**: User activity notifications
- **daily_stats**: Dashboard statistics

### Key Features

- ✅ Row Level Security (RLS) enabled
- ✅ Automatic timestamp updating
- ✅ Trigger-based balance calculations
- ✅ Support for multiple networks (MTN, Airtel, Glo, 9mobile)
- ✅ Real-time notifications

---

## 🎨 UI Components & Styling

### Styling

Uses TailwindCSS with custom color scheme:

```css
Primary: #6366f1 (Indigo)
Secondary: #8b5cf6 (Purple)
Accent: #ec4899 (Pink)
Success: #10b981 (Green)
Danger: #ef4444 (Red)
Warning: #f59e0b (Amber)
Dark: #0f172a
Light: #f8fafc
```

### Available Components

All components are in `/components` folder with proper organization.

---

## 📱 Key Features

### For Users

- ✅ Sign up and secure login
- ✅ Wallet funding via Paystack/Flutterwave
- ✅ Buy data and airtime for multiple networks
- ✅ Order history and real-time tracking
- ✅ Transaction history with status
- ✅ Real-time notifications
- ✅ Mobile-responsive design
- ✅ Dark mode support (optional)

### For Admins

- ✅ View all orders and transactions
- ✅ Manage user accounts
- ✅ Manage data plans and pricing
- ✅ SIM allocation and management
- ✅ Dashboard with analytics and charts
- ✅ Manual order completion/failure
- ✅ Advanced filtering and search
- ✅ Revenue tracking and reporting

---

## 🚢 Deployment on Vercel

### 1. Prepare for Deployment

```bash
npm run build
npm run type-check
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Production ready VAULT DATA"
git push origin main
```

### 3. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure Environment Variables (copy from `.env.local`)
5. Click Deploy

### 4. Configure Custom Domain

In Vercel Dashboard:
1. Go to Settings → Domains
2. Add your custom domain (example.com)
3. Follow DNS configuration steps

### 5. Update Supabase Auth URLs

In Supabase Dashboard → Settings → Authentication:

```
Site URL: https://yourdomain.com
Redirect URLs:
  - https://yourdomain.com/dashboard
  - https://yourdomain.com/admin
  - https://yourdomain.com/auth/callback
```

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use `.env.local.example` as template
   - Rotate API keys periodically
   - Use different keys for dev/production

2. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Users can only access their data
   - Admins have elevated privileges
   - Verify RLS policies in Supabase

3. **Password Security**
   - Use Supabase Auth (built-in bcrypt hashing)
   - Implement rate limiting on login
   - Enforce minimum password requirements

4. **API Security**
   - Validate all inputs server-side
   - Use HTTPS only (automatic on Vercel)
   - Implement CORS headers
   - Rate limit sensitive endpoints

5. **Data Protection**
   - Enable automatic backups in Supabase
   - Encrypt sensitive data in transit
   - Use secure headers
   - Implement audit logging

---

## 🐛 Troubleshooting

### Development Issues

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install

# Restart dev server
npm run dev
```

### Environment Variables Not Loading

- Make sure `.env.local` file exists
- Restart dev server after adding variables
- Check that variable names match exactly

### Database Connection Error

- Verify Supabase URL and keys in `.env.local`
- Check that Supabase project is active
- Verify network connectivity
- Check Supabase dashboard for errors

### Authentication Issues

- Clear browser cookies/cache
- Verify redirect URLs in Supabase
- Check authentication provider settings
- Review browser console for errors

### Payment Gateway Issues

- Verify API keys (test vs live mode)
- Check webhook URLs in Paystack/Flutterwave
- Review payment logs for transaction details
- Test with Paystack test card: 4084084084084081

---

## 📞 Support & Contributing

### Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Paystack API](https://paystack.com/docs/api/)
- [Flutterwave API](https://developer.flutterwave.com/docs)

### Reporting Bugs

Create issues with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc.)

---

## 📝 License

Proprietary Software - All rights reserved

---

## Version History

- v1.0.0 - Initial production-ready release
2. Create a new query
3. Copy and paste the entire contents of `database/schema.sql`
4. Click "Run"
5. Wait for successful completion

## Step 4: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in:

```env
# From Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# From Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key

# App Config
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=VAULT DATA
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: Setup Paystack Test Keys

### 5.1 Get Test Keys

1. Log in to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to "Settings" → "API Keys & Webhooks"
3. Copy:
   - Public Key (Test) → `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - Secret Key (Test) → `PAYSTACK_SECRET_KEY`

### 5.2 Test Cards

For testing payments, use these Paystack test cards:

| Card | Exp | CVV | Status |
|------|-----|-----|--------|
| 4084 0000 0000 0001 | Any future | 000 | Success |
| 5060 0000 0000 0001 | Any future | 000 | Success |
| 5200 0000 0000 0002 | Any future | 000 | Insufficient |

## Step 6: Create Test Admin Account

### 6.1 Via Supabase Console

1. Start the dev server:
```bash
npm run dev
```

2. Sign up with:
   - Email: admin@vaultdata.com
   - Password: Admin@1234

3. Go to Supabase, open "Users" table, find your user
4. Update the role to `admin`

### 6.2 Create Wallet for User

1. In Supabase SQL Editor, run:
```sql
-- For the admin user (replace with your user_id)
INSERT INTO wallets (user_id, balance, currency)
VALUES ('your_user_id_here', 50000, 'NGN');
```

## Step 7: Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

## Step 8: Test the Application

### 8.1 Test User Registration & Login

1. Go to http://localhost:3000/signup
2. Create a new account
3. Go to http://localhost:3000/login
4. Login with your credentials

### 8.2 Test Dashboard

1. You should see the dashboard at http://localhost:3000/dashboard
2. View wallet balance (should show 0 initially)
3. Try to fund your wallet (will use Paystack test)

### 8.3 Add Test Data Plans

```sql
-- Add MTN data plans
INSERT INTO data_plans (network, package_type, name, amount, validity, is_active)
VALUES
  ('MTN', 'data', '100MB', 50, '2 hours', true),
  ('MTN', 'data', '1GB', 350, '7 days', true),
  ('MTN', 'data', '5GB', 1500, '30 days', true);
```

### 8.4 Add Test SIM Sources

```sql
-- Add SIM source
INSERT INTO sim_sources (network, source_type, identifier, balance, total_balance, status)
VALUES
  ('MTN', 'sim', '08123456789', 1000.00, 5000.00, 'active'),
  ('Airtel', 'sim', '08012345678', 2000.00, 5000.00, 'active');
```

### 8.5 Test Admin Dashboard

1. Login as admin
2. Visit http://localhost:3000/admin
3. You should see dashboard stats

## Useful Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check

# Format code (prettier)
npm run format
```

## Database Operations

### Reset Database

```bash
# In Supabase Console
# Go to Settings → Danger Zone → Reset Database
```

### View Logs

```bash
# In Supabase Console
# Go to Logs
```

### Database Backups

```bash
# Automatic daily backups available in Supabase
# Go to Settings → Backups
```

## Debugging

### Enable Debug Logs

1. Create `.env.local.development`:
```env
DEBUG=*
LOG_LEVEL=debug
```

2. Check browser console for client-side errors
3. Check terminal for server-side errors

### Common Issues

**Issue**: "Supabase connection refused"
- Solution: Check if `NEXT_PUBLIC_SUPABASE_URL` is correct

**Issue**: "Auth session not found"
- Solution: Clear browser localStorage and cookies, sign in again

**Issue**: "Payment not processing"
- Solution: Verify Paystack test keys are correct

## File Structure Tips

```
vault-data/
├── .env.local              # Your local env vars (git ignored)
├── app/                    # Next.js app router
├── components/             # React components
├── lib/                    # Utilities and services
├── types/                  # TypeScript definitions
├── database/
│   └── schema.sql         # Database schema to run in Supabase
└── docs/                  # Documentation
```

## Next Steps

After successfully setting up:

1. Explore the [API Documentation](./API_DOCUMENTATION.md)
2. Read the [Admin Guide](./ADMIN_GUIDE.md)
3. Check out [Deployment Guide](./DEPLOYMENT.md)
4. Review [Security Best Practices](./SECURITY.md)

## Getting Help

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Review the main [README.md](../README.md)
- Create an issue on GitHub
- Contact: support@vaultdata.com

## Next: Production Deployment

When ready to deploy, follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide to deploy to Vercel and Supabase.

---

🎉 You're all set! Happy coding!
