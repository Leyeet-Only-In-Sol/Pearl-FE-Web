'use client';

import React, { useState } from 'react';
import { Plus, Minus, Settings, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface DepositWithdrawCardProps {
  token0Symbol: string;
  token1Symbol: string;
  onDeposit: (amount0: number, amount1: number) => void;
  onWithdraw: (amount0: number, amount1: number) => void;
}

export const DepositWithdrawCard: React.FC<DepositWithdrawCardProps> = ({
  token0Symbol,
  token1Symbol,
  onDeposit,
  onWithdraw,
}) => {
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount0, setAmount0] = useState<string>('');
  const [amount1, setAmount1] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);

  const handleSubmit = () => {
    const amt0 = parseFloat(amount0) || 0;
    const amt1 = parseFloat(amount1) || 0;
    
    if (mode === 'deposit') {
      onDeposit(amt0, amt1);
    } else {
      onWithdraw(amt0, amt1);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMode('deposit')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'deposit'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Deposit
          </button>
          <button
            onClick={() => setMode('withdraw')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'withdraw'
                ? 'bg-red-100 text-red-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Minus className="w-4 h-4 mr-2 inline" />
            Withdraw
          </button>
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              {token0Symbol} Amount
            </label>
            <span className="text-sm text-gray-500">Balance: 2.5 {token0Symbol}</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount0}
              onChange={(e) => setAmount0(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.0"
            />
            <div className="absolute right-3 top-3 flex items-center space-x-2">
              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                MAX
              </button>
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {token0Symbol.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              {token1Symbol} Amount
            </label>
            <span className="text-sm text-gray-500">Balance: 5,000 {token1Symbol}</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.0"
            />
            <div className="absolute right-3 top-3 flex items-center space-x-2">
              <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                MAX
              </button>
              <div className="w-6 h-6 bg-secondary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {token1Symbol.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Estimated APR</span>
          <span className="text-sm font-semibold text-green-600">15.4%</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Slippage Tolerance</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSlippage(0.1)}
              className={`px-2 py-1 text-xs rounded ${
                slippage === 0.1 ? 'bg-primary-100 text-primary-600' : 'bg-white text-gray-600'
              }`}
            >
              0.1%
            </button>
            <button
              onClick={() => setSlippage(0.5)}
              className={`px-2 py-1 text-xs rounded ${
                slippage === 0.5 ? 'bg-primary-100 text-primary-600' : 'bg-white text-gray-600'
              }`}
            >
              0.5%
            </button>
            <button
              onClick={() => setSlippage(1.0)}
              className={`px-2 py-1 text-xs rounded ${
                slippage === 1.0 ? 'bg-primary-100 text-primary-600' : 'bg-white text-gray-600'
              }`}
            >
              1.0%
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Network Fee</span>
          <span className="text-sm text-gray-900">~$2.50</span>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className={`w-full ${
          mode === 'withdraw' 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
        disabled={!amount0 && !amount1}
      >
        {mode === 'deposit' ? 'Add Liquidity' : 'Remove Liquidity'}
      </Button>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start space-x-2">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          {mode === 'deposit' 
            ? 'By adding liquidity you\'ll earn fees from all trades on this pair proportional to your share of the pool.'
            : 'Removing liquidity will withdraw your tokens plus any earned fees from the pool.'
          }
        </p>
      </div>
    </Card>
  );
};