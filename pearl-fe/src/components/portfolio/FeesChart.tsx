'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from '@/components/ui/Card';

const MOCK_FEES_DATA = [
  { date: '2024-01-01', fees: 45.2, cumulative: 1205.3 },
  { date: '2024-01-02', fees: 52.1, cumulative: 1257.4 },
  { date: '2024-01-03', fees: 38.7, cumulative: 1296.1 },
  { date: '2024-01-04', fees: 61.3, cumulative: 1357.4 },
  { date: '2024-01-05', fees: 49.8, cumulative: 1407.2 },
  { date: '2024-01-06', fees: 55.4, cumulative: 1462.6 },
  { date: '2024-01-07', fees: 47.9, cumulative: 1510.5 },
];

const POOL_FEES_DATA = [
  { name: 'ETH/USDC', fees: 450.25, percentage: 36 },
  { name: 'BTC/USDT', fees: 650.50, percentage: 52 },
  { name: 'SOL/USDC', fees: 150.00, percentage: 12 },
];

export const FeesChart: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Fees Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Fees Earned
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_FEES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}`, 'Total Fees']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#22c55e' }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Fees by Pool */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fees by Pool
        </h3>
        <div className="space-y-4">
          {POOL_FEES_DATA.map((pool, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
                <span className="font-medium text-gray-900">{pool.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ${pool.fees.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {pool.percentage}% of total
                  </div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${pool.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};