'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NAVIGATION_ITEMS } from '@/lib/constants';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    setIsConnected(!isConnected);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">DeFiLabs</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <Button
              onClick={handleConnectWallet}
              variant={isConnected ? 'outline' : 'primary'}
              className="flex items-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnected ? '0x1234...5678' : 'Connect Wallet'}</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Button
                  onClick={handleConnectWallet}
                  variant={isConnected ? 'outline' : 'primary'}
                  className="w-full flex items-center justify-center space-x-2"
                  size="sm"
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isConnected ? '0x1234...5678' : 'Connect Wallet'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};