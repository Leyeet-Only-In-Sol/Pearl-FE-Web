'use client'

import React, { useState } from 'react'
import { X, TrendingUp, DollarSign, BarChart3, Settings } from 'lucide-react'

interface AddLiquidityModalProps {
  isOpen: boolean
  onClose: () => void
  poolName: string
  token1: string
  token2: string
}

export default function AddLiquidityModal({ 
  isOpen, 
  onClose, 
  poolName, 
  token1, 
  token2 
}: AddLiquidityModalProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [selectedStrategy, setSelectedStrategy] = useState<'uniform' | 'curve' | 'spot'>('uniform')
  const [minPrice, setMinPrice] = useState(1800)
  const [maxPrice, setMaxPrice] = useState(2200)
  const [numBins, setNumBins] = useState(10)
  const [suiAmount, setSuiAmount] = useState('')
  const [usdcAmount, setUsdcAmount] = useState('')

  const strategies = [
    {
      id: 'uniform',
      name: 'Uniform',
      description: 'Equal distribution across all price ranges',
      pattern: 'M10 80 Q30 20 50 80 T90 80'
    },
    {
      id: 'curve',
      name: 'Curve',
      description: 'Higher concentration around current price',
      pattern: 'M10 80 Q30 40 50 20 Q70 40 90 80'
    },
    {
      id: 'spot',
      name: 'Spot',
      description: 'Concentrated around spot price',
      pattern: 'M10 80 L40 80 L45 20 L55 20 L60 80 L90 80'
    }
  ]

  const mockLiquidityData = [
    { price: 1700, liquidity: 0 },
    { price: 1750, liquidity: 15 },
    { price: 1800, liquidity: 45 },
    { price: 1850, liquidity: 120 },
    { price: 1900, liquidity: 200 },
    { price: 1950, liquidity: 180 },
    { price: 2000, liquidity: 220 },
    { price: 2050, liquidity: 180 },
    { price: 2100, liquidity: 90 },
    { price: 2150, liquidity: 45 },
    { price: 2200, liquidity: 15 },
    { price: 2250, liquidity: 0 },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity" 
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform">
          <div className="
            rounded-2xl bg-white/10 backdrop-blur-md 
            shadow-2xl ring-1 ring-white/20
            relative overflow-hidden
          ">
            {/* Glass reflection effect */}
            <div className="
              absolute inset-0 opacity-20
              bg-gradient-to-br from-white/30 via-transparent to-transparent
            "></div>
            
            {/* Header */}
            <div className="
              bg-white/5 backdrop-blur-sm border-b border-white/10
              px-6 py-4 flex items-center justify-between relative z-10
            ">
              <div>
                <h2 className="text-xl font-bold text-white">Add Liquidity</h2>
                <p className="text-white/70 text-sm">{poolName} Pool</p>
              </div>
              <button
                onClick={onClose}
                className="
                  p-2 rounded-lg bg-white/10 hover:bg-white/20
                  border border-white/20 hover:border-white/30
                  transition-all duration-200
                "
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Main Content */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
              
              {/* Left Side - My Liquidity & Balance */}
              <div className="space-y-6">
                
                {/* My Liquidity Graph */}
                <div className="
                  rounded-xl bg-white/5 backdrop-blur-sm 
                  border border-white/10 p-6
                ">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      My Liquidity
                    </h3>
                    <div className="text-white/70 text-sm">Current: $12,450</div>
                  </div>
                  
                  {/* Liquidity Chart */}
                  <div className="h-48 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Price range indicator */}
                      <rect x="120" y="0" width="160" height="200" fill="rgba(166, 77, 121, 0.2)" />
                      
                      {/* Liquidity bars */}
                      {mockLiquidityData.map((point, index) => {
                        const x = (index / (mockLiquidityData.length - 1)) * 360 + 20
                        const height = (point.liquidity / 220) * 160
                        const y = 180 - height
                        
                        return (
                          <rect
                            key={index}
                            x={x - 8}
                            y={y}
                            width="16"
                            height={height}
                            fill={point.price >= minPrice && point.price <= maxPrice 
                              ? "#6A1E55" 
                              : "#7A7A73"
                            }
                            rx="2"
                          />
                        )
                      })}
                      
                      {/* Current price line */}
                      <line x1="200" y1="0" x2="200" y2="200" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
                      <text x="205" y="15" fill="#fff" fontSize="12">Current: $1,950</text>
                    </svg>
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#6A1E55] rounded mr-2"></div>
                        <span className="text-white/80">Active Range</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#7A7A73] rounded mr-2"></div>
                        <span className="text-white/80">Inactive</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Balance */}
                <div className="
                  rounded-xl bg-white/5 backdrop-blur-sm 
                  border border-white/10 p-6
                ">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    My Balance
                  </h3>
                  
                  <div className="space-y-4">
                    {/* SUI Balance */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          S
                        </div>
                        <div>
                          <div className="font-medium text-white">SUI</div>
                          <div className="text-white/60 text-sm">≈ $1,950 each</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">2.5 SUI</div>
                        <div className="text-white/60 text-sm">$4,875</div>
                      </div>
                    </div>
                    
                    {/* USDC Balance */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          U
                        </div>
                        <div>
                          <div className="font-medium text-white">USDC</div>
                          <div className="text-white/60 text-sm">≈ $1.00 each</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">5,000 USDC</div>
                        <div className="text-white/60 text-sm">$5,000</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Balance */}
                  <div className="border-t border-white/10 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Total Balance</span>
                      <span className="text-xl font-bold text-white">$9,875</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Deposit/Withdraw */}
              <div className="space-y-6">
                
                {/* Tabs */}
                <div className="
                  rounded-xl bg-white/5 backdrop-blur-sm 
                  border border-white/10 p-1 flex
                ">
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className={`
                      flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200
                      ${activeTab === 'deposit'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className={`
                      flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200
                      ${activeTab === 'withdraw'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    Withdraw
                  </button>
                </div>

                {activeTab === 'deposit' && (
                  <>
                    {/* Deposit Liquidity */}
                    <div className="
                      rounded-xl bg-white/5 backdrop-blur-sm 
                      border border-white/10 p-6
                    ">
                      <h3 className="text-lg font-semibold text-white mb-4">Deposit Liquidity</h3>
                      
                      <div className="space-y-4">
                        {/* SUI Input */}
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">SUI Amount</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={suiAmount}
                              onChange={(e) => setSuiAmount(e.target.value)}
                              placeholder="0.0"
                              className="
                                w-full p-4 rounded-lg bg-white/10 backdrop-blur-sm 
                                border border-white/20 text-white placeholder-white/60
                                focus:ring-2 focus:ring-[#A64D79]/50 focus:border-[#A64D79]/50
                                transition-all duration-300
                              "
                            />
                            <button className="absolute right-4 top-4 text-white text-sm font-medium">
                              MAX
                            </button>
                          </div>
                          <div className="text-sm text-white/70 mt-1">Balance: 2.5 SUI</div>
                        </div>

                        {/* USDC Input */}
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">USDC Amount</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={usdcAmount}
                              onChange={(e) => setUsdcAmount(e.target.value)}
                              placeholder="0.0"
                              className="
                                w-full p-4 rounded-lg bg-white/10 backdrop-blur-sm 
                                border border-white/20 text-white placeholder-white/60
                                focus:ring-2 focus:ring-[#A64D79]/50 focus:border-[#A64D79]/50
                                transition-all duration-300
                              "
                            />
                            <button className="absolute right-4 top-4 text-white text-sm font-medium">
                              MAX
                            </button>
                          </div>
                          <div className="text-sm text-white/70 mt-1">Balance: 5,000 USDC</div>
                        </div>
                      </div>
                    </div>

                    {/* Strategy Selection */}
                    <div className="
                      rounded-xl bg-white/5 backdrop-blur-sm 
                      border border-white/10 p-6
                    ">
                      <h3 className="text-lg font-semibold text-white mb-4">Strategy</h3>
                      
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {strategies.map((strategy) => (
                          <button
                            key={strategy.id}
                            onClick={() => setSelectedStrategy(strategy.id as any)}
                            className={`
                              p-4 rounded-lg border transition-all duration-200
                              ${selectedStrategy === strategy.id
                                ? 'bg-white/20 border-[#A64D79]/50 ring-1 ring-[#A64D79]/50'
                                : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                              }
                            `}
                          >
                            <div className="mb-2">
                              <svg className="w-full h-14" viewBox="0 0 100 120">
                                <path
                                  d={strategy.pattern}
                                  stroke={selectedStrategy === strategy.id ? "#3B1C32" : "#9ca3af"}
                                  strokeWidth="2"
                                  fill="none"
                                />
                              </svg>
                            </div>
                            <div className="text-sm font-medium text-white">{strategy.name}</div>
                            <div className="text-xs text-white/60 mt-1">{strategy.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="
                      rounded-xl bg-white/5 backdrop-blur-sm 
                      border border-white/10 p-6
                    ">
                      <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
                      
                      {/* Range Slider */}
                      <div className="mb-6">
                        <div className="relative">
                          <input
                            type="range"
                            min="1500"
                            max="2500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="absolute w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <input
                            type="range"
                            min="1500"
                            max="2500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-white/70 mt-8">
                            <span>$1,500</span>
                            <span>$2,500</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price Inputs */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-white/70 mb-2">Min Price</label>
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="
                              w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm 
                              border border-white/20 text-white text-center
                              focus:ring-2 focus:ring-[#A64D79]/50 focus:border-[#A64D79]/50
                            "
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/70 mb-2">Max Price</label>
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="
                              w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm 
                              border border-white/20 text-white text-center
                              focus:ring-2 focus:ring-[#A64D79]/50
                            "
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/70 mb-2">Num Bins</label>
                          <input
                            type="number"
                            value={numBins}
                            onChange={(e) => setNumBins(Number(e.target.value))}
                            min="1"
                            max="50"
                            className="
                              w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm 
                              border border-white/20 text-white text-center
                              focus:ring-2 focus:ring-[#A64D79]/50
                            "
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'withdraw' && (
                  <div className="
                    rounded-xl bg-white/5 backdrop-blur-sm 
                    border border-white/10 p-6
                  ">
                    <h3 className="text-lg font-semibold text-white mb-4">Withdraw Liquidity</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Withdraw Amount (%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="50"
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-sm text-white/70 mt-2">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-sm text-white/70 mb-2">You will receive:</div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white">SUI</span>
                            <span className="text-white font-medium">1.25 SUI</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">USDC</span>
                            <span className="text-white font-medium">2,500 USDC</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button className="
                    w-full py-4 rounded-lg font-semibold
                    bg-white/10 backdrop-blur-sm border border-white/30
                    text-white hover:bg-white/20 hover:border-white/40
                    hover:scale-[1.02] hover:shadow-xl
                    transition-all duration-300
                    relative overflow-hidden group
                    ">
                    <span className="relative z-10">
                        {activeTab === 'deposit' ? 'Deposit Liquidity' : 'Withdraw Liquidity'}
                    </span>
                    
                    {/* Subtle shine effect */}
                    <div className="
                        absolute inset-0 opacity-0 group-hover:opacity-100
                        bg-gradient-to-r from-transparent via-white/10 to-transparent
                        transform -skew-x-12 translate-x-full group-hover:-translate-x-full
                        transition-transform duration-700
                    "></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}