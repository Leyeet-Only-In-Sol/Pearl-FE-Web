// pearl-fe/src/app/swap/page.tsx
'use client';

import React, { useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useDLMMSwap } from '@/hooks/useDLMMSwap';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export default function Swap() {
  const { 
    loading, 
    error, 
    quote, 
    getQuote, 
    getTestTokens, 
    isReady, 
    userAddress 
  } = useDLMMSwap();
  
  const { isConnected } = useWalletConnection();

  // Form state
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState('TEST_USDC');
  const [toToken, setToToken] = useState('SUI');

  // Token types for your testnet
  const TOKEN_TYPES = {
    TEST_USDC: '0x6a01a88c704d76ef8b0d4db811dff4dd13104a35e7a125131fa35949d0bc2ada::test_usdc::TEST_USDC',
    SUI: '0x2::sui::SUI'
  };

  // Handle get quote
  const handleGetQuote = async () => {
    if (!fromAmount || !isReady) return;

    const tokenIn = TOKEN_TYPES[fromToken as keyof typeof TOKEN_TYPES];
    const tokenOut = TOKEN_TYPES[toToken as keyof typeof TOKEN_TYPES];
    const amountIn = (parseFloat(fromAmount) * 1e9).toString(); // Convert to raw units

    console.log('🔍 Getting quote for:', {
      tokenIn,
      tokenOut,
      amountIn,
      fromAmount
    });

    await getQuote(tokenIn, tokenOut, amountIn);
  };

  // Handle get test tokens
  const handleGetTestTokens = async () => {
    if (!isReady) return;
    
    // For now, we'll just call the function
    // In a real app, you'd need the user's keypair
    console.log('🪙 Getting test tokens...');
    alert('Test token minting would require user signature. Check console for DLMM connection status.');
  };

  // Swap tokens
  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1A1A1D] to-[#3B1C32]">
      <Navbar />
      
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="
          rounded-2xl bg-white/10 backdrop-blur-md 
          shadow-xl ring-1 ring-white/20
          p-6 relative overflow-hidden
        ">
          {/* Glass reflection effect */}
          <div className="
            absolute inset-0 opacity-30
            bg-gradient-to-br from-white/20 via-transparent to-transparent
          "></div>
          
          <h2 className="text-xl font-bold text-white mb-6 text-center relative z-10">
            Swap Tokens (Real DLMM)
          </h2>
          
          {/* Connection Status */}
          <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10 relative z-10">
            <div className="text-sm text-white/70 mb-1">Status:</div>
            {isConnected && userAddress ? (
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-green-300">
                  ✅ Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(userAddress);
                    alert('Address copied to clipboard!');
                  }}
                  className="
                    ml-2 px-2 py-1 text-xs rounded
                    bg-white/20 hover:bg-white/30
                    text-white/80 hover:text-white
                    border border-white/30 hover:border-white/50
                    transition-all duration-200
                  "
                >
                  Copy
                </button>
              </div>
            ) : (
              <div className="text-sm font-medium text-yellow-300">
                ⏳ Please connect wallet
              </div>
            )}
            <div className={`text-xs mt-1 ${isReady ? 'text-green-300' : 'text-orange-300'}`}>
              {isReady ? '🚀 DLMM Ready' : '⏳ DLMM Initializing...'}
            </div>
            {isConnected && userAddress && (
              <div className="mt-2 text-xs text-white/60">
                👆 Copy your address to get testnet SUI from faucet
              </div>
            )}
          </div>
          
          <div className="space-y-4 relative z-10">
            {/* From Token */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">From</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="
                    w-full p-4 rounded-lg
                    bg-white/10 backdrop-blur-sm border border-white/20
                    text-white placeholder-white/60
                    focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                    focus:bg-white/15
                    transition-all duration-300
                  "
                />
                <div className="absolute right-4 top-4">
                  <select 
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    className="
                      bg-white/20 backdrop-blur-sm border border-white/30 
                      rounded-lg px-3 py-1 text-sm text-white
                      focus:ring-2 focus:ring-blue-400/50
                      transition-all duration-300
                    "
                  >
                    <option className="bg-gray-800 text-white" value="TEST_USDC">TEST_USDC</option>
                    <option className="bg-gray-800 text-white" value="SUI">SUI</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center">
              <button 
                onClick={swapTokens}
                className="
                  p-3 rounded-full
                  bg-white/20 backdrop-blur-sm border border-white/30
                  hover:bg-white/30 hover:border-white/50 hover:scale-110
                  transition-all duration-300
                  group
                "
              >
                <ArrowDownUp className="
                  w-5 h-5 text-white/90 
                  group-hover:text-white group-hover:rotate-180
                  transition-all duration-300
                " />
              </button>
            </div>

            {/* To Token */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">To</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
                  value={quote ? (parseInt(quote.amountOut) / 1e9).toFixed(6) : ''}
                  className="
                    w-full p-4 rounded-lg
                    bg-white/10 backdrop-blur-sm border border-white/20
                    text-white placeholder-white/60
                    focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                    focus:bg-white/15
                    transition-all duration-300
                  "
                  readOnly
                />
                <div className="absolute right-4 top-4">
                  <select 
                    value={toToken}
                    onChange={(e) => setToToken(e.target.value)}
                    className="
                      bg-white/20 backdrop-blur-sm border border-white/30 
                      rounded-lg px-3 py-1 text-sm text-white
                      focus:ring-2 focus:ring-blue-400/50
                      transition-all duration-300
                    "
                  >
                    <option className="bg-gray-800 text-white" value="SUI">SUI</option>
                    <option className="bg-gray-800 text-white" value="TEST_USDC">TEST_USDC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quote Details */}
            {quote && (
              <div className="
                bg-white/5 backdrop-blur-sm border border-white/10
                rounded-lg p-4 space-y-2
              ">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Output Amount</span>
                  <span className="text-white">{(parseInt(quote.amountOut) / 1e9).toFixed(6)} {toToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Price Impact</span>
                  <span className="text-white">{quote.priceImpact}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Fee Amount</span>
                  <span className="text-white">{(parseInt(quote.feeAmount) / 1e9).toFixed(6)} {fromToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Pool ID</span>
                  <span className="text-white text-xs">{quote.poolId?.slice(0, 8)}...{quote.poolId?.slice(-6)}</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="
                bg-red-500/10 backdrop-blur-sm border border-red-500/20
                rounded-lg p-4
              ">
                <div className="text-red-300 text-sm">{error}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Get Quote Button */}
              <button 
                onClick={handleGetQuote}
                disabled={!isReady || loading || !fromAmount}
                className="
                  w-full py-3 rounded-lg font-semibold
                  bg-blue-600/80 backdrop-blur-sm border border-blue-500/30
                  text-white hover:bg-blue-600 hover:border-blue-500/50
                  hover:scale-[1.02] hover:shadow-xl
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                  relative overflow-hidden group
                "
              >
                <span className="relative z-10">
                  {loading ? 'Getting Quote...' : 'Get Real Quote'}
                </span>
              </button>

              {/* Get Test Tokens Button */}
              <button 
                onClick={handleGetTestTokens}
                disabled={!isReady}
                className="
                  w-full py-3 rounded-lg font-semibold
                  bg-green-600/80 backdrop-blur-sm border border-green-500/30
                  text-white hover:bg-green-600 hover:border-green-500/50
                  hover:scale-[1.02] hover:shadow-xl
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                  relative overflow-hidden group
                "
              >
                <span className="relative z-10">Get Test Tokens</span>
              </button>
            </div>
          </div>
          
          {/* Bottom glow line */}
          <div className="
            absolute bottom-0 left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-white/50 to-transparent
          "></div>
        </div>
      </div>
    </div>
  );
}