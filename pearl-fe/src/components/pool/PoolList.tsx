'use client';

import React, { useState, useMemo } from 'react';
import PoolListItem from './PoolListItem';

export const PoolList: React.FC = () => {

  const pools = [
    { name: 'ETH/USDC', token1: 'ETH', token2: 'USDC', tvl: '$12.5M', apr: '15.4%', volume: '$2.1M' },
    { name: 'BTC/USDT', token1: 'BTC', token2: 'USDT', tvl: '$8.9M', apr: '12.8%', volume: '$1.8M' },
    { name: 'SOL/USDC', token1: 'SOL', token2: 'USDC', tvl: '$5.6M', apr: '18.2%', volume: '$950K' },      { name: 'LINK/ETH', token1: 'LINK', token2: 'ETH', tvl: '$3.2M', apr: '22.1%', volume: '$680K' },
    { name: 'UNI/USDC', token1: 'UNI', token2: 'USDC', tvl: '$2.8M', apr: '19.5%', volume: '$520K' },
    { name: 'MATIC/ETH', token1: 'MATIC', token2: 'ETH', tvl: '$1.9M', apr: '25.3%', volume: '$430K' },
  ]

  return (
    <div className="space-y-6">
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pools List Container */}
          <div className="
            rounded-2xl bg-white/10 backdrop-blur-md 
            shadow-xl ring-1 ring-white/20
            overflow-hidden
          ">
            {/* Table Header */}
            <div className="
              bg-white/5 backdrop-blur-sm border-b border-white/10
              px-6 py-4
            ">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <div className="text-white/90 font-medium text-sm">Pool</div>
                <div className="hidden md:block text-white/90 text-right font-medium text-sm">TVL</div>
                <div className="hidden md:block text-white/90 text-right font-medium text-sm">APR</div>
                <div className="hidden md:block text-white/90 text-right font-medium text-sm">24h Volume</div>
                {/* <div className="text-white/90 font-medium text-sm text-right">Action</div> */}
              </div>
            </div>
            
            {/* Pools List */}
            <div className="divide-y divide-white/10">
              {pools.map((pool, index) => (
                <PoolListItem key={index} {...pool} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};