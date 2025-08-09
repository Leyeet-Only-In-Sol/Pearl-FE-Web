import React from 'react'
import { TrendingUp, DollarSign, Users } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { PoolList } from '@/components/pool/PoolList'

export default function Home() {
  const stats = [
    { label: 'Total Value Locked', value: '$2.4B', icon: DollarSign },
    { label: '24h Volume', value: '$125M', icon: TrendingUp },
    { label: 'Active Users', value: '45K+', icon: Users },
  ]


  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1A1A1D] to-[#3B1C32]">
      <Navbar />
      <Hero />

      <div className="pt-32 pb-16">
        <div className="text-left">
            <h2 className="pl-40 pb-4 text-2xl font-semibold text-white">
              Explore the Pools
            </h2>
          </div>
        <PoolList />
      </div>
    </div>
  )
}