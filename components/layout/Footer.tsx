import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
                V
              </div>
              <span>VAULT DATA</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Professional VTU and data services for all your connectivity needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-primary transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Email: support@vaultdata.com</p>
              <p>Phone: +234 800 000 0000</p>
              <p>Office: Lagos, Nigeria</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-primary transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 002.856-3.915 9.964 9.964 0 01-2.865.74 4.482 4.482 0 001.964-2.475c-.951.564-2.005.974-3.127 1.195a4.466 4.466 0 00-7.606 4.06A12.713 12.713 0 011.064 3.51a4.467 4.467 0 001.386 5.963 4.456 4.456 0 01-2.025-.556v.057a4.465 4.465 0 003.584 4.372 4.466 4.466 0 01-2.022.085 4.467 4.467 0 004.167 3.1A8.954 8.954 0 010 19.54a12.978 12.978 0 007.072 2.07c8.496 0 13.108-7.04 13.108-13.106 0-.2-.005-.4-.015-.599a9.33 9.33 0 002.3-2.434z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-400">
            <p>&copy; {currentYear} VAULT DATA. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
