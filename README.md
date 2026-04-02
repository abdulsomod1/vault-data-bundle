# VAULT DATA - Production Ready VTU & Data Website

A professional, modern, and fully-featured Virtual Top-Up (VTU) and data services platform built with Next.js 14, React 18, TailwindCSS, and Supabase. Inspired by Freshub but cleaner, more intuitive, and highly polished.

## ✨ Key Features

### 🎯 User Features
- **Instant Authentication** - Secure signup/login with Supabase Auth
- **Wallet Management** - Fund wallet via Paystack or Flutterwave
- **Buy Data & Airtime** - Support for MTN, Airtel, Glo, 9mobile
- **Order Tracking** - Real-time order status updates
- **Transaction History** - Detailed transaction records
- **Notifications** - Real-time in-app notifications
- **Mobile Responsive** - Fully optimized for all devices
- **SEO Optimized** - Server-side rendering with Next.js

### 👨‍💼 Admin Features
- **Dashboard** - Analytics and statistics
- **Order Management** - View, filter, and manage all orders
- **User Management** - Manage customer accounts
- **Data Plans** - Create and manage data plans
- **SIM Management** - Assign and track SIMs
- **Revenue Tracking** - Monitor daily revenue and sales

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14 (App Router) |
| UI | React 18 + TailwindCSS 3 |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Payments | Paystack + Flutterwave |
| Deployment | Vercel + Supabase |
| Language | TypeScript |

## 📦 Project Structure

```
vault-data/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication
│   │   ├── wallet/              # Wallet operations
│   │   ├── orders/              # Order management
│   │   ├── payments/            # Payment verification
│   │   └── admin/               # Admin endpoints
│   ├── admin/                   # Admin pages
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   ├── users/page.tsx
│   │   └── sims/page.tsx
│   └── api/                 # API routes
│       ├── wallet/
│       ├── orders/
│       └── admin/
├── components/              # React components
│   ├── common/             # Shared components
│   ├── layout/             # Layout components
│   ├── home/               # Landing page
│   └── dashboard/          # Dashboard components
├── lib/                    # Utility functions
│   ├── supabase.ts         # Supabase client
│   ├── auth.ts             # Auth service
│   ├── api.ts              # API client
│   ├── utils.ts            # Helper functions
│   ├── constants.ts        # App constants
│   └── api-helpers.ts      # API middleware
├── types/                  # TypeScript types
├── styles/                 # CSS files
├── database/              # Database schema
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Paystack merchant account
- Vercel account (for deployment)

### 1. Local Setup

[See SETUP.md for detailed local setup instructions](./docs/SETUP.md)

```bash
# Clone and install
git clone https://github.com/yourusername/vault-data.git
cd vault-data
npm install

# Setup environment variables
cp .env.local.example .env.local

# Add your Supabase credentials and Paystack keys to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Supabase Setup

[See SUPABASE_SETUP.md for database schema setup](./docs/SUPABASE_SETUP.md)

```bash
# Run database schema in Supabase SQL editor
# File: database/schema.sql
```

### 3. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_public_key
PAYSTACK_SECRET_KEY=your_secret_key

# App
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## 💳 Payment Integration (Paystack)

[See PAYSTACK_INTEGRATION.md for setup guide](./docs/PAYSTACK_INTEGRATION.md)

### Steps:
1. Create Paystack merchant account
2. Get your public and secret keys from dashboard
3. Add to `.env.local`
4. Test with Paystack test cards

**Test Card:** 4084 0000 0000 0001, Exp: Any future date, CVV: 000

## 📊 Data Plans

Default data plans are pre-configured for all networks:
- **MTN**: 100MB-5GB with varying validity periods
- **Airtel**: 100MB-5GB packages
- **Glo**: Competitive rates
- **9mobile**: Full coverage

All plans are customizable via the admin panel.

## 🔐 Security Features

- ✅ End-to-end encryption for sensitive data
- ✅ Row-level security (RLS) policies in Supabase
- ✅ CSRF protection
- ✅ XSS prevention with React sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ Secure password hashing (Supabase Auth)
- ✅ HTTPS enforced in production
- ✅ Rate limiting on API endpoints
- ✅ Secure environment variable management

## 📱 User Flow

```
1. Sign Up → Email Verification
2. Login → Dashboard
3. Fund Wallet → Paystack Payment → Wallet Updated
4. Buy Data/Airtime → Select Network/Plan → Confirm → Order Created
5. Order Processing → Status Updates → Completion
6. Transaction History → Export Records
```

## 👨‍💼 Admin Flow

```
1. Admin Login
2. View Dashboard Stats
3. Manage Orders (View, Filter, Update Status, Assign SIM)
4. Manage Users (View, Edit Wallet Balance, Block/Unblock)
5. Manage SIMs/Data Sources (Add, Edit, Track Balance)
6. Manage Data Plans (Create, Update, Deactivate)
7. View System Reports
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/reset-password` - Password reset

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/fund` - Initiate Paystack payment
- `POST /api/wallet/verify` - Verify payment & credit wallet
- `GET /api/wallet/transactions` - Get transaction history

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `PATCH /api/orders/:id/status` - Update order status (admin only)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - All orders (with filters)
- `GET /api/admin/users` - All users
- `GET /api/admin/sims` - Manage SIM sources
- `POST /api/admin/sims` - Add new SIM
- `PATCH /api/admin/sims/:id` - Update SIM
- `DELETE /api/admin/sims/:id` - Delete SIM

## 📚 Documentation

- [SETUP.md](./docs/SETUP.md) - Local development setup
- [SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) - Database configuration
- [PAYSTACK_INTEGRATION.md](./docs/PAYSTACK_INTEGRATION.md) - Payment setup
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deploy to production
- [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) - Complete API reference
- [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md) - Admin panel usage

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Link with Vercel and deploy
vercel --prod
```

[See DEPLOYMENT.md for detailed deployment instructions](./docs/DEPLOYMENT.md)

## 📈 Performance Optimization

- ✅ Next.js Image optimization
- ✅ Code splitting and lazy loading
- ✅ Caching strategies
- ✅ CDN distribution via Vercel
- ✅ Database query optimization
- ✅ Minified CSS and JavaScript
- ✅ SEO-optimized structure

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build
```

## 🐛 Troubleshooting

**Issue**: Supabase connection errors
- Solution: Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

**Issue**: Paystack payment not working
- Solution: Verify keys are correct in `.env.local` and account is activated

**Issue**: Database migrations not running
- Solution: Copy schema from `database/schema.sql` and run in Supabase SQL editor

**Issue**: Authentication issues
- Solution: Clear browser cache and localStorage, verify Supabase Auth settings

[See TROUBLESHOOTING.md for more solutions](./docs/TROUBLESHOOTING.md)

## 📞 Support & Contact

- Email: support@vaultdata.com
- Documentation: [docs.vaultdata.com](https://docs.vaultdata.com)
- Issues: GitHub Issues

## 📄 License

MIT License - feel free to use for personal and commercial projects

## 🙏 Contributing

Contributions are welcome! Please read CONTRIBUTING.md before submitting pull requests.

## 📅 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

**Built with ❤️ by VAULT DATA Team**
