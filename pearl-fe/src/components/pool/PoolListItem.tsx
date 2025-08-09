import React from 'react'

interface PoolListItemProps {
  name: string
  token1: string
  token2: string
  tvl: string
  apr: string
  volume: string
}

export default function PoolListItem({ name, token1, token2, tvl, apr, volume }: PoolListItemProps) {
  return (
    <div className="
      group relative overflow-hidden
      px-6 py-4 transition-all duration-300
      hover:bg-white/10 hover:backdrop-blur-lg
      cursor-pointer
    ">
      {/* Glass reflection effect on hover */}
      <div className="
        absolute inset-0 opacity-0 group-hover:opacity-100
        bg-gradient-to-r from-white/10 via-transparent to-transparent
        transition-opacity duration-300
      "></div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center relative z-10">
        
        {/* Pool Info */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <div className="
              w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center 
              text-white text-sm font-bold ring-2 ring-white/20
              group-hover:ring-white/40 transition-all duration-300
            ">
              {token1.charAt(0)}
            </div>
            <div className="
              w-8 h-8 bg-green-500 rounded-full flex items-center justify-center 
              text-white text-sm font-bold border-2 border-white/20
              group-hover:border-white/40 transition-all duration-300
            ">
              {token2.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="
              font-semibold text-white group-hover:text-blue-100
              transition-colors duration-300
            ">
              {name}
            </h3>
            <div className="text-white/60 text-sm">Liquidity Pool</div>
          </div>
        </div>
        
        {/* TVL - Hidden on mobile */}
        <div className="hidden md:block">
          <div className="
            text-white text-right group-hover:text-blue-100 font-medium
            transition-colors duration-300
          ">
            {tvl}
          </div>
        </div>
        
        {/* APR - Hidden on mobile */}
        <div className="hidden md:block text-right">
          <span className="
            bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold
            group-hover:bg-green-400/30 group-hover:text-green-200
            transition-all duration-300
          ">
            {apr} APR
          </span>
        </div>
        
        {/* Volume - Hidden on mobile */}
        <div className="hidden md:block">
          <div className="
            text-white/90 text-right group-hover:text-white font-medium
            transition-colors duration-300
          ">
            {volume}
          </div>
        </div>
        
        {/* Action Button */}
        {/* <div className="text-right">
          <button className="
            bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg 
            font-medium text-sm border border-white/30
            hover:bg-white/30 hover:border-white/50 hover:scale-105
            transition-all duration-300
            group-hover:shadow-lg
          ">
            Add Liquidity
          </button>
        </div> */}
      </div>
      
      {/* Mobile Info - Shown only on mobile */}
      {/* <div className="md:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
        <div>
          <div className="text-white/60 text-xs">TVL</div>
          <div className="text-white font-medium text-sm">{tvl}</div>
        </div>
        <div>
          <div className="text-white/60 text-xs">24h Volume</div>
          <div className="text-white font-medium text-sm">{volume}</div>
        </div>
        <div>
          <div className="text-white/60 text-xs">APR</div>
          <div className="text-green-300 font-semibold text-sm">{apr}</div>
        </div>
      </div> */}
      
      {/* Bottom glow line on hover */}
      <div className="
        absolute bottom-0 left-0 right-0 h-px
        bg-gradient-to-r from-transparent via-white/50 to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      "></div>
    </div>
  )
}