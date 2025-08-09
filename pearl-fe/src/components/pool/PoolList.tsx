// pearl-fe/src/components/pool/PoolList.tsx
'use client';

import React, { useState } from 'react';
import { RefreshCw, Search, Filter, Zap } from 'lucide-react';
import { usePoolDiscovery } from '@/hooks/usePoolDiscovery';
import PoolListItem from './PoolListItem';

interface PoolListProps {
  showCreateButton?: boolean;
}

export const PoolList: React.FC<PoolListProps> = ({ showCreateButton = false }) => {
  const { loading, error, pools, totalCount, refreshPools, isReady } = usePoolDiscovery();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // Filter pools based on search query and active filter
  const filteredPools = pools.filter(pool => {
    const matchesSearch = searchQuery === '' || 
      pool.tokenA.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.tokenB.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${pool.tokenA.symbol}/${pool.tokenB.symbol}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterActive === null || pool.isActive === filterActive;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search pools (ETH, BTC, SUI/USDC...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    block w-full pl-10 pr-3 py-3 rounded-lg
                    bg-white/10 backdrop-blur-sm border border-white/20
                    text-white placeholder-white/60
                    focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50
                    transition-all duration-300
                  "
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-3">
                {/* Active Filter */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilterActive(null)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${filterActive === null
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterActive(true)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${filterActive === true
                        ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/50'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterActive(false)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${filterActive === false
                        ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/50'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    Inactive
                  </button>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={refreshPools}
                  disabled={loading}
                  className="
                    flex items-center space-x-2 px-4 py-2 rounded-lg
                    bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30
                    text-white font-medium transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{filteredPools.length} pools displayed</span>
              </div>
              {totalCount !== filteredPools.length && (
                <span>({totalCount} total pools)</span>
              )}
              {searchQuery && (
                <span>Filtering by: "{searchQuery}"</span>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="
              rounded-xl bg-red-500/10 backdrop-blur-sm border border-red-500/20 p-4 mb-6
            ">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <div>
                  <div className="text-red-300 font-medium">Failed to load pools</div>
                  <div className="text-red-200 text-sm">{error}</div>
                </div>
                <button
                  onClick={refreshPools}
                  className="
                    ml-auto px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30
                    text-red-300 text-sm font-medium transition-colors duration-200
                  "
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="
              rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 mb-6
              flex items-center justify-center
            ">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-white">Discovering pools from factory...</span>
              </div>
            </div>
          )}

          {/* Pools List Container */}
          {!loading && (
            <div className="
              rounded-2xl bg-white/10 backdrop-blur-md 
              shadow-xl ring-1 ring-white/20
              overflow-hidden
            ">
              {/* Table Header */}
              <div className="
                bg-white/5 backdrop-blur-sm border-b border-white/10
                px-6 py-4
              ">
                <div className="grid grid-cols-2 md:grid-cols-5">
                  <div className="text-white/90 font-medium text-sm">Pool</div>
                  <div className="hidden md:block text-white/90 text-right font-medium text-sm">TVL</div>
                  <div className="hidden md:block text-white/90 text-right font-medium text-sm">Fee Tier</div>
                  <div className="hidden md:block text-white/90 text-right font-medium text-sm">Status</div>
                  <div className="text-white/90 font-medium text-sm text-right">Actions</div>
                </div>
              </div>
              
              {/* Pools List */}
              <div className="divide-y divide-white/10">
                {filteredPools.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    {searchQuery || filterActive !== null ? (
                      <>
                        <div className="text-white/60 text-lg mb-2">No pools match your filters</div>
                        <div className="text-white/40 text-sm">Try adjusting your search or filters</div>
                      </>
                    ) : (
                      <>
                        <div className="text-white/60 text-lg mb-2">No pools found</div>
                        <div className="text-white/40 text-sm">
                          {isReady ? 'Create the first pool to get started' : 'Connecting to factory...'}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  filteredPools.map((pool) => (
                    <RealPoolListItem key={pool.id} pool={pool} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Enhanced Pool List Item for real pool data
interface RealPoolListItemProps {
  pool: {
    id: string;
    tokenA: { symbol: string; coinType: string };
    tokenB: { symbol: string; coinType: string };
    binStep: number;
    reserveA: string;
    reserveB: string;
    tvl: string;
    isActive: boolean;
  };
}

const RealPoolListItem: React.FC<RealPoolListItemProps> = ({ pool }) => {
  const formatAmount = (amount: string) => {
    const num = parseInt(amount);
    if (num === 0) return '0';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  const feePercentage = (pool.binStep / 100).toFixed(2);

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
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center relative z-10">
        
        {/* Pool Info */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <div className="
              w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center 
              text-white text-sm font-bold ring-2 ring-white/20
              group-hover:ring-white/40 transition-all duration-300
            ">
              {pool.tokenA.symbol.charAt(0)}
            </div>
            <div className="
              w-8 h-8 bg-green-500 rounded-full flex items-center justify-center 
              text-white text-sm font-bold border-2 border-white/20
              group-hover:border-white/40 transition-all duration-300
            ">
              {pool.tokenB.symbol.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="
              font-semibold text-white group-hover:text-blue-100
              transition-colors duration-300
            ">
              {pool.tokenA.symbol}/{pool.tokenB.symbol}
            </h3>
            <div className="text-white/60 text-sm">Real DLMM Pool</div>
          </div>
        </div>
        
        {/* TVL - Hidden on mobile */}
        <div className="hidden md:block">
          <div className="
            text-white text-right group-hover:text-blue-100 font-medium
            transition-colors duration-300
          ">
            ${formatAmount(pool.tvl)}
          </div>
        </div>
        
        {/* Fee Tier - Hidden on mobile */}
        <div className="hidden md:block text-right">
          <span className="
            bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-semibold
            group-hover:bg-purple-400/30 group-hover:text-purple-200
            transition-all duration-300
          ">
            {feePercentage}%
          </span>
        </div>
        
        {/* Status - Hidden on mobile */}
        <div className="hidden md:block text-right">
          <span className={`
            px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300
            ${pool.isActive 
              ? 'bg-green-500/20 text-green-300 group-hover:bg-green-400/30 group-hover:text-green-200'
              : 'bg-red-500/20 text-red-300 group-hover:bg-red-400/30 group-hover:text-red-200'
            }
          `}>
            {pool.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        {/* Action Button */}
        <div className="text-right">
          <button className="
            bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg 
            font-medium text-sm border border-white/30
            hover:bg-white/30 hover:border-white/50 hover:scale-105
            transition-all duration-300
            group-hover:shadow-lg
          ">
            Trade
          </button>
        </div>
      </div>
      
      {/* Mobile Info - Shown only on mobile */}
      <div className="md:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
        <div>
          <div className="text-white/60 text-xs">TVL</div>
          <div className="text-white font-medium text-sm">${formatAmount(pool.tvl)}</div>
        </div>
        <div>
          <div className="text-white/60 text-xs">Fee Tier</div>
          <div className="text-purple-300 font-semibold text-sm">{feePercentage}%</div>
        </div>
        <div>
          <div className="text-white/60 text-xs">Status</div>
          <div className={`font-semibold text-sm ${pool.isActive ? 'text-green-300' : 'text-red-300'}`}>
            {pool.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div>
          <div className="text-white/60 text-xs">Pool ID</div>
          <div className="text-white font-mono text-xs">
            {pool.id.slice(0, 8)}...{pool.id.slice(-6)}
          </div>
        </div>
      </div>
      
      {/* Bottom glow line on hover */}
      <div className="
        absolute bottom-0 left-0 right-0 h-px
        bg-gradient-to-r from-transparent via-white/50 to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      "></div>
    </div>
  );
};