# VAULT DATA - Deployment Guide

Complete guide for deploying VAULT DATA to production using Vercel and Supabase.

## 🚀 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema migrated
- [ ] Initial data plans created
- [ ] Payment gateway configured with LIVE keys
- [ ] Admin account created
- [ ] Testing completed locally
- [ ] Code pushed to GitHub
- [ ] Custom domain registered (optional)

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier sufficient)
- Supabase project (free or paid)
- Paystack/Flutterwave account (for live keys)
- Custom domain (optional)

## 📝 Step-by-Step Deployment

### 1. Prepare Production Database

#### 1.1 Create Supabase Production Project
1. Go to [Supabase Dashboard](https://supabase.com)
2. Click "New Project"
3. Enter project name
4. Select region closest to users
5. Create strong database password
6. Click "Create new project"

#### 1.2 Get Production Credentials
1. Go to Project Settings → API
2. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key

#### 1.3 Run Database Migrations
1. In Supabase, go to SQL Editor
2. Create new query
3. Copy entire content from `database/schema.sql`
4. Execute the SQL

#### 1.4 Create Initial Data
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

### 2. Prepare Production Payment Gateway

#### 2.1 Paystack Live Configuration
1. Go to [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to Settings → API Keys & Webhooks
3. Switch to LIVE environment (toggle top right)
4. Copy LIVE keys:
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Public key (pk_live_xxx)
   - `PAYSTACK_SECRET_KEY` - Secret key (sk_live_xxx)

#### 2.2 Configure Paystack Webhooks
1. In Paystack Dashboard → Settings → Webhooks
2. Add webhook URL:
   ```
   https://yourdomain.com/api/payments/verify
   ```
3. Select events:
   - charge.success
   - charge.failed
4. Save webhook

### 3. Build and Test Locally

```bash
# Build production bundle
npm run build

# Test production build
npm run start

# Visit http://localhost:3000
```

Test critical flows:
- User signup/login
- Wallet funding
- Data purchase
- Admin dashboard
- Order tracking

### 4. Prepare GitHub Repository

```bash
# Ensure .gitignore includes sensitive files
cat >> .gitignore << 'EOF'
.env.local
.env.production.local
node_modules/
.next/
dist/
EOF

# Push to GitHub
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 5. Deploy to Vercel

#### 5.1 Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Search and select your VAULT DATA repository
5. Click "Import"

#### 5.2 Configure Environment Variables

In Vercel Project Settings → Environment Variables, add all variables with scope: "Production"

```
NEXT_PUBLIC_SUPABASE_URL = your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY = your-production-service-role-key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = pk_live_xxxxx
PAYSTACK_SECRET_KEY = sk_live_xxxxx
NEXT_PUBLIC_APP_URL = https://yourdomain.vercel.app
NODE_ENV = production
```

#### 5.3 Deploy
1. Click "Deploy"
2. Wait for build to complete (typically 2-3 minutes)
3. Click "Visit" to see deployed site
4. Test basic functionality

### 6. Setup Custom Domain (Optional but Recommended)

#### 6.1 Add Domain in Vercel
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., vault.com)
4. Vercel displays required DNS records

#### 6.2 Update DNS Records
1. Go to your domain provider (Namecheap, GoDaddy, AWS Route53, etc.)
2. Add DNS records as shown by Vercel:
   - Type A record
   - Type CNAME record
3. Update nameservers if required
4. Wait for DNS propagation (24-48 hours)

#### 6.3 Verify Domain
1. After DNS propagation, verify in Vercel
2. Vercel auto-generates SSL certificate
3. Test https://yourdomain.com

### 7. Finalize Supabase Configuration

#### 7.1 Configure Auth Redirect URLs
In Supabase Dashboard → Settings → Authentication:

Add Site URL and Redirect URLs:

```
Site URL:
https://yourdomain.com

Redirect URLs:
https://yourdomain.com/dashboard
https://yourdomain.com/admin
https://yourdomain.com/auth/callback
```

If using Vercel default domain:

```
Site URL:
https://vault-data.vercel.app

Redirect URLs:
https://vault-data.vercel.app/dashboard
https://vault-data.vercel.app/admin
https://vault-data.vercel.app/auth/callback
```

#### 7.2 Enable Production Features
1. Enable Row Level Security for all tables
2. Configure backups:
   - Settings → Backups
   - Daily backups
   - 30-day retention
3. Enable logging:
   - Settings → Logs
   - Monitor errors and warnings

### 8. Final Verification

- [ ] Homepage loads without errors
- [ ] Signup flow works
- [ ] Login works with test account
- [ ] Wallet funding initiates payment
- [ ] Paystack payment page displays
- [ ] Orders can be created
- [ ] Admin dashboard accessible
- [ ] Real-time notifications work
- [ ] All responsive on mobile
- [ ] HTTPS works correctly
- [ ] No console errors

## 🔒 Security Configuration

### Enable CORS Protection
```json
CORS headers configured automatically by Next.js
```

### Database Row Level Security
All tables have RLS enabled. Verify in Supabase:

```sql
-- Check RLS status
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public';
```

### Environment Variable Protection
- Never expose secret keys in code
- Use Vercel's environment variables only
- Rotate keys periodically
- Use different keys for dev/staging/production

## 📊 Post-Deployment Monitoring

### Setup Monitoring Alerts

1. **Vercel Analytics**
   - Dashboard → Analytics
   - Monitor page performance
   - Track user metrics

2. **Supabase Monitoring**
   - Dashboard → Reports
   - Monitor database performance
   - Check query logs

3. **Payment Monitoring**
   - Paystack Dashboard → Transactions
   - Verify webhook processing
   - Monitor payment success rate

### Recommended Monitoring Setup

```bash
# Monitor Vercel deployments
vercel logs --prod --since -1h

# Check Supabase realtime
supabase monitor
```

## 🚨 Troubleshooting

### Application Won't Build
```bash
# Check build logs in Vercel
# Verify all dependencies installed
npm install

# Build locally first
npm run build

# Check for TypeScript errors
npm run type-check
```

### Database Connection Error
1. Verify credentials in environment variables
2. Check Supabase project is active
3. Verify firewall rules in Supabase
4. Test connection with credentials

### Payment Verification Fails
1. Confirm LIVE keys (not test keys)
2. Verify webhook URL configured correctly
3. Check webhook response format (JSON)
4. Review Paystack logs for errors

### Redirects Not Working
1. Verify redirect URLs in Supabase Auth settings
2. Check cookie domain settings
3. Clear browser cache
4. Test in incognito mode

## 📞 Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Paystack API](https://paystack.com/docs/api/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## ✅ Deployment Completed!

Your VAULT DATA is now live and production-ready.

### Next Steps:
1. Monitor application for 24 hours
2. Set up automated backups
3. Configure additional monitoring alerts
4. Plan customer support
5. Plan feature updates

---

**Version**: 1.0.0  
**Last Updated**: April 2026
5. Configure webhook URL (see webhook section below)

### 1.3 Update Environment Variables

For production, update `.env.production.local`:

```env
# Supabase (PRODUCTION)
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key

# Paystack (LIVE KEYS)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key

# App Configuration
NEXT_PUBLIC_API_URL=https://www.vaultdata.com
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=VAULT DATA
NEXT_PUBLIC_APP_URL=https://www.vaultdata.com

# Optional: Analytics & Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

## Phase 2: Deploy to Vercel

### 2.1 Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `vault-data` repository
5. Click "Import"

### 2.2 Configure Project

1. **Project Name**: vault-data
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next`
4. **Environment Variables**:
   - Add all variables from `.env.production.local`
   - Click "Add" for each variable

### 2.3 Deploy

1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. You'll get a deployment URL (e.g., `vault-data.vercel.app`)

### 2.4 Add Custom Domain

1. Go to "Settings" → "Domains"
2. Click "Add"
3. Enter your domain (e.g., `vaultdata.com`)
4. Add DNS records as instructed
5. Wait for DNS propagation (can take up to 48 hours)

## Phase 3: Setup & Test Production

### 3.1 Create Production Admin Account

1. Open your deployed app
2. Sign up with:
   - Email: admin@vaultdata.com
   - Password: Choose a strong password
3. In Supabase, update the user role to `admin`

### 3.2 Add Production Data

```sql
-- Create SIM sources for production
INSERT INTO sim_sources (network, source_type, identifier, balance, total_balance, status)
VALUES
  ('MTN', 'sim', '08123456789', 10000.00, 20000.00, 'active'),
  ('Airtel', 'sim', '08012345678', 10000.00, 20000.00, 'active'),
  ('Glo', 'sim', '08102345678', 10000.00, 20000.00, 'active'),
  ('9mobile', 'sim', '08115555555', 10000.00, 20000.00, 'active');

-- Add production data plans
INSERT INTO data_plans (network, package_type, name, amount, validity, is_active)
VALUES
  ('MTN', 'data', '100MB', 50, '2 hours', true),
  ('MTN', 'data', '200MB', 100, '7 days', true),
  ('MTN', 'data', '500MB', 200, '7 days', true),
  ('MTN', 'data', '1GB', 350, '7 days', true),
  ('MTN', 'data', '2GB', 650, '7 days', true),
  ('MTN', 'data', '5GB', 1500, '30 days', true);
  -- Repeat for other networks
```

### 3.3 Setup Paystack Webhooks

1. Go to Paystack Dashboard
2. Navigate to Settings → API Keys & Webhooks
3. In "Webhooks" section, add:
   - **URL**: `https://www.vaultdata.com/api/webhooks/paystack`
   - **Events**: Select "charge.success"
4. Copy webhook secret
5. Add to Vercel environment: `PAYSTACK_WEBHOOK_SECRET`

### 3.4 Test Production

1. Test user signup
2. Test wallet funding (use live Paystack - small amount recommended)
3. Test data/airtime purchase
4. Test admin dashboard
5. Monitor order processing

### 3.5 Setup Monitoring

1. **Vercel Analytics**:
   - Enable in Vercel dashboard
   - Monitor deployments and uptime

2. **Supabase Monitoring**:
   - Go to Supabase console
   - Check database performance
   - Review logs regularly

3. **(Optional) Sentry Error Tracking**:
   ```bash
   npm install @sentry/nextjs
   ```
   - Create Sentry project
   - Add `NEXT_PUBLIC_SENTRY_DSN` to environment

## Phase 4: Post-Deployment

### 4.1 SSL/TLS Certificate

- Vercel automatically provisions SSL certificate
- Certificate renews automatically
- HTTPS enabled by default

### 4.2 Database Backups

1. In Supabase Settings → Backups
2. Verify daily backups are running
3. Test restore procedures

### 4.3 Performance Optimization

1. Enable Vercel Edge Caching:
   - Go to Project Settings → Build & Development
   - Enable "Automatic Deployments"

2. Configure Cache:
   - In `/app/page.tsx` and other static pages:
   ```typescript
   export const revalidate = 3600; // Revalidate every hour
   ```

### 4.4 Email Notifications

1. Setup email service (e.g., SendGrid, Mailgun)
2. Add provider credentials to Supabase
3. Create email templates for:
   - Order confirmations
   - Wallet funding
   - Order updates

### 4.5 Analytics

1. Setup Google Analytics:
   ```bash
   npm install next-google-analytics
   ```
2. Add tracking ID to environment

## Phase 5: Maintenance & Monitoring

### 5.1 Regular Checks

Daily:
- Monitor Vercel dashboard for errors
- Check Supabase logs
- Review transaction volume

Weekly:
- Review user signups
- Analyze peak usage times
- Test payment processing

Monthly:
- Full system audit
- Database optimization
- Performance review

### 5.2 Auto-Deploy on GitHub Push

Vercel automatically deploys when you push to main:

```bash
git push origin main
# Vercel automatically picks up changes and deploys
```

### 5.3 Manual Rollback

If deployment fails:
1. Go to Vercel Dashboard
2. Click on previous deployment
3. Click "Promote to Production"

## Phase 6: Scaling Considerations

### Database Scaling

```sql
-- Monitor query performance
-- In Supabase: Go to Database → Monitor → Slow Queries

-- Add indexes for frequently queried fields
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at DESC);
```

### API Rate Limiting

Add to your API routes:

```typescript
// Add rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

export default limiter(handler);
```

### Increase Supabase Limits

For high traffic:
1. Upgrade Supabase plan
2. Increase Edge Functions
3. Configure connection pooling

## Phase 7: Disaster Recovery

### Backup Strategy

1. Daily Supabase backups (automatic)
2. Export database weekly:
   ```sql
   -- Supabase → Database → Backups → Download
   ```
3. Store backups in secure location

### Recovery Procedure

If disaster occurs:
1. Create new Supabase project
2. Restore from backup
3. Update connection strings
4. Redeploy to Vercel
5. Test thoroughly

## Admin Dashboard Access

After deployment:

1. **Admin Login**: https://www.vaultdata.com/login
2. **Admin Dashboard**: https://www.vaultdata.com/admin
3. **Manage Orders**: https://www.vaultdata.com/admin/orders
4. **Manage Users**: https://www.vaultdata.com/admin/users
5. **Manage SIMs**: https://www.vaultdata.com/admin/sims

## Troubleshooting Deployment

### Build Fails

```bash
# Check build logs in Vercel
# Common issues:
- Missing environment variables
- TypeScript errors
- Import errors
```

### Payment Not Working

1. Verify Paystack live keys
2. Check webhook URL
3. Test with small amount
4. Check Paystack logs

### Database Connection Issues

1. Check IP whitelist in Supabase
2. Verify connection string
3. Check database limits reached

## Monitoring URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Console**: https://app.supabase.com
- **Paystack Dashboard**: https://dashboard.paystack.com
- **App Home**: https://www.vaultdata.com
- **Admin Panel**: https://www.vaultdata.com/admin

## Cost Estimation (Monthly)

| Service | Free | Pro |
|---------|------|-----|
| Vercel | $0 | $20+ |
| Supabase | $0 | $25+ |
| Paystack | 1.5% | 1.5% |
| Domain | $10-15 | $10-15 |
| Email Service | - | $20+ |

## Next Steps

1. Monitor server health
2. Gather user feedback
3. Plan feature improvements
4. Schedule regular backups
5. Keep dependencies updated

## Support & Troubleshooting

- [Vercel Support](https://vercel.com/support)
- [Supabase Support](https://supabase.com/support)
- [Paystack Support](https://paystack.com/support)
- GitHub Issues: https://github.com/yourusername/vault-data/issues

---

🚀 Your VAULT DATA app is now live in production!
