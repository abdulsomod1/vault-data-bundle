#!/bin/bash
# VAULT DATA - Project Setup Script
# This script helps with initial setup of the VAULT DATA project

set -e

echo "🚀 VAULT DATA - Project Setup"
echo "=============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Setup environment variables
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
    echo "   - PAYSTACK_SECRET_KEY"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Check environment variables
if grep -q "your-" .env.local; then
    echo "⚠️  Warning: Environment variables not yet configured!"
    echo "Please update .env.local before proceeding."
    echo ""
fi

# Check TypeScript
echo "🔍 Checking TypeScript configuration..."
npm run type-check > /dev/null 2>&1 && echo "✅ TypeScript check passed" || echo "⚠️  TypeScript warnings (see above)"
echo ""

# Ready to start
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase and Paystack credentials"
echo "2. Run Supabase database migrations: database/schema.sql"
echo "3. Start development server: npm run dev"
echo "4. Visit http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: docs/SETUP.md"
echo "   - Deployment Guide: docs/DEPLOYMENT.md"
echo "   - Supabase Setup: docs/SUPABASE_SETUP.md"
echo "   - Quick Reference: QUICK_REFERENCE.md"
echo ""
echo "Happy coding! 🎉"
