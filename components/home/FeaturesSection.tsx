import React from 'react';
import { Card } from '@/components/common/UI';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '📱',
    title: 'Easy Data Purchase',
    description:
      'Buy data bundles for MTN, Airtel, Glo, and 9mobile with just a few taps. Instant delivery guaranteed.',
  },
  {
    icon: '📞',
    title: 'Quick Airtime Top-up',
    description:
      'Recharge any network instantly with flexible amounts. No hidden charges, transparent pricing.',
  },
  {
    icon: '💳',
    title: 'Secure Wallet',
    description:
      'Fund your wallet with Paystack or Flutterwave. Track all transactions with complete history.',
  },
  {
    icon: '⚡',
    title: 'Instant Delivery',
    description:
      'Get your services activated immediately. No waiting, no delays, guaranteed reliability.',
  },
  {
    icon: '💰',
    title: 'Best Rates',
    description:
      'Competitive pricing in the market. Get more value for your money every single time.',
  },
  {
    icon: '🔒',
    title: 'Secure & Safe',
    description:
      'Military-grade encryption protects your data. Your information is 100% secure with us.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 px-4 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Why Choose VAULT DATA?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Experience the best VTU services with our modern, user-friendly platform designed
            specifically for your needs.
          </p>
        </div>

        <div className="grid-responsive">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-glow transition-all duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
