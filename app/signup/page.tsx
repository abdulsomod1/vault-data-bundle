'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Input, Button, Alert, Loader } from '@/components/common/UI';
import { authService } from '@/lib/auth';
import { validateEmail, validatePassword, validatePhoneNumber } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.fullName.trim()) {
        throw new Error('Full name is required');
      }

      if (!validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (formData.phone && !validatePhoneNumber(formData.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      if (!validatePassword(formData.password)) {
        throw new Error(
          'Password must be at least 8 characters with 1 uppercase letter and 1 number'
        );
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Sign up
      const result = await authService.signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (result?.user) {
        // Store auth token
        if (result.session) {
          localStorage.setItem('auth_token', result.session.access_token);
        }
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
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
              <h1 className="text-2xl font-bold text-gray-900">Get Started</h1>
              <p className="text-gray-600 text-sm mt-2">Create your VAULT DATA account today</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+234 800 0000 000"
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
                <p className="text-xs text-gray-500 mt-1">
                  At least 8 characters, 1 uppercase, 1 number
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="input w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
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
                {loading ? <Loader size="sm" /> : 'Create Account'}
              </Button>
            </form>

            {/* Terms & Conditions */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
