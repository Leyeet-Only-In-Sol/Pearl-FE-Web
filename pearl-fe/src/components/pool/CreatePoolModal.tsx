// pearl-fe/src/components/pool/CreatePoolModal.tsx
'use client'

import React, { useState } from 'react'
import { X, Plus, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { usePoolCreation } from '@/hooks/usePoolCreation'
import { useTestTokens } from '@/hooks/useTestTokens'

interface CreatePoolModalProps {
  isOpen: boolean
  onClose: () => void
  onPoolCreated?: (poolId: string) => void
}

export default function CreatePoolModal({ 
  isOpen, 
  onClose,
  onPoolCreated 
}: CreatePoolModalProps) {
  const [tokenA, setTokenA] = useState('SUI')
  const [tokenB, setTokenB] = useState('TEST_USDC')
  const [binStep, setBinStep] = useState(25)
  const [initialPrice, setInitialPrice] = useState('1.0')

  // Hooks
  const { 
    loading: poolLoading, 
    error: poolError, 
    createSUIUSDCPool, 
    isReady: poolReady,
    lastResult: poolResult
  } = usePoolCreation()

  const { 
    loading: tokenLoading, 
    mintTestUSDC, 
    getLiquidityTokens, 
    isReady: tokenReady 
  } = useTestTokens()

  // Available tokens
  const AVAILABLE_TOKENS = [
    { symbol: 'SUI', name: 'Sui', type: '0x2::sui::SUI' },
    { symbol: 'TEST_USDC', name: 'Test USDC', type: '0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2::test_usdc::TEST_USDC' }
  ]

  // Available bin steps (fee tiers)
  const BIN_STEPS = [
    { step: 1, fee: '0.01%', description: 'Best for very stable pairs' },
    { step: 5, fee: '0.05%', description: 'Best for stable pairs' },
    { step: 25, fee: '0.25%', description: 'Best for most pairs' },
    { step: 100, fee: '1.00%', description: 'Best for volatile pairs' }
  ]

  const handleCreatePool = async () => {
    if (tokenA === 'SUI' && tokenB === 'TEST_USDC') {
      const result = await createSUIUSDCPool()
      if (result && onPoolCreated) {
        // Extract pool ID from result if needed
        onPoolCreated('new-pool-id')
      }
    }
  }

  const handleGetTokens = async (amount: 'small' | 'large') => {
    if (amount === 'small') {
      await mintTestUSDC()
    } else {
      await getLiquidityTokens()
    }
  }

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
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform">
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
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Plus className="w-6 h-6 mr-2" />
                  Create New Pool
                </h2>
                <p className="text-white/70 text-sm">Create a new DLMM liquidity pool</p>
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
            <div className="p-6 space-y-6 relative z-10">
              
              {/* Success Message */}
              {poolResult && (
                <div className="
                  rounded-xl bg-green-500/10 backdrop-blur-sm 
                  border border-green-500/20 p-4
                ">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="text-green-300 font-medium">Pool Created Successfully!</div>
                      <div className="text-green-200 text-sm">Your SUI/TEST_USDC pool is now live and ready for liquidity.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {poolError && (
                <div className="
                  rounded-xl bg-red-500/10 backdrop-blur-sm 
                  border border-red-500/20 p-4
                ">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <div className="text-red-300 font-medium">Pool Creation Failed</div>
                      <div className="text-red-200 text-sm">{poolError}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left Side - Pool Configuration */}
                <div className="space-y-6">
                  
                  {/* Token Pair Selection */}
                  <div className="
                    rounded-xl bg-white/5 backdrop-blur-sm 
                    border border-white/10 p-6
                  ">
                    <h3 className="text-lg font-semibold text-white mb-4">Token Pair</h3>
                    
                    <div className="space-y-4">
                      {/* Token A */}
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Token A</label>
                        <select 
                          value={tokenA}
                          onChange={(e) => setTokenA(e.target.value)}
                          className="
                            w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm 
                            border border-white/20 text-white
                            focus:ring-2 focus:ring-[#A64D79]/50 focus:border-[#A64D79]/50
                            transition-all duration-300
                          "
                        >
                          {AVAILABLE_TOKENS.map(token => (
                            <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                              {token.symbol} - {token.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Token B */}
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">Token B</label>
                        <select 
                          value={tokenB}
                          onChange={(e) => setTokenB(e.target.value)}
                          className="
                            w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm 
                            border border-white/20 text-white
                            focus:ring-2 focus:ring-[#A64D79]/50 focus:border-[#A64D79]/50
                            transition-all duration-300
                          "
                        >
                          {AVAILABLE_TOKENS.map(token => (
                            <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                              {token.symbol} - {token.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Fee Tier Selection */}
                  <div className="
                    rounded-xl bg-white/5 backdrop-blur-sm 
                    border border-white/10 p-6
                  ">
                    <h3 className="text-lg font-semibold text-white mb-4">Fee Tier</h3>
                    
                    <div className="space-y-2">
                      {BIN_STEPS.map((step) => (
                        <button
                          key={step.step}
                          onClick={() => setBinStep(step.step)}
                          className={`
                            w-full p-3 rounded-lg border text-left transition-all duration-200
                            ${binStep === step.step
                              ? 'bg-white/20 border-[#A64D79]/50 ring-1 ring-[#A64D79]/50'
                              : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                            }
                          `}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium text-white">{step.fee}</div>
                              <div className="text-xs text-white/60">{step.description}</div>
                            </div>
                            <div className="text-sm text-white/80">Bin Step: {step.step}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Initial Price */}
                  <div className="
                    rounded-xl bg-white/5 backdrop-blur-sm 
                    border border-white/10 p-6
                  ">
                    <h3 className="text-lg font-semibold text-white mb-4">Initial Price</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Price (1 {tokenA} = ? {tokenB})
                      </label>
                      <input
                        type="number"
                        value={initialPrice}
                        onChange={(e) => setInitialPrice(e.target.value)}
                        placeholder="1.0"
                        step="0.01"
                        className="
                          w-full p-3 rounded-lg bg-white/10 backdrop-blur-sm 
                          border border-white/20 text-white placeholder-white/60
                          focus:ring-2 focus:ring-[#A64D79]/50 focus:border-[#A64D79]/50
                          transition-all duration-300
                        "
                      />
                      <div className="text-sm text-white/70 mt-2">
                        Starting price for the pool. Can be adjusted later by the market.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Get Tokens & Create Pool */}
                <div className="space-y-6">
                  
                  {/* Get Test Tokens */}
                  <div className="
                    rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 
                    backdrop-blur-sm border border-green-500/20 p-6
                  ">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Get Test Tokens
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <button
                        onClick={() => handleGetTokens('small')}
                        disabled={!tokenReady || tokenLoading}
                        className="
                          w-full flex items-center justify-center space-x-2 py-3 px-4 
                          rounded-lg font-medium
                          bg-green-600/20 border border-green-500/30
                          text-green-300 hover:bg-green-600/30 hover:border-green-500/50
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-200
                        "
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>{tokenLoading ? 'Minting...' : 'Get 1,000 TEST_USDC'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleGetTokens('large')}
                        disabled={!tokenReady || tokenLoading}
                        className="
                          w-full flex items-center justify-center space-x-2 py-3 px-4 
                          rounded-lg font-medium
                          bg-blue-600/20 border border-blue-500/30
                          text-blue-300 hover:bg-blue-600/30 hover:border-blue-500/50
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-200
                        "
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>{tokenLoading ? 'Minting...' : 'Get 10,000 TEST_USDC'}</span>
                      </button>
                    </div>
                    
                    <div className="text-xs text-white/60">
                      💡 Get test tokens before creating the pool. You'll need both SUI and TEST_USDC.
                    </div>
                  </div>

                  {/* Pool Preview */}
                  <div className="
                    rounded-xl bg-white/5 backdrop-blur-sm 
                    border border-white/10 p-6
                  ">
                    <h3 className="text-lg font-semibold text-white mb-4">Pool Preview</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">Pair:</span>
                        <span className="text-white font-medium">{tokenA}/{tokenB}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Fee Tier:</span>
                        <span className="text-white font-medium">{BIN_STEPS.find(s => s.step === binStep)?.fee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Initial Price:</span>
                        <span className="text-white font-medium">{initialPrice} {tokenB}/{tokenA}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Protocol:</span>
                        <span className="text-white font-medium">DLMM (Zero Slippage)</span>
                      </div>
                    </div>
                  </div>

                  {/* Create Pool Button */}
                  <button 
                    onClick={handleCreatePool}
                    disabled={!poolReady || poolLoading || poolResult}
                    className="
                      w-full py-4 rounded-lg font-semibold
                      bg-gradient-to-r from-[#A64D79] to-[#3B1C32]
                      text-white hover:from-[#B55D89] hover:to-[#4A2342]
                      hover:scale-[1.02] hover:shadow-xl
                      disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:hover:scale-100
                      transition-all duration-300
                      relative overflow-hidden group
                    "
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      {poolLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Creating Pool...</span>
                        </>
                      ) : poolResult ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Pool Created!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>Create {tokenA}/{tokenB} Pool</span>
                        </>
                      )}
                    </span>
                    
                    {/* Shine effect */}
                    <div className="
                      absolute inset-0 opacity-0 group-hover:opacity-100
                      bg-gradient-to-r from-transparent via-white/10 to-transparent
                      transform -skew-x-12 translate-x-full group-hover:-translate-x-full
                      transition-transform duration-700
                    "></div>
                  </button>

                  {poolResult && (
                    <div className="text-center">
                      <button
                        onClick={onClose}
                        className="
                          px-6 py-2 rounded-lg font-medium
                          bg-white/10 border border-white/30
                          text-white hover:bg-white/20 hover:border-white/40
                          transition-all duration-200
                        "
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}