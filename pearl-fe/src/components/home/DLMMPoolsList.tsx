'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';
import { MOCK_POOLS } from '@/lib/constants';

export const DLMMPoolsList: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured DLMM Pools
          </h2>
          <p className="text-gray-600">
            High-yield liquidity pools with dynamic market making
          </p>
        </div>
        <Link href="/pool">
          <Button variant="outline" className="flex items-center space-x-2">
            <span>View All Pools</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_POOLS.map((pool) => (
          <Link key={pool.id} href={`/add-liquidity/${pool.id}`}>
            <Card hover className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {pool.token0.charAt(0)}
                    </div>
                    <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {pool.token1.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{pool.name}</h3>
                    <p className="text-sm text-gray-500">DLMM Pool</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  pool.apr > 15 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {pool.apr > 15 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{formatPercentage(pool.apr)} APR</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">TVL</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(pool.tvl)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">24h Volume</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(pool.volume24h)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">24h Fees</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(pool.fees24h)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    ${formatNumber(pool.priceRange.min)} - ${formatNumber(pool.priceRange.max)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full">Add Liquidity</Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};