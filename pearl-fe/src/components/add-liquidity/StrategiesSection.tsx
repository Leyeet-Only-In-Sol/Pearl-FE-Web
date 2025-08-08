'use client';

import React from 'react';
import { TrendingUp, Shield, Zap, Target } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Strategy {
  id: string;
  name: string;
  description: string;
  risk: 'Low' | 'Medium' | 'High';
  expectedAPR: number;
  icon: React.ComponentType<any>;
  features: string[];
}

const STRATEGIES: Strategy[] = [
  {
    id: 'conservative',
    name: 'Conservative Range',
    description: 'Wide price range for stable returns with lower risk',
    risk: 'Low',
    expectedAPR: 8.5,
    icon: Shield,
    features: ['Wide price range', 'Lower impermanent loss', 'Stable returns'],
  },
  {
    id: 'balanced',
    name: 'Balanced Strategy',
    description: 'Optimal balance between risk and reward',
    risk: 'Medium',
    expectedAPR: 15.4,
    icon: Target,
    features: ['Moderate price range', 'Good risk/reward ratio', 'Auto-rebalancing'],
  },
  {
    id: 'aggressive',
    name: 'High Yield',
    description: 'Narrow price range for maximum returns',
    risk: 'High',
    expectedAPR: 24.2,
    icon: TrendingUp,
    features: ['Narrow price range', 'Maximum yield potential', 'Active management required'],
  },
];

interface StrategiesSectionProps {
  onSelectStrategy: (strategy: Strategy) => void;
  selectedStrategy?: string;
}

export const StrategiesSection: React.FC<StrategiesSectionProps> = ({
  onSelectStrategy,
  selectedStrategy,
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Zap className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Liquidity Strategies</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STRATEGIES.map((strategy) => (
          <div
            key={strategy.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedStrategy === strategy.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectStrategy(strategy)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                strategy.risk === 'Low' ? 'bg-green-100' :
                strategy.risk === 'Medium' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <strategy.icon className={`w-5 h-5 ${
                  strategy.risk === 'Low' ? 'text-green-600' :
                  strategy.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                strategy.risk === 'Low' ? 'bg-green-100 text-green-700' :
                strategy.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {strategy.risk} Risk
              </span>
            </div>

            <h4 className="font-semibold text-gray-900 mb-2">{strategy.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>

            <div className="mb-3">
              <div className="text-lg font-bold text-primary-600">
                {strategy.expectedAPR}% APR
              </div>
              <div className="text-xs text-gray-500">Expected return</div>
            </div>

            <ul className="space-y-1 mb-4">
              {strategy.features.map((feature, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              size="sm"
              variant={selectedStrategy === strategy.id ? 'primary' : 'outline'}
              className="w-full"
            >
              {selectedStrategy === strategy.id ? 'Selected' : 'Select Strategy'}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};