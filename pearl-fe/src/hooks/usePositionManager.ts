// pearl-fe/src/hooks/usePositionManager.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useDLMMClient } from './useDLMMClient';

export interface UserPosition {
  id: string;
  poolId: string;
  poolName: string;
  tokenA: { symbol: string; amount: string };
  tokenB: { symbol: string; amount: string };
  strategy: 'uniform' | 'curve' | 'spot';
  lowerBinId: number;
  upperBinId: number;
  activeBinId: number;
  inRange: boolean;
  totalValue: string;
  unclaimedFeesA: string;
  unclaimedFeesB: string;
  totalFeesEarned: string;
  createdAt: string;
  lastModified: string;
  isActive: boolean;
  roi: number; // Return on investment %
  apr: number; // Annual percentage rate %
}

export interface PositionAnalytics {
  totalPositions: number;
  totalValue: string;
  totalFeesEarned: string;
  activePositions: number;
  inRangePositions: number;
  averageROI: number;
  averageAPR: number;
}

interface PositionState {
  loading: boolean;
  error: string | null;
  positions: UserPosition[];
  analytics: PositionAnalytics | null;
  lastUpdated: string | null;
}

/**
 * Hook for managing user's liquidity positions
 */
export const usePositionManager = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { dlmmClient, isReady } = useDLMMClient();
  
  const [state, setState] = useState<PositionState>({
    loading: false,
    error: null,
    positions: [],
    analytics: null,
    lastUpdated: null
  });

  // ==================== FETCH POSITIONS ====================

  /**
   * Fetch all user positions with analytics
   */
  const fetchPositions = useCallback(async () => {
    if (!suiClient || !currentAccount || !dlmmClient || !isReady) {
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('📊 Fetching user positions...');

      // Get user positions from SDK
      const positionsResult = await dlmmClient.positions.getPositionsByOwner(currentAccount.address);
      
      // Enrich positions with additional data
      const enrichedPositions = await Promise.all(
        positionsResult.positions.map(async (position) => {
          try {
            // Get pool details
            const pool = await dlmmClient.pools.getPoolDetails(position.poolId);
            if (!pool) return null;

            // Calculate position metrics
            const analytics = await dlmmClient.positions.getPositionAnalytics(position.id);
            
            // Calculate values
            const totalValue = dlmmClient.positions.calculatePositionValue(
              position,
              pool.currentPrice,
              true
            );

            const inRange = pool.activeBinId >= position.lowerBinId && 
                           pool.activeBinId <= position.upperBinId;

            const totalFeesEarned = (
              parseInt(position.unclaimedFeesA || '0') + 
              parseInt(position.unclaimedFeesB || '0')
            ).toString();

            return {
              id: position.id,
              poolId: position.poolId,
              poolName: `${pool.tokenA.symbol}/${pool.tokenB.symbol}`,
              tokenA: {
                symbol: pool.tokenA.symbol,
                amount: position.totalLiquidityA
              },
              tokenB: {
                symbol: pool.tokenB.symbol,
                amount: position.totalLiquidityB
              },
              strategy: position.strategy,
              lowerBinId: position.lowerBinId,
              upperBinId: position.upperBinId,
              activeBinId: pool.activeBinId,
              inRange,
              totalValue,
              unclaimedFeesA: position.unclaimedFeesA,
              unclaimedFeesB: position.unclaimedFeesB,
              totalFeesEarned,
              createdAt: position.createdAt,
              lastModified: position.lastRebalance,
              isActive: position.isActive,
              roi: analytics?.metrics.roi || 0,
              apr: analytics?.metrics.apr || 0
            } as UserPosition;
          } catch (error) {
            console.warn(`Failed to enrich position ${position.id}:`, error);
            return null;
          }
        })
      );

      // Filter out failed enrichments
      const validPositions = enrichedPositions.filter((p): p is UserPosition => p !== null);

      // Calculate analytics
      const analytics = calculatePositionAnalytics(validPositions);

      setState(prev => ({
        ...prev,
        loading: false,
        positions: validPositions,
        analytics,
        lastUpdated: new Date().toISOString(),
        error: null
      }));

      console.log(`✅ Fetched ${validPositions.length} positions`);

    } catch (error) {
      console.error('❌ Error fetching positions:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch positions'
      }));
    }
  }, [suiClient, currentAccount, dlmmClient, isReady]);

  // ==================== POSITION ACTIONS ====================

  /**
   * Refresh a specific position
   */
  const refreshPosition = useCallback(async (positionId: string) => {
    if (!dlmmClient) return null;

    try {
      const position = await dlmmClient.positions.getPosition(positionId);
      if (!position) return null;

      // Update the position in state
      setState(prev => ({
        ...prev,
        positions: prev.positions.map(p => 
          p.id === positionId 
            ? { ...p, lastModified: new Date().toISOString() }
            : p
        )
      }));

      return position;
    } catch (error) {
      console.error('Error refreshing position:', error);
      return null;
    }
  }, [dlmmClient]);

  /**
   * Check if position needs rebalancing
   */
  const checkRebalanceNeeded = useCallback(async (positionId: string): Promise<boolean> => {
    if (!dlmmClient) return false;

    try {
      return await dlmmClient.positions.shouldRebalancePosition(positionId);
    } catch (error) {
      console.error('Error checking rebalance need:', error);
      return false;
    }
  }, [dlmmClient]);

  /**
   * Get position recommendations
   */
  const getPositionRecommendations = useCallback(async (
    poolId: string,
    riskProfile: 'conservative' | 'moderate' | 'aggressive' = 'moderate'
  ) => {
    if (!dlmmClient) return [];

    try {
      return await dlmmClient.positions.getPositionRecommendations(poolId, riskProfile);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }, [dlmmClient]);

  // ==================== AUTO REFRESH ====================

  /**
   * Auto-refresh positions every 30 seconds
   */
  useEffect(() => {
    if (!isReady || !currentAccount) return;

    // Initial fetch
    fetchPositions();

    // Set up auto-refresh
    const interval = setInterval(fetchPositions, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchPositions, isReady, currentAccount]);

  // ==================== DERIVED STATE ====================

  const sortedPositions = state.positions.sort((a, b) => {
    // Sort by total value descending
    return parseFloat(b.totalValue) - parseFloat(a.totalValue);
  });

  const activePositions = state.positions.filter(p => p.isActive);
  const inRangePositions = state.positions.filter(p => p.inRange);
  const needsRebalancing = state.positions.filter(p => !p.inRange);

  return {
    // State
    loading: state.loading,
    error: state.error,
    positions: sortedPositions,
    analytics: state.analytics,
    lastUpdated: state.lastUpdated,
    
    // Filtered positions
    activePositions,
    inRangePositions,
    needsRebalancing,
    
    // Actions
    fetchPositions,
    refreshPosition,
    checkRebalanceNeeded,
    getPositionRecommendations,
    
    // Utils
    isReady: !!(suiClient && currentAccount && dlmmClient && isReady),
    userAddress: currentAccount?.address
  };
};

// ==================== HELPER FUNCTIONS ====================

function calculatePositionAnalytics(positions: UserPosition[]): PositionAnalytics {
  if (positions.length === 0) {
    return {
      totalPositions: 0,
      totalValue: '0',
      totalFeesEarned: '0',
      activePositions: 0,
      inRangePositions: 0,
      averageROI: 0,
      averageAPR: 0
    };
  }

  const totalValue = positions.reduce((sum, p) => 
    sum + parseFloat(p.totalValue), 0
  );

  const totalFeesEarned = positions.reduce((sum, p) => 
    sum + parseFloat(p.totalFeesEarned), 0
  );

  const activePositions = positions.filter(p => p.isActive).length;
  const inRangePositions = positions.filter(p => p.inRange).length;

  const averageROI = positions.reduce((sum, p) => sum + p.roi, 0) / positions.length;
  const averageAPR = positions.reduce((sum, p) => sum + p.apr, 0) / positions.length;

  return {
    totalPositions: positions.length,
    totalValue: totalValue.toString(),
    totalFeesEarned: totalFeesEarned.toString(),
    activePositions,
    inRangePositions,
    averageROI,
    averageAPR
  };
}

// ==================== UTILITY HOOK FOR POSITION DETAILS ====================

/**
 * Hook for managing a single position
 */
export const usePosition = (positionId: string) => {
  const { positions, refreshPosition, checkRebalanceNeeded } = usePositionManager();
  const [needsRebalancing, setNeedsRebalancing] = useState<boolean | null>(null);

  const position = positions.find(p => p.id === positionId);

  // Check rebalancing status
  useEffect(() => {
    if (position) {
      checkRebalanceNeeded(positionId).then(setNeedsRebalancing);
    }
  }, [position, positionId, checkRebalanceNeeded]);

  return {
    position,
    needsRebalancing,
    refresh: () => refreshPosition(positionId),
    isLoading: !position,
    exists: !!position
  };
};