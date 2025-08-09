import React from 'react'
import { ArrowDownUp } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

export default function Swap() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Swap Tokens</h2>
          
          <div className="space-y-4">
            {/* From Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-4 top-4">
                  <select className="bg-gray-100 border-0 rounded-lg px-3 py-1 text-sm">
                    <option>ETH</option>
                    <option>USDC</option>
                    <option>BTC</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">Balance: 2.5 ETH</div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center">
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <ArrowDownUp className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* To Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <div className="absolute right-4 top-4">
                  <select className="bg-gray-100 border-0 rounded-lg px-3 py-1 text-sm">
                    <option>USDC</option>
                    <option>ETH</option>
                    <option>BTC</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">Balance: 5,000 USDC</div>
            </div>

            {/* Swap Button */}
            <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 mt-6">
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}