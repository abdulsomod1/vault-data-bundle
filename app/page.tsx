'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { AboutSection } from '@/components/home/AboutSection';
import { CTASection } from '@/components/home/CTASection';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <CTASection />
    </Layout>
  );
}
