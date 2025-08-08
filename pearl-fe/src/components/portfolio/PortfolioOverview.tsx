'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface OverviewStats {
  totalValue: number;
  totalFees: number;
  totalDeposits: number;
  avgAPR: number;
  change24h: number;
}

const MOCK_OVERVIEW: OverviewStats = {
  totalValue: 45230.50,
  totalFees: 1250.75,
  totalDeposits: 42000.00,
  avgAPR: 16.8,
  change24h: 2.4,
};

export const PortfolioOverview: React.FC = () => {
  const stats = [
    {
      label: 'Total Portfolio Value',
      value: formatCurrency(MOCK_OVERVIEW.totalValue),
      icon: DollarSign,
      change: MOCK_OVERVIEW.change24h,
    },
    {
      label: 'Total Fees Earned',
      value: formatCurrency(MOCK_OVERVIEW.totalFees),
      icon: TrendingUp,
      subtitle: 'All time',
    },
    {
      label: 'Total Deposits',
      value: formatCurrency(MOCK_OVERVIEW.totalDeposits),
      icon: DollarSign,
      subtitle: 'Principal amount',
    },
    {
      label: 'Average APR',
      value: formatPercentage(MOCK_OVERVIEW.avgAPR),
      icon: Percent,
      subtitle: 'Weighted average',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <stat.icon className="w-5 h-5 text-primary-600" />
            </div>
            {stat.change !== undefined && (
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                stat.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{formatPercentage(Math.abs(stat.change))}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
            {stat.subtitle && (
              <div className="text-xs text-gray-500">{stat.subtitle}</div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};