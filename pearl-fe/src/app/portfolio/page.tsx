'use client'

import React, { useState } from 'react'
import { TrendingUp, DollarSign } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import AddLiquidityModal from '@/components/add-liquidity/AddLiquidityModal'

export default function Portfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<any>(null)

  const positions = [
    { pool: 'ETH/USDC', deposited: '$5,000', current: '$5,250', fees: '$125', apy: '15.4%' },
    { pool: 'BTC/USDT', deposited: '$3,000', current: '$3,180', fees: '$95', apy: '12.8%' },
    { pool: 'SOL/USDC', deposited: '$2,000', current: '$2,150', fees: '$78', apy: '18.2%' },
  ]

  const handlePositionClick = (position: any) => {
    setSelectedPosition(position)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPosition(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1A1A1D] to-[#3B1C32]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-semibold text-white mb-8">Portfolio</h1>
        
        {/* Overview Stats - You can uncomment this section if needed */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div> */}

        {/* Positions Section */}
        <div className="
          rounded-2xl bg-white/10 backdrop-blur-md 
          shadow-xl ring-1 ring-white/20
          overflow-hidden
        ">
          {/* Header */}
          <div className="
            bg-white/5 backdrop-blur-sm border-b border-white/10
            px-6 py-4
          ">
            <h2 className="text-lg font-semibold text-white">Your Positions</h2>
          </div>
          
          {/* Grid Header */}
          <div className="
            bg-white/5 backdrop-blur-sm border-b border-white/10
            px-6 py-4
          ">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
              <div className="text-white/90 font-medium text-sm">Pool</div>
              <div className="hidden md:block text-white/90 font-medium text-sm">Deposited</div>
              <div className="hidden md:block text-white/90 font-medium text-sm">Current Value</div>
              <div className="hidden md:block text-white/90 font-medium text-sm">Fees Earned</div>
              <div className="text-white/90 font-medium text-sm text-right">APY</div>
            </div>
          </div>
          
          {/* Positions Grid */}
          <div className="divide-y divide-white/10">
            {positions.map((position, index) => (
              <div 
                key={index} 
                onClick={() => handlePositionClick(position)}
                className="
                  group relative overflow-hidden
                  px-6 py-4 transition-all duration-300
                  hover:bg-white/10 hover:backdrop-blur-lg
                  cursor-pointer
                  hover:shadow-lg hover:scale-[1.01]
                  active:scale-[0.99]
                "
              >
                {/* Glass reflection effect on hover */}
                <div className="
                  absolute inset-0 opacity-0 group-hover:opacity-100
                  bg-gradient-to-r from-white/10 via-transparent to-transparent
                  transition-opacity duration-300
                "></div>
                
                {/* Click indicator */}
                {/* <div className="
                  absolute top-2 right-6 opacity-0 group-hover:opacity-100
                  transition-all duration-300
                ">
                  <div className="text-blue-300 text-xs font-medium">
                    Click to manage
                  </div>
                </div> */}
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center relative z-10">
                  
                  {/* Pool Name */}
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      <div className="
                        w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center 
                        text-white text-sm font-bold ring-2 ring-white/20
                        group-hover:ring-white/40 group-hover:ring-4
                        transition-all duration-300
                      ">
                        {position.pool.split('/')[0].charAt(0)}
                      </div>
                      <div className="
                        w-8 h-8 bg-green-500 rounded-full flex items-center justify-center 
                        text-white text-sm font-bold border-2 border-white/20
                        group-hover:border-white/40 group-hover:border-4
                        transition-all duration-300
                      ">
                        {position.pool.split('/')[1].charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="
                        font-medium text-white group-hover:text-blue-100
                        transition-colors duration-300
                      ">
                        {position.pool}
                      </div>
                      <div className="text-white/60 text-sm group-hover:text-white/80 transition-colors duration-300">
                        Liquidity Position
                      </div>
                    </div>
                  </div>
                  
                  {/* Deposited - Hidden on mobile */}
                  <div className="hidden md:block">
                    <div className="
                      text-white group-hover:text-blue-100 font-medium
                      transition-colors duration-300
                    ">
                      {position.deposited}
                    </div>
                  </div>
                  
                  {/* Current Value - Hidden on mobile */}
                  <div className="hidden md:block">
                    <div className="
                      text-white group-hover:text-blue-100 font-medium
                      transition-colors duration-300
                    ">
                      {position.current}
                    </div>
                    {/* P&L Indicator */}
                    <div className="text-green-300 text-sm group-hover:text-green-200 transition-colors duration-300">
                      +{((parseFloat(position.current.replace('$', '').replace(',', '')) - 
                          parseFloat(position.deposited.replace('$', '').replace(',', ''))) / 
                          parseFloat(position.deposited.replace('$', '').replace(',', '')) * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  {/* Fees Earned - Hidden on mobile */}
                  <div className="hidden md:block">
                    <div className="
                      text-green-300 font-medium group-hover:text-green-200
                      transition-colors duration-300
                    ">
                      {position.fees}
                    </div>
                  </div>
                  
                  {/* APY */}
                  <div className="text-right">
                    <span className="
                      bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold
                      group-hover:bg-green-400/30 group-hover:text-green-200
                      group-hover:shadow-lg group-hover:scale-105
                      transition-all duration-300
                    ">
                      {position.apy} APY
                    </span>
                  </div>
                </div>
                
                {/* Mobile Info - Shown only on mobile */}
                <div className="md:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-xs">Deposited</div>
                    <div className="text-white font-medium text-sm">{position.deposited}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Current Value</div>
                    <div className="text-white font-medium text-sm">{position.current}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Fees Earned</div>
                    <div className="text-green-300 font-medium text-sm">{position.fees}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">P&L</div>
                    <div className="text-green-300 font-medium text-sm">
                      +{((parseFloat(position.current.replace('$', '').replace(',', '')) - 
                          parseFloat(position.deposited.replace('$', '').replace(',', ''))) / 
                          parseFloat(position.deposited.replace('$', '').replace(',', '')) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                {/* Enhanced bottom glow line on hover */}
                <div className="
                  absolute bottom-0 left-0 right-0 h-px
                  bg-gradient-to-r from-transparent via-blue-400/50 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-500
                "></div>
                
                {/* Subtle pulse effect on hover */}
                <div className="
                  absolute inset-0 rounded-2xl
                  ring-1 ring-blue-400/20 opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                "></div>
              </div>
            ))}
          </div>
          
          {/* Empty State (if no positions) */}
          {positions.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-white/60 text-lg mb-2">No positions yet</div>
              <div className="text-white/40 text-sm">Start by adding liquidity to a pool</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Liquidity Modal */}
      {selectedPosition && (
        <AddLiquidityModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          poolName={selectedPosition.pool}
          token1={selectedPosition.pool.split('/')[0]}
          token2={selectedPosition.pool.split('/')[1]}
        />
      )}
    </div>
  )
}