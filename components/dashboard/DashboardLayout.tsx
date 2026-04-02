'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { User } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: User | null;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  const menuItems = isAdmin
    ? [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/orders', label: 'Orders', icon: '📦' },
        { href: '/admin/users', label: 'Users', icon: '👥' },
        { href: '/admin/sims', label: 'SIMs', icon: '📱' },
        { href: '/admin/data-plans', label: 'Data Plans', icon: '💾' },
        { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
      ]
    : [
        { href: '/dashboard', label: 'Home', icon: '🏠' },
        { href: '/dashboard/buy', label: 'Buy Data/Airtime', icon: '💳' },
        { href: '/dashboard/wallet', label: 'Wallet', icon: '💰' },
        { href: '/dashboard/orders', label: 'Orders', icon: '📦' },
        { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
      ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-40 h-full flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="font-bold text-lg">VAULT DATA</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold">
              {(user?.full_name || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0">
          <div className="flex justify-between items-center p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gray-800 flex-1">
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </h1>
            <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-sm">
              {(user?.full_name || 'U')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};
