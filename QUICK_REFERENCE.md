# VAULT DATA - Project Quick Reference

## 🚀 Project Overview
A professional, production-ready VTU (Virtual Top-Up) and data selling website with Next.js, React, TailwindCSS, and Supabase.

## 📁 Key Directories
- `/app` - Next.js pages and API routes
- `/components` - Reusable UI components
- `/lib` - Helper functions and utilities
- `/types` - TypeScript type definitions
- `/database` - SQL schemas
- `/docs` - Documentation

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.local.example .env.local

# 3. Start development server
npm run dev

# 4. Visit http://localhost:3000
```

## 🔑 Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-key
PAYSTACK_SECRET_KEY=your-paystack-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 📊 Database Tables
- `users` - User profiles with role-based access
- `wallets` - User wallet management
- `transactions` - Financial transactions
- `orders` - Data/airtime orders
- `data_plans` - Available plans by network
- `sims` - SIM and data source management
- `notifications` - User notifications

## 🔐 Networks Supported
- MTN
- Airtel
- Glo
- 9mobile

## 💳 Payment Gateways
- Paystack (Primary)
- Flutterwave (Optional)

## 📱 Key Features

### For Users
- ✅ Secure authentication (Supabase Auth)
- ✅ Wallet funding & balance tracking
- ✅ Buy data & airtime
- ✅ Order history & tracking
- ✅ Transaction history
- ✅ Real-time notifications
- ✅ Mobile responsive UI

### For Admins
- ✅ Dashboard with analytics
- ✅ Manage all orders
- ✅ Manage data plans & SIMs
- ✅ User management
- ✅ Revenue tracking
- ✅ Advanced filtering & search

## 🎨 Color Palette
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Accent: `#ec4899` (Pink)
- Success: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)
- Dark: `#0f172a`
- Light: `#f8fafc`

## 📚 API Routes

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in user
- `POST /api/auth/logout` - Sign out
- `POST /api/auth/reset-password` - Request password reset
- `GET /api/auth/user` - Get current user
- `PUT /api/auth/user` - Update profile

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/fund` - Initiate wallet funding
- `POST /api/wallet/verify-payment` - Verify payment
- `GET /api/wallet/transactions` - Get transaction history

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Data Plans
- `GET /api/data-plans` - Get available plans
- `GET /api/data-plans/:network` - Get plans by network

### Admin
- `GET /api/admin/orders` - View all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/stats` - Dashboard statistics

## 🔄 Order Status Flow
`pending` → `processing` → `completed` ✓
                       → `failed` ✗

## 💰 Transaction Types
- `credit` - Money received
- `debit` - Money spent

## 🔒 Security Features
- Row Level Security (RLS) enabled
- JWT authentication
- Secure password hashing
- HTTPS encryption only
- Environment variable protection
- Input validation
- CORS protection

## 🚀 Deployment
- **Frontend**: Vercel
- **Backend**: Next.js API routes + Supabase
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## 📦 Key Dependencies
- `next@^14.0.0` - React framework
- `react@^18.2.0` - UI library
- `@supabase/supabase-js` - Database client
- `tailwindcss@^3.3.0` - Styling
- `axios@^1.6.0` - HTTP client

## 📞 Troubleshooting

### Common Issues & Solutions
1. **Cannot connect to Supabase**
   - Check `.env.local` has correct URL and keys
   - Verify Supabase project is running

2. **Payment verification fails**
   - Ensure API keys match environment (test vs live)
   - Check webhook URLs configured

3. **RLS permission denied**
   - User must be authenticated
   - Check RLS policies in Supabase dashboard

4. **Environment variables not loading**
   - Restart dev server after updating `.env.local`
   - Clear Next.js cache: `rm -rf .next`

## 📖 Documentation
- `docs/SETUP.md` - Complete setup guide
- `docs/DEPLOYMENT.md` - Production deployment
- `database/schema.sql` - Database schema

## 📝 Scripts
```bash
npm run dev          # Start development
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run type-check   # TypeScript checking
```

## 🎯 Deployment Checklist
- [ ] Setup all environment variables
- [ ] Run database migrations
- [ ] Create initial data plans
- [ ] Configure payment gateways
- [ ] Test payment flow
- [ ] Setup email notifications
- [ ] Configure admin account
- [ ] Deploy to Vercel
- [ ] Enable custom domain
- [ ] Setup SSL certificate
- [ ] Configure backups

---

**Version**: 1.0.0  
**Status**: Production Ready ✅

### Production (After Deployment)
- App: https://www.vaultdata.com
- Dashboard: https://www.vaultdata.com/dashboard
- Admin: https://www.vaultdata.com/admin

## 👤 Test Accounts

### User Account
- Email: user@test.com
- Password: User@1234

### Admin Account
- Email: admin@test.com
- Password: Admin@1234

## 💳 Paystack Test Cards

| Card | Exp | CVV | Result |
|------|-----|-----|--------|
| 4084000000000001 | Any | 000 | Success |
| 5060000000000001 | Any | 000 | Success |
| 5200000000000002 | Any | 000 | Insufficient |

## 📦 NPM Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
npm run format       # Format code (Prettier)
```

## 🗄️ Database Commands

### Connect to Supabase DB
```bash
# Via psql
psql -U postgres -h db.yourproject.supabase.co

# Database URL
postgresql://postgres:password@db.yourproject.supabase.co:5432/postgres
```

### Common Queries

```sql
-- List all users
SELECT id, email, full_name, role FROM users;

-- Get user wallet balance
SELECT balance FROM wallets WHERE user_id = 'user_id';

-- List recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Get admin stats
SELECT 
  COUNT(*) as total_orders,
  SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed,
  SUM(amount) as total_revenue
FROM orders;
```

## 🔌 API Endpoints Cheatsheet

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Wallet
- `GET /api/wallet/balance` - Get balance
- `POST /api/wallet/fund` - Fund wallet
- `POST /api/wallet/verify` - Verify payment
- `GET /api/wallet/transactions` - Transaction history

### Orders
- `POST /api/orders/create` - Create order
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `GET /api/admin/users` - All users
- `GET /api/admin/sims` - SIM management

## 📂 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (local) |
| `database/schema.sql` | Database schema |
| `lib/supabase.ts` | Supabase client setup |
| `lib/auth.ts` | Authentication service |
| `lib/api.ts` | API client |
| `components/layout/Header.tsx` | Navigation header |
| `app/page.tsx` | Home/landing page |

## 🔑 Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=

# Optional
NEXT_PUBLIC_API_URL=
NODE_ENV=
```

## 🐛 Debugging Tips

### Browser Console
- Check for JS errors
- Review network requests
- Monitor performance

### Server Logs
```bash
# View from terminal when running dev server
npm run dev
```

### Supabase Logs
- Go to Supabase dashboard
- Click "Logs" section
- Filter by endpoint/error

### Clear Cache
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install
```

## 🚀 Deployment Checklist

- [ ] Update environment variables
- [ ] Configure Supabase backup
- [ ] Setup Paystack webhooks
- [ ] Enable Vercel analytics
- [ ] Configure domain name
- [ ] Test payment flow
- [ ] Create admin account
- [ ] Add initial data plans
- [ ] Add SIM sources
- [ ] Monitor performance

## 📊 Useful SQL Queries

```sql
-- Total users
SELECT COUNT(*) as total_users FROM users;

-- Users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Total revenue today
SELECT SUM(amount) FROM transactions 
WHERE type='debit' AND DATE(created_at)=TODAY();

-- Orders by network
SELECT network, COUNT(*) FROM orders GROUP BY network;

-- Top 10 users by transactions
SELECT user_id, COUNT(*) as orders 
FROM orders GROUP BY user_id 
ORDER BY orders DESC LIMIT 10;

-- Failed orders
SELECT * FROM orders WHERE status='failed';

-- Wallet balances
SELECT user_id, balance FROM wallets WHERE balance > 0;
```

## 🔐 Security Reminders

- ⚠️ Never commit `.env.local`
- ⚠️ Never expose API keys
- ⚠️ Always use HTTPS in production
- ⚠️ Validate all inputs
- ⚠️ Use environment variables for secrets
- ⚠️ Review RLS policies regularly
- ⚠️ Keep dependencies updated

## 📚 Documentation Links

- [Setup Guide](./SETUP.md)
- [Supabase Setup](./SUPABASE_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Admin Guide](./ADMIN_GUIDE.md)

## 🆘 Need Help?

1. Check the docs folder
2. Review GitHub issues
3. Check Supabase/Paystack documentation
4. Contact: support@vaultdata.com

## ⚡ Performance Tips

- Enable query result caching
- Use database indexes
- Minimize bundle size
- Enable CDN caching
- Monitor lighthouse scores
- Profile with DevTools

## 🗂️ Directory Structure Quick Guide

```
app/                 → Pages and routes
components/          → React components
lib/                 → Utilities and services
types/              → TypeScript types
styles/             → CSS files
docs/               → Documentation
database/           → Database schema
```

---

**Last Updated**: 2026
**Version**: 1.0.0
