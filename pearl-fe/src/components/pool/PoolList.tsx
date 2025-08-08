'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, SortAsc, SortDesc, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { MOCK_POOLS } from '@/lib/constants';
import { Pool } from '@/types/common';

type SortField = 'name' | 'tvl' | 'apr' | 'volume24h' | 'fees24h';
type SortDirection = 'asc' | 'desc';

export const PoolList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('tvl');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (poolId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(poolId)) {
        newFavorites.delete(poolId);
      } else {
        newFavorites.add(poolId);
      }
      return newFavorites;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedPools = useMemo(() => {
    let filtered = MOCK_POOLS.filter(pool =>
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.token0.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.token1.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'tvl':
          aValue = a.tvl;
          bValue = b.tvl;
          break;
        case 'apr':
          aValue = a.apr;
          bValue = b.apr;
          break;
        case 'volume24h':
          aValue = a.volume24h;
          bValue = b.volume24h;
          break;
        case 'fees24h':
          aValue = a.fees24h;
          bValue = b.fees24h;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue as string)
          : (bValue as string).localeCompare(aValue);
      }

      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return filtered;
  }, [searchQuery, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search pools..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-1"
        />
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Table Header */}
      <Card className="overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center text-sm font-medium text-gray-700">
            <button
              onClick={() => handleSort('name')}
              className="flex items-center space-x-2 hover:text-primary-600 transition-colors"
            >
              <span>Pool</span>
              <SortIcon field="name" />
            </button>
            <button
              onClick={() => handleSort('tvl')}
              className="hidden md:flex items-center space-x-2 hover:text-primary-600 transition-colors"
            >
              <span>TVL</span>
              <SortIcon field="tvl" />
            </button>
            <button
              onClick={() => handleSort('apr')}
              className="hidden md:flex items-center space-x-2 hover:text-primary-600 transition-colors"
            >
              <span>APR</span>
              <SortIcon field="apr" />
            </button>
            <button
              onClick={() => handleSort('volume24h')}
              className="hidden md:flex items-center space-x-2 hover:text-primary-600 transition-colors"
            >
              <span>24h Volume</span>
              <SortIcon field="volume24h" />
            </button>
            <button
              onClick={() => handleSort('fees24h')}
              className="hidden md:flex items-center space-x-2 hover:text-primary-600 transition-colors"
            >
              <span>24h Fees</span>
              <SortIcon field="fees24h" />
            </button>
            <span className="hidden md:block text-center">Action</span>
          </div>
        </div>

        {/* Pool List */}
        <div className="divide-y divide-gray-200">
          {filteredAndSortedPools.map((pool) => (
            <div key={pool.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                {/* Pool Name */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleFavorite(pool.id)}
                    className={`p-1 rounded-full transition-colors ${
                      favorites.has(pool.id) 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${favorites.has(pool.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {pool.token0.charAt(0)}
                    </div>
                    <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {pool.token1.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{pool.name}</h3>
                    <p className="text-sm text-gray-500">DLMM Pool</p>
                  </div>
                </div>

                {/* TVL */}
                <div className="hidden md:block">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(pool.tvl)}
                  </div>
                </div>

                {/* APR */}
                <div className="hidden md:block">
                  <div className={`font-semibold ${
                    pool.apr > 15 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {formatPercentage(pool.apr)}
                  </div>
                </div>

                {/* 24h Volume */}
                <div className="hidden md:block">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(pool.volume24h)}
                  </div>
                </div>

                {/* 24h Fees */}
                <div className="hidden md:block">
                  <div className="font-semibold text-green-600">
                    {formatCurrency(pool.fees24h)}
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-center">
                  <Link href={`/add-liquidity/${pool.id}`}>
                    <Button size="sm">Add Liquidity</Button>
                  </Link>
                </div>
              </div>

              {/* Mobile View */}
              <div className="md:hidden mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">TVL:</span>
                  <span className="font-semibold">{formatCurrency(pool.tvl)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">APR:</span>
                  <span className={`font-semibold ${
                    pool.apr > 15 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {formatPercentage(pool.apr)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">24h Volume:</span>
                  <span className="font-semibold">{formatCurrency(pool.volume24h)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">24h Fees:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(pool.fees24h)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {filteredAndSortedPools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No pools found matching your search.</p>
        </div>
      )}
    </div>
  );
};