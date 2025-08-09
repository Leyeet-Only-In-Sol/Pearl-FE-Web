import React from 'react'
import { TrendingUp, DollarSign } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

export default function Portfolio() {
  const positions = [
    { pool: 'ETH/USDC', deposited: '$5,000', current: '$5,250', fees: '$125', apy: '15.4%' },
    { pool: 'BTC/USDT', deposited: '$3,000', current: '$3,180', fees: '$95', apy: '12.8%' },
    { pool: 'SOL/USDC', deposited: '$2,000', current: '$2,150', fees: '$78', apy: '18.2%' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Portfolio</h1>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$10,580</div>
                <div className="text-gray-600">Total Value</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">+$580</div>
                <div className="text-gray-600">Total P&L</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$298</div>
                <div className="text-gray-600">Total Fees</div>
              </div>
            </div>
          </div>
        </div>

        {/* Positions Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Your Positions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposited</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees Earned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">APY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {positions.map((position, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{position.pool}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{position.deposited}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{position.current}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">{position.fees}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{position.apy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}