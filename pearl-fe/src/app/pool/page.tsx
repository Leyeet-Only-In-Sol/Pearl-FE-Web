import React from 'react';
import { PoolCarousel } from '@/components/pool/PoolCarousel';
import { PoolList } from '@/components/pool/PoolList';

export default function PoolPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Liquidity Pools
        </h1>
        <p className="text-gray-600">
          Discover high-yield DLMM pools and start earning rewards
        </p>
      </div>
      
      <PoolCarousel />
      <PoolList />
    </div>
  );
}