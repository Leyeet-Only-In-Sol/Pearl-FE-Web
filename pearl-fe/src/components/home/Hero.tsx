'use client';

import React from 'react';
import { TrendingUp, DollarSign, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const Hero: React.FC = () => {
  const stats = [
    { label: 'Total Value Locked', value: '$2.4B', icon: DollarSign },
    { label: '24h Volume', value: '$125M', icon: TrendingUp },
    { label: 'Active Users', value: '45K+', icon: Users },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Next-Gen{' '}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              DeFi
            </span>{' '}
            Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of decentralized finance with our advanced DLMM pools, 
            optimized strategies, and seamless liquidity provision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              <Zap className="w-5 h-5 mr-2" />
              Start Trading
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Explore Pools
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};