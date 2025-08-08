'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
}

interface BalanceCardProps {
  token0: TokenBalance;
  token1: TokenBalance;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ token0, token1 }) => {
  const totalBalance = token0.usdValue + token1.usdValue;

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Wallet className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">My Balance</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {token0.symbol.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{token0.symbol}</div>
              <div className="text-sm text-gray-500">{formatCurrency(token0.usdValue)}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              {token0.balance.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {token1.symbol.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{token1.symbol}</div>
              <div className="text-sm text-gray-500">{formatCurrency(token1.usdValue)}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              {token1.balance.toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total Balance</span>
            <span className="font-bold text-xl text-gray-900">
              {formatCurrency(totalBalance)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
