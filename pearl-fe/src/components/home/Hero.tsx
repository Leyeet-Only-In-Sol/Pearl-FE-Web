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
    <div>
        <section className="pt-20 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-semibold mb-6">
                Where Finance Meets Brilliance
              </h1>
              <p className="text-xl mb-8 text-white">
                Swap, provide liquidity, and earn rewards with ease
              </p>
            </div>
          </div>
        </section>
  
        {/* Stats Section */}
        <section>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="
                    group relative overflow-hidden
                    rounded-xl bg-white/10 backdrop-blur-md 
                    shadow-lg ring-1 ring-white/20 
                    text-center p-6
                    transition-all duration-500 ease-out
                    hover:bg-white/20 hover:shadow-2xl hover:-translate-y-2
                    hover:ring-white/30 hover:scale-105
                    cursor-pointer
                  "
                >
                  {/* Glass reflection effect */}
                  <div className="
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-gradient-to-tr from-white/20 via-transparent to-transparent
                    transition-opacity duration-500
                  "></div>
                  
                  {/* Icon container */}
                  <div className="
                    flex items-center justify-center mb-4 relative z-10
                    transform transition-transform duration-300
                    group-hover:scale-110 group-hover:rotate-3
                  ">
                    <div className="
                      p-3 bg-white/20 backdrop-blur-sm rounded-full
                      ring-1 ring-white/30
                      group-hover:bg-white/30 group-hover:shadow-lg
                      transition-all duration-300
                    ">
                      <stat.icon className="
                        w-6 h-6 text-white
                        group-hover:text-blue-100
                        transition-colors duration-300
                      " />
                    </div>
                  </div>
                  
                  {/* Value */}
                  <div className="
                    text-2xl font-bold text-white mb-1 relative z-10
                    group-hover:text-blue-50
                    transition-all duration-300
                    group-hover:scale-110
                  ">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="
                    text-white/80 relative z-10
                    group-hover:text-white
                    transition-colors duration-300
                  ">
                    {stat.label}
                  </div>
                  
                  {/* Animated border glow */}
                  <div className="
                    absolute inset-0 rounded-xl opacity-0
                    bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20
                    group-hover:opacity-100
                    transition-opacity duration-500
                    animate-pulse
                  "></div>
                  
                  {/* Bottom shine effect */}
                  <div className="
                    absolute bottom-0 left-0 right-0 h-px
                    bg-gradient-to-r from-transparent via-white/50 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-500
                  "></div>
                </div>
              ))}
            </div>
          </div>
        </section>
    </div>
  );
};