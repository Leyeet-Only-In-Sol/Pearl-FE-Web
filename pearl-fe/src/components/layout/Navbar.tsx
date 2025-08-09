'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wallet, Menu, X } from 'lucide-react'
import Logo from '../../assets/pearl_logo.png'
import Image from 'next/image'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Swap', href: '/swap' },
    { name: 'Pools', href: '/pool' },
    { name: 'Portfolio', href: '/portfolio' },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white bg-opacity-20 backdrop-blur-md shadow-lg border-b border-white/10' 
          : 'bg-white bg-opacity-5 shadow-sm border-b border-white/10'
        }
        rounded-b-xl
      `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={Logo} alt="Pearl" className='h-12 w-12'/>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-[#A64D79]'
                    : 'text-white hover:text-[#A64D79]'
                } px-3 py-2 text-sm font-medium transform duration-300`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsConnected(!isConnected)}
              className="bg-white text-[#3B1C32] text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#A64D79] hover:text-white flex items-center space-x-2 duration-300"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnected ? '0x1234...5678' : 'Connect Wallet'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}