import React from 'react';
import { Hero } from '@/components/home/Hero';
import { DLMMPoolsList } from '@/components/home/DLMMPoolsList';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <DLMMPoolsList />
    </div>
  );
}