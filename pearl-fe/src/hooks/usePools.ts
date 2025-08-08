'use client';

import { useState, useEffect } from 'react';
import { MOCK_POOLS } from '@/lib/constants';
import { Pool } from '@/types/common';

export const usePools = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPools = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPools(MOCK_POOLS);
      setLoading(false);
    };

    fetchPools();
  }, []);

  return {
    pools,
    loading,
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setPools(MOCK_POOLS);
        setLoading(false);
      }, 500);
    },
  };
};