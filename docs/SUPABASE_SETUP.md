# VAULT DATA - Supabase Setup Guide

Complete guide to configuring Supabase for VAULT DATA.

## 🚀 Initial Setup

### 1. Create Supabase Project

1. Go to [Supabase.com](https://supabase.com)
2. Click "Create new project"
3. Fill in project details:
   - **Name**: vault-data-prod (or dev)
   - **Database Password**: Create strong password
   - **Region**: Choose closest to target users
   - **Pricing Plan**: Free tier or Pro for production

4. Click "Create new project"
5. Wait for project to initialize (2-3 minutes)

### 2. Get Credentials

After project creation, go to **Settings → API**

Copy these values to `.env.local`:

```env
# From "Project URL"
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# From "Anon public key"
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx_your_anon_key_xxxxx

# From "Service role key" (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=xxxxx_your_service_role_key_xxxxx
```

## 📊 Database Setup

### 1. Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `database/schema.sql`
4. Paste into the query editor
5. Click "Run"

This creates all required tables with proper relationships and Row Level Security.

### 2. Verify Tables Were Created

Run this query in SQL Editor:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Should see all 9 main tables created.

3. Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 2. Database Setup

### Step 1: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy entire contents of `database/schema.sql`
4. Paste into the editor
5. Click "Run"
6. Wait for success confirmation

### Step 2: Verify Tables

After schema creation, verify all tables exist:

```sql
-- Check all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Expected tables:
- users
- wallets
- orders
- transactions
- data_plans
- sim_sources
- notifications

### Step 3: Row Level Security (RLS)

All tables should have RLS enabled:

1. Go to **Auth** → **Policies**
2. Verify RLS is enabled for each table
3. Check policies are correctly configured

## 3. Authentication Setup

### Step 1: Configure Auth Providers

1. Go to **Auth** → **Providers**
2. Enable **Email Provider** (default):
   - Keep enabled for email/password auth
   - Enable "Confirm email" for security

3. (Optional) Enable social providers:
   - Google OAuth
   - GitHub OAuth
   - etc.

### Step 2: Email Configuration

1. Go to **Auth** → **Email Templates**
2. Customize templates for:
   - Confirmation email
   - Password reset
   - Invite email

### Step 3: Create Test Users

For development, create test accounts:

```sql
-- Via SQL Editor (if needed)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('test@example.com', crypt('password123', gen_salt('bf')), now());
```

Or use the signup page at `http://localhost:3000/signup`

## 4. Database Tables Reference

### users
```sql
id            UUID (primary key)
email         TEXT (unique)
full_name     TEXT
phone         TEXT
role          TEXT ('user' | 'admin')
avatar_url    TEXT
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

### wallets
```sql
id            UUID (primary key)
user_id       UUID (foreign key)
balance       DECIMAL(12, 2)
currency      TEXT ('NGN')
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

### orders
```sql
id              UUID (primary key)
user_id         UUID (foreign key)
network         TEXT ('MTN' | 'Airtel' | 'Glo' | '9mobile')
package_type    TEXT ('data' | 'airtime')
amount          DECIMAL(10, 2)
phone_number    TEXT
quantity        INTEGER
status          TEXT ('pending'|'processing'|'completed'|'failed')
transaction_id  TEXT
reference       TEXT (unique)
sim_id          UUID (foreign key)
notes           TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### transactions
```sql
id              UUID (primary key)
user_id         UUID (foreign key)
type            TEXT ('credit' | 'debit')
amount          DECIMAL(12, 2)
balance_before  DECIMAL(12, 2)
balance_after   DECIMAL(12, 2)
reference       TEXT (unique)
description     TEXT
status          TEXT ('completed'|'pending'|'failed')
created_at      TIMESTAMP
```

### data_plans
```sql
id              UUID (primary key)
network         TEXT
package_type    TEXT ('data' | 'airtime')
name            TEXT
amount          DECIMAL(10, 2)
validity        TEXT
description     TEXT
is_active       BOOLEAN
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### sim_sources
```sql
id              UUID (primary key)
network         TEXT
source_type     TEXT ('sim'|'sme_data'|'vtu_api')
identifier      TEXT
balance         DECIMAL(12, 2)
total_balance   DECIMAL(12, 2)
status          TEXT ('active'|'inactive'|'depleted')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### notifications
```sql
id              UUID (primary key)
user_id         UUID (foreign key)
title           TEXT
message         TEXT
type            TEXT
read            BOOLEAN
created_at      TIMESTAMP
```

## 5. Row Level Security Policies

### Users Table

```sql
-- Users can view own data
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Admins can view all
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
```

### Wallets Table

```sql
-- Users can view own wallet
CREATE POLICY "Users can view own wallet"
ON wallets FOR SELECT
USING (user_id = auth.uid());
```

### Orders Table

```sql
-- Users can view own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (user_id = auth.uid());

-- Users can create orders
CREATE POLICY "Users can create orders"
ON orders FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
```

## 6. Database Backups

### Automatic Backups

1. Go to **Settings** → **Backups**
2. Enable Daily backups
3. Set retention to 30 days minimum

### Manual Backup

```sql
-- In Supabase SQL Editor
-- Backups are handled by Supabase automatically
-- Go to Settings → Backups to manage
```

### Restore Backup

1. Go to **Settings** → **Backups**
2. Find backup date
3. Click "Restore"
4. Confirm restoration

## 7. Performance Optimization

### Add Indexes

```sql
-- Most important indexes for VAULT DATA
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_network ON orders(network);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_sim_sources_network ON sim_sources(network);
```

### Query Monitoring

1. Go to **Database** → **Monitor**
2. Check "Slow Queries"
3. Optimize queries if necessary

## 8. Environment Variables

### Development

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev_anon_key
SUPABASE_SERVICE_ROLE_KEY=dev_service_role_key
```

### Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_role_key
```

## 9. Common Operations

### Insert Test Data

```sql
-- Create test user wallet
INSERT INTO wallets (user_id, balance, currency)
VALUES ('user_uuid_here', 50000, 'NGN');

-- Add test data plans
INSERT INTO data_plans (network, package_type, name, amount, validity, is_active)
VALUES 
  ('MTN', 'data', '100MB', 50, '2 hours', true),
  ('MTN', 'data', '1GB', 350, '7 days', true);

-- Add test SIM
INSERT INTO sim_sources (network, source_type, identifier, balance, total_balance, status)
VALUES ('MTN', 'sim', '08123456789', 1000, 5000, 'active');
```

### Query User Orders

```sql
SELECT * FROM orders WHERE user_id = 'user_uuid' ORDER BY created_at DESC;
```

### Get Transaction History

```sql
SELECT * FROM transactions WHERE user_id = 'user_uuid' ORDER BY created_at DESC LIMIT 10;
```

### Calculate Daily Revenue

```sql
SELECT 
  DATE(created_at) as date,
  SUM(amount) as revenue,
  COUNT(*) as transactions
FROM transactions
WHERE type = 'debit' AND status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 10. Troubleshooting

### Connection Issues

Check:
- Project is "Running" (not paused)
- URL is correct
- API keys are correct
- Network allows Supabase connection

### RLS Policy Errors

If getting permission denied:
1. Check RLS is enabled
2. Review policies
3. Verify user has correct role
4. Check auth token is valid

### Query Performance

If queries are slow:
1. Add missing indexes
2. Optimize queries
3. Check table row count
4. Review explain plans

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

---

✅ Supabase is now configured and ready for VAULT DATA!
