import Navbar from '@/components/layout/Navbar'
import PoolCard from '@/components/pool/PoolCard'
import React from 'react'

export default function Pools() {
  const pools = [
    { name: 'ETH/USDC', token1: 'ETH', token2: 'USDC', tvl: '$12.5M', apr: '15.4%', volume: '$2.1M' },
    { name: 'BTC/USDT', token1: 'BTC', token2: 'USDT', tvl: '$8.9M', apr: '12.8%', volume: '$1.8M' },
    { name: 'SOL/USDC', token1: 'SOL', token2: 'USDC', tvl: '$5.6M', apr: '18.2%', volume: '$950K' },
    { name: 'LINK/ETH', token1: 'LINK', token2: 'ETH', tvl: '$3.2M', apr: '22.1%', volume: '$680K' },
    { name: 'UNI/USDC', token1: 'UNI', token2: 'USDC', tvl: '$2.8M', apr: '19.5%', volume: '$520K' },
    { name: 'MATIC/ETH', token1: 'MATIC', token2: 'ETH', tvl: '$1.9M', apr: '25.3%', volume: '$430K' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Liquidity Pools</h1>
          <p className="text-gray-600">Provide liquidity and earn trading fees</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool, index) => (
            <PoolCard key={index} {...pool} />
          ))}
        </div>
      </div>
    </div>
  )
}