import React from 'react'
import { TrendingUp, DollarSign, Users } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import PoolCard from '@/components/pool/PoolCard'

export default function Home() {
  const stats = [
    { label: 'Total Value Locked', value: '$2.4B', icon: DollarSign },
    { label: '24h Volume', value: '$125M', icon: TrendingUp },
    { label: 'Active Users', value: '45K+', icon: Users },
  ]

  const pools = [
    {
      name: 'ETH/USDC',
      token1: 'ETH',
      token2: 'USDC',
      tvl: '$12.5M',
      apr: '15.4%',
      volume: '$2.1M'
    },
    {
      name: 'BTC/USDT',
      token1: 'BTC',
      token2: 'USDT',
      tvl: '$8.9M',
      apr: '12.8%',
      volume: '$1.8M'
    },
    {
      name: 'SOL/USDC',
      token1: 'SOL',
      token2: 'USDC',
      tvl: '$5.6M',
      apr: '18.2%',
      volume: '$950K'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Simple DeFi Platform
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Swap, provide liquidity, and earn rewards with ease
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Start Trading
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pools Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Pools
            </h2>
            <p className="text-gray-600">
              Provide liquidity and earn rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool, index) => (
              <PoolCard key={index} {...pool} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}