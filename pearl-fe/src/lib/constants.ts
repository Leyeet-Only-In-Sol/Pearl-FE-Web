import { Pool } from "@/types/common";

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Swap', href: '/swap' },
  { name: 'Pool', href: '/pool' },
  { name: 'Portfolio', href: '/portfolio' },
];

export const MOCK_POOLS: Pool[] = [
  {
    id: '1',
    name: 'ETH/USDC',
    token0: 'ETH',
    token1: 'USDC',
    tvl: 12500000,
    apr: 15.4,
    volume24h: 2100000,
    fees24h: 8500,
    priceRange: { min: 1800, max: 2200 }
  },
  {
    id: '2',
    name: 'BTC/USDT',
    token0: 'BTC',
    token1: 'USDT',
    tvl: 8900000,
    apr: 12.8,
    volume24h: 1850000,
    fees24h: 7200,
    priceRange: { min: 42000, max: 48000 }
  },
  {
    id: '3',
    name: 'SOL/USDC',
    token0: 'SOL',
    token1: 'USDC',
    tvl: 5600000,
    apr: 18.2,
    volume24h: 950000,
    fees24h: 4100,
    priceRange: { min: 95, max: 120 }
  },
];