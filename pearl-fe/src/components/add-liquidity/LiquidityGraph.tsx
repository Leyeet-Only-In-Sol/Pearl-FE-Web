'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card } from '@/components/ui/Card';

const MOCK_LIQUIDITY_DATA = [
  { price: 1800, liquidity: 0, inRange: false },
  { price: 1850, liquidity: 15, inRange: false },
  { price: 1900, liquidity: 45, inRange: true },
  { price: 1950, liquidity: 120, inRange: true },
  { price: 2000, liquidity: 200, inRange: true },
  { price: 2050, liquidity: 180, inRange: true },
  { price: 2100, liquidity: 90, inRange: true },
  { price: 2150, liquidity: 30, inRange: false },
  { price: 2200, liquidity: 0, inRange: false },
];

interface LiquidityGraphProps {
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
}

export const LiquidityGraph: React.FC<LiquidityGraphProps> = ({
  minPrice,
  maxPrice,
  currentPrice,
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Liquidity Distribution</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Your Liquidity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">In Range</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_LIQUIDITY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="price" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number) => [`${value}`, 'Liquidity']}
              labelFormatter={(label) => `Price: $${label}`}
            />
            <Area
              type="monotone"
              dataKey="liquidity"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
            <Line
              type="monotone"
              dataKey={() => currentPrice}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            ${minPrice.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Min Price</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-semibold text-green-600">
            ${currentPrice.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Current Price</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            ${maxPrice.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Max Price</div>
        </div>
      </div>
    </Card>
  );
};