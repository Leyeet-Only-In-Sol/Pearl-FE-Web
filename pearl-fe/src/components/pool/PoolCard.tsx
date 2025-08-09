import React from 'react'

interface PoolCardProps {
  name: string
  token1: string
  token2: string
  tvl: string
  apr: string
  volume: string
}

export default function PoolCard({ name, token1, token2, tvl, apr, volume }: PoolCardProps) {
  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {token1.charAt(0)}
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white">
              {token2.charAt(0)}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
        </div>
        <span className="text-green-600 font-semibold">{apr} APR</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">TVL</span>
          <span className="font-medium">{tvl}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">24h Volume</span>
          <span className="font-medium">{volume}</span>
        </div>
      </div>
      
      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Add Liquidity
      </button>
    </div>
  )
}