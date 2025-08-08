'use client';

import React from 'react';
import { Carousel } from '@/components/ui/Carousel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Zap, Shield } from 'lucide-react';

export const PoolCarousel: React.FC = () => {
  const carouselItems = [
    {
      title: 'High-Yield Farming',
      subtitle: 'Earn up to 25% APR',
      description: 'Maximize your returns with our optimized yield farming strategies',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Lightning Fast',
      subtitle: 'Instant swaps & deposits',
      description: 'Experience the fastest DeFi transactions with minimal fees',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Secure & Audited',
      subtitle: '100% Safe protocols',
      description: 'Your funds are protected by industry-leading security measures',
      icon: Shield,
      gradient: 'from-purple-500 to-indigo-600',
    },
  ];

  return (
    <div className="mb-12">
      <Carousel className="h-64">
        {carouselItems.map((item, index) => (
          <div key={index} className={`h-64 bg-gradient-to-r ${item.gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-center text-white">
              <div className="flex items-center space-x-3 mb-4">
                <item.icon className="w-8 h-8" />
                <div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-white/80">{item.subtitle}</p>
                </div>
              </div>
              <p className="text-lg mb-6 max-w-md text-white/90">
                {item.description}
              </p>
              <Button 
                variant="outline" 
                className="w-fit bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full"></div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};