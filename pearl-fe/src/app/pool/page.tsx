import Navbar from '@/components/layout/Navbar'
import { PoolList } from '@/components/pool/PoolList'
import React from 'react'

export default function Pools() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1A1A1D] to-[#3B1C32]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="ml-8 mb-6">
          <h1 className="text-3xl font-semibold text-white mb-2">Liquidity Pools</h1>
          <p className="text-white">Provide liquidity and earn trading fees</p>
        </div>
        
        <PoolList />
      </div>
    </div>
  )
}