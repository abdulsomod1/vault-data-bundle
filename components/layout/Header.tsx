'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { User } from '@/types';
import { Button } from '@/components/common/UI';

export const Header: React.FC<{ user?: User | null }> = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user || null);

  useEffect(() => {
    if (!currentUser) {
      authService.getCurrentUser().then(setCurrentUser).catch(() => {});
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="font-bold text-lg hidden sm:inline">VAULT DATA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-primary transition">
            Home
          </Link>
          {currentUser ? (
            <>
              {currentUser.role === 'admin' && (
                <Link href="/admin" className="text-gray-600 hover:text-primary transition">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="text-gray-600 hover:text-primary transition">
                Dashboard
              </Link>
            </>
          ) : (
            <Link href="/features" className="text-gray-600 hover:text-primary transition">
              Features
            </Link>
          )}
          <Link href="/#about" className="text-gray-600 hover:text-primary transition">
            About
          </Link>
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{currentUser.full_name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold">
                  {(currentUser.full_name || 'U')[0].toUpperCase()}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block py-2">
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t py-4">
          <div className="container-custom flex flex-col gap-4">
            <Link href="/" className="text-gray-600 hover:text-primary transition">
              Home
            </Link>
            {currentUser?.role === 'admin' && (
              <Link href="/admin" className="text-gray-600 hover:text-primary transition">
                Admin
              </Link>
            )}
            <Link href="/features" className="text-gray-600 hover:text-primary transition">
              {currentUser ? 'Dashboard' : 'Features'}
            </Link>
            <Link href="/#about" className="text-gray-600 hover:text-primary transition">
              About
            </Link>
            {!currentUser && (
              <>
                <Link href="/login" className="text-primary font-medium">
                  Login
                </Link>
                <Link href="/signup" className="text-primary font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
