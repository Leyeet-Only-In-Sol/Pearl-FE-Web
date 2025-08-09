// pearl-fe/src/app/pool/page.tsx
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { PoolList } from '@/components/pool/PoolList';
import CreatePoolModal from '@/components/pool/CreatePoolModal';
import { Plus, Sparkles, Info } from 'lucide-react';
import { usePoolDiscovery } from '@/hooks/usePoolDiscovery';

export default function Pools() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { pools, totalCount, loading } = usePoolDiscovery();

  const handlePoolCreated = (poolId: string) => {
    console.log('🎉 New pool created:', poolId);
    setIsCreateModalOpen(false);
    
    // Show success message
    alert(`Pool created successfully! 🎉\nPool ID: ${poolId.slice(0, 8)}...${poolId.slice(-6)}`);
    
    // Auto-refresh pools after creation
    setTimeout(() => {
      window.location.reload(); // Simple refresh for now
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1A1A1D] to-[#3B1C32]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-semibold text-white mb-2">Liquidity Pools</h1>
            <p className="text-white/80">
              Real DLMM pools with zero slippage and dynamic fees
            </p>
            
            {/* Pool Stats */}
            {!loading && (
              <div className="mt-4 flex items-center space-x-6 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{totalCount} Active Pools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4" />
                  <span>Zero Slippage Trading</span>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              console.log('🔘 Create Pool button clicked!');
              setIsCreateModalOpen(true);
            }}
            className="
              bg-gradient-to-r from-[#A64D79] to-[#3B1C32]
              hover:from-[#B55D89] hover:to-[#4A2342]
              text-white font-semibold py-3 px-6 rounded-xl
              shadow-lg hover:shadow-xl
              transform hover:scale-105
              transition-all duration-300
              flex items-center space-x-2
            "
          >
            <Plus className="w-5 h-5" />
            <span>Create Pool</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="
          rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 
          backdrop-blur-sm border border-blue-500/20 p-4 mb-6
        ">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-blue-300 font-medium text-sm">Real DLMM Protocol Integration</div>
              <div className="text-blue-200/80 text-sm mt-1">
                These are real pools from your deployed factory contract. Each pool uses discrete price bins 
                for zero-slippage trading and dynamic fee adjustment based on market volatility.
              </div>
              <div className="text-blue-200/60 text-xs mt-2">
                Factory: {totalCount > 0 ? `${totalCount} pools discovered` : 'Scanning for pools...'}
              </div>
            </div>
          </div>
        </div>

        {/* Real Pool List */}
        <PoolList />
        
        {/* Create Pool Modal */}
        <CreatePoolModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPoolCreated={handlePoolCreated}
        />
      </div>
    </div>
  );
}