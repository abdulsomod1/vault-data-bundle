'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Input, Button, Alert, Loader } from '@/components/common/UI';
import { authService } from '@/lib/auth';
import { validateEmail, validatePassword } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!formData.password) {
        throw new Error('Password is required');
      }

      const result = await authService.signIn(formData.email, formData.password);

      if (result?.session) {
        // Store auth token
        localStorage.setItem('auth_token', result.session.access_token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                V
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-600 text-sm mt-2">Sign in to your VAULT DATA account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
              />

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="input w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? <Loader size="sm" /> : 'Sign In'}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-6">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:font-semibold transition"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </section>
    </Layout>
  );
}
