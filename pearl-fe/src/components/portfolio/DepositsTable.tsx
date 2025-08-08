'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Plus, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface PortfolioPool {
  poolId: string;
  poolName: string;
  deposited: number;
  currentValue: number;
  fees: number;
  tvl: number;
  apr: number;
  feeTvlRatio: number;
  token0: string;
  token1: string;
}

const MOCK_PORTFOLIO_POOLS: PortfolioPool[] = [
  {
    poolId: '1',
    poolName: 'ETH/USDC',
    deposited: 15000,
    currentValue: 15750,
    fees: 450.25,
    tvl: 12500000,
    apr: 15.4,
    feeTvlRatio: 0.068,
    token0: 'ETH',
    token1: 'USDC',
  },
  {
    poolId: '2',
    poolName: 'BTC/USDT',
    deposited: 20000,
    currentValue: 21200,
    fees: 650.50,
    tvl: 8900000,
    apr: 12.8,
    feeTvlRatio: 0.081,
    token0: 'BTC',
    token1: 'USDT',
  },
  {
    poolId: '3',
    poolName: 'SOL/USDC',
    deposited: 7000,
    currentValue: 7280,
    fees: 150.00,
    tvl: 5600000,
    apr: 18.2,
    feeTvlRatio: 0.073,
    token0: 'SOL',
    token1: 'USDC',
  },
];

export const DepositsTable: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Your Deposits</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pool
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deposited
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees Earned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                APR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee/TVL
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_PORTFOLIO_POOLS.map((pool) => {
              const pnl = pool.currentValue - pool.deposited;
              const pnlPercentage = (pnl / pool.deposited) * 100;
              
              return (
                <tr key={pool.poolId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {pool.token0.charAt(0)}
                        </div>
                        <div className="w-6 h-6 bg-secondary-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                          {pool.token1.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {pool.poolName}
                        </div>
                        <div className="text-sm text-gray-500">DLMM Pool</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(pool.deposited)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(pool.currentValue)}
                    </div>
                    <div className={`text-xs ${
                      pnl > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pnl > 0 ? '+' : ''}{formatCurrency(pnl)} ({formatPercentage(pnlPercentage)})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(pool.fees)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPercentage(pool.apr)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPercentage(pool.feeTvlRatio)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <Button size="sm" variant="outline">
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                    <Button size="sm" variant="outline">
                      <Minus className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                    <Link href={`/add-liquidity/${pool.poolId}`}>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};