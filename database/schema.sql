-- =============================================
-- VAULT DATA - Supabase Schema
-- Production-ready PostgreSQL Database
--
-- SETUP INSTRUCTIONS:
-- 1. Enable Authentication in Supabase Dashboard (Settings > Authentication)
-- 2. Run this entire script in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- AUTHENTICATION & USER ROLES
-- =============================================

-- Create ENUM for user roles (if not exists)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create ENUM for order status
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create ENUM for transaction type
DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create ENUM for transaction status
DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('completed', 'pending', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create ENUM for data network
DO $$ BEGIN
  CREATE TYPE data_network AS ENUM ('mtn', 'airtel', 'glo', 'nine_mobile');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- USERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  wallet_balance DECIMAL(15, 2) DEFAULT 0.00,
  total_spent DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- WALLET & TRANSACTIONS
-- =============================================

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  total_funded DECIMAL(15, 2) DEFAULT 0.00,
  total_spent DECIMAL(15, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  currency TEXT DEFAULT 'NGN'
);

-- Create transactions table (single, clean definition)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  balance_before DECIMAL(15, 2),
  balance_after DECIMAL(15, 2),
  status transaction_status DEFAULT 'completed',
  reference VARCHAR(255) UNIQUE,
  description TEXT,
  payment_method VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- DATA PLANS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS data_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  network TEXT NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('data', 'airtime')),
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  validity TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SIM/DATA SOURCES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS sim_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  network TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('sim', 'sme_data', 'vtu_api')),
  identifier TEXT NOT NULL,
  balance DECIMAL(12, 2) NOT NULL,
  total_balance DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'depleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  network TEXT NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('data', 'airtime')),
  amount DECIMAL(10, 2) NOT NULL,
  phone_number TEXT NOT NULL,
  quantity INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transaction_id TEXT,
  reference TEXT UNIQUE,
  sim_id UUID REFERENCES sim_sources(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_network ON orders(network);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_sim_sources_network ON sim_sources(network);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE sim_sources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop all policies from all tables
  DROP POLICY IF EXISTS "Users can view own data" ON users;
  DROP POLICY IF EXISTS "Users can view own wallet" ON wallets;
  DROP POLICY IF EXISTS "Users can update own wallet" ON wallets;
  DROP POLICY IF EXISTS "Users can view own orders" ON orders;
  DROP POLICY IF EXISTS "Users can create orders" ON orders;
  DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
  DROP POLICY IF EXISTS "Admin can update orders" ON orders;
  DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
  DROP POLICY IF EXISTS "Admin can view all transactions" ON transactions;
  DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
  DROP POLICY IF EXISTS "Admin can view all data" ON orders;
  DROP POLICY IF EXISTS "Public can view data plans" ON data_plans;
  DROP POLICY IF EXISTS "Admin can manage data plans" ON data_plans;
  DROP POLICY IF EXISTS "Admin can manage SIM sources" ON sim_sources;
  DROP POLICY IF EXISTS "Public can view data plans" ON data_plans;
EXCEPTION WHEN others THEN NULL;
END $$;

-- RLS Policies - Users
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id OR (auth.jwt() ->> 'user_role')::user_role = 'admin');

-- RLS Policies - Wallets
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies - Orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  USING ((auth.jwt() ->> 'user_role')::user_role = 'admin');

CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  USING ((auth.jwt() ->> 'user_role')::user_role = 'admin');

-- RLS Policies - Transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all transactions"
  ON transactions FOR SELECT
  USING ((auth.jwt() ->> 'user_role')::user_role = 'admin');

-- RLS Policies - Notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies - Data Plans
CREATE POLICY "Public can view data plans"
  ON data_plans FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admin can manage data plans"
  ON data_plans FOR ALL
  USING ((auth.jwt() ->> 'user_role')::user_role = 'admin');

-- RLS Policies - SIM Sources
CREATE POLICY "Admin can manage SIM sources"
  ON sim_sources FOR ALL
  USING ((auth.jwt() ->> 'user_role')::user_role = 'admin');

-- =============================================
-- SEED DATA (Optional - for testing)
-- =============================================

-- Insert sample data plans (with error handling)
DO $$ 
BEGIN
  INSERT INTO data_plans (network, package_type, name, amount, validity, description, is_active)
  VALUES 
    ('mtn', 'data', 'MTN 500MB', 100.00, '30 days', 'MTN 500MB data', TRUE),
    ('mtn', 'data', 'MTN 1GB', 200.00, '30 days', 'MTN 1GB data', TRUE),
    ('mtn', 'data', 'MTN 2GB', 400.00, '30 days', 'MTN 2GB data', TRUE),
    ('airtel', 'data', 'Airtel 500MB', 100.00, '30 days', 'Airtel 500MB data', TRUE),
    ('airtel', 'data', 'Airtel 1GB', 200.00, '30 days', 'Airtel 1GB data', TRUE),
    ('glo', 'data', 'Glo 500MB', 100.00, '30 days', 'Glo 500MB data', TRUE),
    ('glo', 'data', 'Glo 1GB', 200.00, '30 days', 'Glo 1GB data', TRUE),
    ('nine_mobile', 'data', '9mobile 500MB', 100.00, '30 days', '9mobile 500MB data', TRUE),
    ('nine_mobile', 'data', '9mobile 1GB', 200.00, '30 days', '9mobile 1GB data', TRUE),
    ('mtn', 'airtime', 'MTN Airtime 500', 500.00, 'No expiry', 'MTN Airtime 500', TRUE),
    ('mtn', 'airtime', 'MTN Airtime 1000', 1000.00, 'No expiry', 'MTN Airtime 1000', TRUE),
    ('airtel', 'airtime', 'Airtel Airtime 500', 500.00, 'No expiry', 'Airtel Airtime 500', TRUE),
    ('airtel', 'airtime', 'Airtel Airtime 1000', 1000.00, 'No expiry', 'Airtel Airtime 1000', TRUE),
    ('glo', 'airtime', 'Glo Airtime 500', 500.00, 'No expiry', 'Glo Airtime 500', TRUE),
    ('glo', 'airtime', 'Glo Airtime 1000', 1000.00, 'No expiry', 'Glo Airtime 1000', TRUE),
    ('nine_mobile', 'airtime', '9mobile Airtime 500', 500.00, 'No expiry', '9mobile Airtime 500', TRUE),
    ('nine_mobile', 'airtime', '9mobile Airtime 1000', 1000.00, 'No expiry', '9mobile Airtime 1000', TRUE)
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Seed data insertion skipped or already exists';
END $$;

-- =============================================
-- END OF SCHEMA
-- =============================================
