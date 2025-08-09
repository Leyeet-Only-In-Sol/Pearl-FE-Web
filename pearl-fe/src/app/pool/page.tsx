// pearl-fe/src/app/pool/page.tsx
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { PoolList } from '@/components/pool/PoolList';
import CreatePoolModal from '@/components/pool/CreatePoolModal';
import { Plus, Sparkles } from 'lucide-react';

export default function Pools() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handlePoolCreated = (poolId: string) => {
    console.log('🎉 New pool created:', poolId);
    setIsCreateModalOpen(false);
    alert('Pool created successfully! 🎉');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1A1A1D] to-[#3B1C32]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-semibold text-white mb-2">Liquidity Pools</h1>
            <p className="text-white/80">Provide liquidity and earn trading fees with zero slippage</p>
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

        <PoolList />
        
        <CreatePoolModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onPoolCreated={handlePoolCreated}
        />
      </div>
    </div>
  );
}