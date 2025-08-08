'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LiquidityGraph } from '@/components/add-liquidity/LiquidityGraph';
import { BalanceCard } from '@/components/add-liquidity/BalanceCard';
import { DepositWithdrawCard } from '@/components/add-liquidity/DepositWithdrawCard';
import { StrategiesSection } from '@/components/add-liquidity/StrategiesSection';
import { MOCK_POOLS } from '@/lib/constants';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function AddLiquidityPage() {
  const params = useParams();
  const router = useRouter();
  const poolId = params.poolId as string;
  
  const [selectedStrategy, setSelectedStrategy] = useState<string>('balanced');
  
  const pool = MOCK_POOLS.find(p => p.id === poolId);

  if (!pool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pool not found</h1>
          <Button onClick={() => router.push('/pool')}>
            Return to Pools
          </Button>
        </div>
      </div>
    );
  }

  const mockBalances = {
    token0: {
      symbol: pool.token0,
      balance: pool.token0 === 'ETH' ? 2.5 : pool.token0 === 'BTC' ? 0.8 : 45.2,
      usdValue: pool.token0 === 'ETH' ? 5000 : pool.token0 === 'BTC' ? 35000 : 2000,
    },
    token1: {
      symbol: pool.token1,
      balance: 5000,
      usdValue: 5000,
    },
  };

  const handleDeposit = (amount0: number, amount1: number) => {
    console.log('Depositing:', { amount0, amount1, strategy: selectedStrategy });
    // Handle deposit logic here
  };

  const handleWithdraw = (amount0: number, amount1: number) => {
    console.log('Withdrawing:', { amount0, amount1, strategy: selectedStrategy });
    // Handle withdraw logic here
  };

  const handleStrategySelect = (strategy: any) => {
    setSelectedStrategy(strategy.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {pool.token0.charAt(0)}
              </div>
              <div className="w-10 h-10 bg-secondary-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white">
                {pool.token1.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pool.name}</h1>
              <p className="text-gray-600">DLMM Liquidity Pool</p>
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="flex items-center space-x-2">
          <ExternalLink className="w-4 h-4" />
          <span>View on Explorer</span>
        </Button>
      </div>

      {/* Pool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Total Value Locked</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(pool.tvl)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">APR</div>
          <div className="text-xl font-bold text-green-600">
            {formatPercentage(pool.apr)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">24h Volume</div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(pool.volume24h)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">24h Fees</div>
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(pool.fees24h)}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Liquidity Graph */}
        <div className="lg:col-span-2 space-y-6">
          <LiquidityGraph
            minPrice={pool.priceRange.min}
            maxPrice={pool.priceRange.max}
            currentPrice={(pool.priceRange.min + pool.priceRange.max) / 2}
          />
          
          <StrategiesSection
            onSelectStrategy={handleStrategySelect}
            selectedStrategy={selectedStrategy}
          />
        </div>

        {/* Right Column - Balance and Deposit/Withdraw */}
        <div className="space-y-6">
          <BalanceCard
            token0={mockBalances.token0}
            token1={mockBalances.token1}
          />
          
          <DepositWithdrawCard
            token0Symbol={pool.token0}
            token1Symbol={pool.token1}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
          />
        </div>
      </div>
    </div>
  );
}
