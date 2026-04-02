import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/UI';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-primary text-white py-20 px-4">
      <div className="container-custom text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
          Welcome to <span className="text-yellow-300">VAULT DATA</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto animate-slide-up">
          Fast, reliable, and affordable VTU services. Buy data, airtime, and manage your wallet with
          ease. Experience seamless connectivity at your fingertips.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/signup">
            <Button variant="success" size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6">
            <div className="text-3xl font-bold">100k+</div>
            <div className="text-sm opacity-90">Happy Users</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6">
            <div className="text-3xl font-bold">₦500M+</div>
            <div className="text-sm opacity-90">Transactions</div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm opacity-90">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};
