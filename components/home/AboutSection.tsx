import React from 'react';
import { Button } from '@/components/common/UI';
import Link from 'next/link';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 px-4">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="section-title">About VAULT DATA</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              VAULT DATA is a leading Virtual Top-Up (VTU) service provider in Nigeria, dedicated to
              making digital services accessible and affordable for everyone. We provide instant,
              secure, and reliable access to data bundles, airtime, and digital services across all
              major networks.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">Trusted & Reliable</h4>
                  <p className="text-sm text-gray-600">
                    Serving over 100,000 satisfied customers with 99.9% uptime
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">Fast & Secure</h4>
                  <p className="text-sm text-gray-600">
                    State-of-the-art security with instant delivery of services
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">Customer First</h4>
                  <p className="text-sm text-gray-600">
                    24/7 support team ready to assist with any inquiries
                  </p>
                </div>
              </div>
            </div>

            <Link href="/signup">
              <Button variant="primary" size="lg">
                Start Using VAULT DATA
              </Button>
            </Link>
          </div>

          {/* Right side - Image/Visual */}
          <div className="relative">
            <div className="bg-gradient-primary rounded-lg p-8 text-white">
              <div className="space-y-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="font-bold">Wallet Balance</p>
                  <p className="text-2xl font-bold">₦0.00</p>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-gray-100 transition">
                    Buy Data
                  </button>
                  <button className="w-full bg-white bg-opacity-20 text-white font-bold py-3 rounded-lg hover:bg-opacity-30 transition">
                    Buy Airtime
                  </button>
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-sm">
                  <p className="font-bold mb-2">Recent Transactions</p>
                  <ul className="space-y-1 opacity-90">
                    <li>✓ 1.5GB Data - MTN</li>
                    <li>✓ ₦500 Airtime - Airtel</li>
                    <li>✓ Wallet Funded - ₦5000</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
