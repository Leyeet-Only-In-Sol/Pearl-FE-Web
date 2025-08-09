import React from 'react'
import { ArrowDownUp } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

export default function Swap() {
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
            Swap Tokens
          </h2>
          
          <div className="space-y-4 relative z-10">
            {/* From Token */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">From</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.0"
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
                  <select className="
                    bg-white/20 backdrop-blur-sm border border-white/30 
                    rounded-lg px-3 py-1 text-sm text-white
                    focus:ring-2 focus:ring-blue-400/50
                    transition-all duration-300
                  ">
                    <option className="bg-gray-800 text-white">ETH</option>
                    <option className="bg-gray-800 text-white">USDC</option>
                    <option className="bg-gray-800 text-white">BTC</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-white/70 mt-1">Balance: 2.5 ETH</div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center">
              <button className="
                p-3 rounded-full
                bg-white/20 backdrop-blur-sm border border-white/30
                hover:bg-white/30 hover:border-white/50 hover:scale-110
                transition-all duration-300
                group
              ">
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
                  <select className="
                    bg-white/20 backdrop-blur-sm border border-white/30 
                    rounded-lg px-3 py-1 text-sm text-white
                    focus:ring-2 focus:ring-blue-400/50
                    transition-all duration-300
                  ">
                    <option className="bg-gray-800 text-white">USDC</option>
                    <option className="bg-gray-800 text-white">ETH</option>
                    <option className="bg-gray-800 text-white">BTC</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-white/70 mt-1">Balance: 5,000 USDC</div>
            </div>

            {/* Swap Details */}
            <div className="
              bg-white/5 backdrop-blur-sm border border-white/10
              rounded-lg p-4 space-y-2
            ">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Exchange Rate</span>
                <span className="text-white">1 ETH = 2,000 USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Slippage</span>
                <span className="text-white">0.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Gas Fee</span>
                <span className="text-white">~$8.50</span>
              </div>
            </div>

            {/* Swap Button */}
            <button className="
              w-full py-4 rounded-lg font-semibold mt-6
              bg-white/10 backdrop-blur-sm border border-white/30
              text-white hover:bg-white/20 hover:border-white/40
              hover:scale-[1.02] hover:shadow-xl
              transition-all duration-300
              relative overflow-hidden group
            ">
              <span className="relative z-10">Swap</span>
              
              {/* Subtle shine effect */}
              <div className="
                absolute inset-0 opacity-0 group-hover:opacity-100
                bg-gradient-to-r from-transparent via-white/10 to-transparent
                transform -skew-x-12 translate-x-full group-hover:-translate-x-full
                transition-transform duration-700
              "></div>
            </button>
          </div>
          
          {/* Bottom glow line */}
          <div className="
            absolute bottom-0 left-0 right-0 h-px
            bg-gradient-to-r from-transparent via-white/50 to-transparent
          "></div>
        </div>
      </div>
    </div>
  )
}