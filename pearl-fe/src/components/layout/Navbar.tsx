'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, Menu, X, LogOut } from 'lucide-react'
import { useWalletConnection } from '@/hooks/useWalletConnection'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { 
    isConnected, 
    formattedAddress, 
    connectWithGoogle, 
    disconnectWallet,
    googleWallet 
  } = useWalletConnection()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Swap', href: '/swap' },
    { name: 'Pools', href: '/pool' },
    { name: 'Portfolio', href: '/portfolio' },
  ]

  const handleConnect = () => {
    if (googleWallet) {
      connectWithGoogle()
    } else {
      console.log('Google wallet not available')
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="font-bold text-xl">DeFi</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                } px-3 py-2 text-sm font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop wallet button */}
          <div className="hidden md:flex items-center">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center space-x-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-medium">{formattedAddress}</span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                disabled={!googleWallet}
              >
                <Wallet className="w-4 h-4" />
                <span>Connect with Google</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700'
                  } block px-3 py-2 text-base font-medium`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile wallet section */}
              <div className="pt-4 border-t border-gray-200">
                {isConnected ? (
                  <div className="space-y-2">
                    <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center space-x-2">
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm font-medium">{formattedAddress}</span>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    disabled={!googleWallet}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect with Google</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}