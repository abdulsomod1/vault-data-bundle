import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common/UI';

export const CTASection: React.FC = () => {
  return (
    <section className="bg-gradient-primary text-white py-16 px-4">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users who trust VAULT DATA for their VTU needs. 
          Sign up now and get instant access to all our services.
        </p>

        <Link href="/signup">
          <Button
            variant="success"
            size="lg"
            className="inline-block"
          >
            Create Your Account
          </Button>
        </Link>

        <p className="text-sm text-gray-200 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-300 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
};
