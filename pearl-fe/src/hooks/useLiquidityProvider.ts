// pearl-fe/src/hooks/useLiquidityProvider.ts
'use client';

import { useState, useCallback } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useDLMMClient } from './useDLMMClient';

export interface AddLiquidityParams {
  poolId: string;
  tokenA: string;
  tokenB: string;
  amountA: string;
  amountB: string;
  strategy: 'uniform' | 'curve' | 'spot';
  lowerBinId?: number;
  upperBinId?: number;
  slippageTolerance?: number; // basis points (default: 50 = 0.5%)
}

export interface RemoveLiquidityParams {
  positionId: string;
  percentage: number; // 1-100
  minAmountA?: string;
  minAmountB?: string;
}

export interface LiquidityResult {
  positionId: string;
  actualAmountA: string;
  actualAmountB: string;
  sharesIssued: string;
  transactionDigest: string;
  success: boolean;
  error?: string;
}

interface LiquidityState {
  loading: boolean;
  error: string | null;
  lastResult: LiquidityResult | null;
}

/**
 * Hook for managing liquidity positions using the DLMM SDK
 */
export const useLiquidityProvider = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { dlmmClient, isReady } = useDLMMClient();
  
  const [state, setState] = useState<LiquidityState>({
    loading: false,
    error: null,
    lastResult: null
  });

  // ==================== ADD LIQUIDITY ====================

  /**
   * Add liquidity to a DLMM pool
   */
  const addLiquidity = useCallback(async (params: AddLiquidityParams) => {
    if (!suiClient || !currentAccount || !dlmmClient || !isReady) {
      setState(prev => ({ ...prev, error: 'Wallet not connected or SDK not ready' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🏊 Adding liquidity to pool:', params.poolId);

      // Get user's coin objects
      const [coinAObjects, coinBObjects] = await Promise.all([
        suiClient.getCoins({
          owner: currentAccount.address,
          coinType: params.tokenA
        }),
        suiClient.getCoins({
          owner: currentAccount.address,
          coinType: params.tokenB
        })
      ]);

      // Find coins with sufficient balance
      const coinAObject = coinAObjects.data.find(coin => 
        parseInt(coin.balance) >= parseInt(params.amountA)
      );
      const coinBObject = coinBObjects.data.find(coin => 
        parseInt(coin.balance) >= parseInt(params.amountB)
      );

      if (!coinAObject) {
        throw new Error(`Insufficient ${getTokenSymbol(params.tokenA)} balance`);
      }
      if (!coinBObject) {
        throw new Error(`Insufficient ${getTokenSymbol(params.tokenB)} balance`);
      }

      // Get pool details to determine bin range
      const pool = await dlmmClient.pools.getPoolDetails(params.poolId);
      if (!pool) {
        throw new Error('Pool not found');
      }

      // Calculate bin range based on strategy
      const { lowerBinId, upperBinId } = calculateBinRange(
        pool.activeBinId,
        params.strategy,
        params.lowerBinId,
        params.upperBinId
      );

      console.log('📊 Calculated bin range:', { lowerBinId, upperBinId, activeBin: pool.activeBinId });

      // Create position using SDK
      const positionParams = {
        poolId: params.poolId,
        tokenA: params.tokenA,
        tokenB: params.tokenB,
        amountA: params.amountA,
        amountB: params.amountB,
        lowerBinId,
        upperBinId,
        strategy: params.strategy
      };

      // Build transaction
      const txb = new Transaction();
      
      // Create position using your deployed contract
      txb.moveCall({
        target: `${dlmmClient.addresses.PACKAGE_ID}::position_manager::create_position_with_liquidity`,
        typeArguments: [params.tokenA, params.tokenB],
        arguments: [
          txb.object(params.poolId),
          txb.object(coinAObject.coinObjectId),
          txb.object(coinBObject.coinObjectId),
          txb.pure.u32(lowerBinId),
          txb.pure.u32(upperBinId),
          txb.pure.u8(strategyToNumber(params.strategy)),
          txb.object('0x6'), // Clock object
        ],
      });

      // Execute transaction
      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: (result) => {
            console.log('✅ Liquidity added successfully:', result);
            const liquidityResult = parseLiquidityResult(result, params);
            setState(prev => ({
              ...prev,
              loading: false,
              lastResult: liquidityResult,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error adding liquidity:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to add liquidity'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building liquidity transaction:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to build transaction'
      }));
    }
  }, [suiClient, currentAccount, dlmmClient, isReady, signAndExecuteTransaction]);

  // ==================== REMOVE LIQUIDITY ====================

  /**
   * Remove liquidity from a position
   */
  const removeLiquidity = useCallback(async (params: RemoveLiquidityParams) => {
    if (!suiClient || !currentAccount || !dlmmClient || !isReady) {
      setState(prev => ({ ...prev, error: 'Wallet not connected or SDK not ready' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🏊 Removing liquidity from position:', params.positionId);

      const txb = new Transaction();
      
      // Remove liquidity using position manager
      txb.moveCall({
        target: `${dlmmClient.addresses.PACKAGE_ID}::position_manager::remove_liquidity_percentage`,
        typeArguments: ['TokenA', 'TokenB'], // Would be extracted from position
        arguments: [
          txb.object(params.positionId),
          txb.pure.u8(params.percentage),
          txb.object('0x6'), // Clock object
        ],
      });

      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: (result) => {
            console.log('✅ Liquidity removed successfully:', result);
            const liquidityResult = parseRemoveLiquidityResult(result, params);
            setState(prev => ({
              ...prev,
              loading: false,
              lastResult: liquidityResult,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error removing liquidity:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to remove liquidity'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building remove liquidity transaction:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to build transaction'
      }));
    }
  }, [suiClient, currentAccount, dlmmClient, isReady, signAndExecuteTransaction]);

  // ==================== COLLECT FEES ====================

  /**
   * Collect accumulated fees from a position
   */
  const collectFees = useCallback(async (positionId: string) => {
    if (!suiClient || !currentAccount || !dlmmClient || !isReady) {
      setState(prev => ({ ...prev, error: 'Wallet not connected or SDK not ready' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('💰 Collecting fees from position:', positionId);

      const txb = new Transaction();
      
      // Collect fees using position manager
      txb.moveCall({
        target: `${dlmmClient.addresses.PACKAGE_ID}::position_manager::collect_all_fees`,
        typeArguments: ['TokenA', 'TokenB'], // Would be extracted from position
        arguments: [
          txb.object(positionId),
          txb.object('0x6'), // Clock object
        ],
      });

      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: (result) => {
            console.log('✅ Fees collected successfully:', result);
            setState(prev => ({
              ...prev,
              loading: false,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error collecting fees:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to collect fees'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building collect fees transaction:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to build transaction'
      }));
    }
  }, [suiClient, currentAccount, dlmmClient, isReady, signAndExecuteTransaction]);

  // ==================== GET USER POSITIONS ====================

  /**
   * Get all positions for the current user
   */
  const getUserPositions = useCallback(async () => {
    if (!suiClient || !currentAccount || !dlmmClient) {
      return [];
    }

    try {
      console.log('📋 Fetching user positions...');
      
      // This would query user's owned position objects
      // For now, using a simplified approach
      const positions = await dlmmClient.positions.getPositionsByOwner(currentAccount.address);
      return positions.positions;
    } catch (error) {
      console.error('❌ Error fetching user positions:', error);
      return [];
    }
  }, [suiClient, currentAccount, dlmmClient]);

  // ==================== CALCULATE POSITION VALUE ====================

  /**
   * Calculate current value of a position
   */
  const calculatePositionValue = useCallback(async (positionId: string) => {
    if (!dlmmClient) return null;

    try {
      const position = await dlmmClient.positions.getPosition(positionId);
      if (!position) return null;

      // Get current pool price for valuation
      const pool = await dlmmClient.pools.getPoolDetails(position.poolId);
      if (!pool) return null;

      // Calculate position value using SDK utility
      const value = dlmmClient.positions.calculatePositionValue(
        position,
        pool.currentPrice,
        true // Value in token A
      );

      return {
        totalValue: value,
        liquidityA: position.totalLiquidityA,
        liquidityB: position.totalLiquidityB,
        unclaimedFeesA: position.unclaimedFeesA,
        unclaimedFeesB: position.unclaimedFeesB,
        inRange: pool.activeBinId >= position.lowerBinId && pool.activeBinId <= position.upperBinId
      };
    } catch (error) {
      console.error('❌ Error calculating position value:', error);
      return null;
    }
  }, [dlmmClient]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    lastResult: state.lastResult,
    
    // Actions
    addLiquidity,
    removeLiquidity,
    collectFees,
    getUserPositions,
    calculatePositionValue,
    
    // Utils
    isReady: !!(suiClient && currentAccount && dlmmClient && isReady),
    userAddress: currentAccount?.address
  };
};

// ==================== HELPER FUNCTIONS ====================

function getTokenSymbol(coinType: string): string {
  const parts = coinType.split('::');
  const symbol = parts[parts.length - 1] || 'UNKNOWN';
  
  // Handle special cases
  if (symbol === 'SUI') return 'SUI';
  if (symbol === 'TEST_USDC') return 'USDC';
  
  return symbol.toUpperCase();
}

function calculateBinRange(
  activeBinId: number,
  strategy: 'uniform' | 'curve' | 'spot',
  lowerBinId?: number,
  upperBinId?: number
): { lowerBinId: number; upperBinId: number } {
  // If manual range provided, use it
  if (lowerBinId !== undefined && upperBinId !== undefined) {
    return { lowerBinId, upperBinId };
  }

  // Calculate range based on strategy
  let range: number;
  switch (strategy) {
    case 'spot':
      range = 2; // Very tight range
      break;
    case 'curve':
      range = 5; // Medium range
      break;
    case 'uniform':
    default:
      range = 10; // Wide range
      break;
  }

  return {
    lowerBinId: Math.max(0, activeBinId - range),
    upperBinId: activeBinId + range
  };
}

function strategyToNumber(strategy: 'uniform' | 'curve' | 'spot'): number {
  switch (strategy) {
    case 'uniform': return 0;
    case 'curve': return 1;
    case 'spot': return 2;
    default: return 0;
  }
}

function parseLiquidityResult(result: any, params: AddLiquidityParams): LiquidityResult {
  try {
    let positionId = '';
    let sharesIssued = '0';

    // Extract position ID from object changes
    if (result.objectChanges) {
      for (const change of result.objectChanges) {
        if (change.type === 'created' && change.objectType?.includes('Position')) {
          positionId = change.objectId;
          break;
        }
      }
    }

    // Extract shares from events
    if (result.events) {
      for (const event of result.events) {
        if (event.type.includes('LiquidityAdded') || event.type.includes('PositionCreated')) {
          const eventData = event.parsedJson;
          sharesIssued = eventData?.shares_minted || eventData?.shares_issued || '0';
          break;
        }
      }
    }

    return {
      positionId,
      actualAmountA: params.amountA,
      actualAmountB: params.amountB,
      sharesIssued,
      transactionDigest: result.digest,
      success: result.effects?.status?.status === 'success',
      error: result.effects?.status?.status === 'failure' ? 
        (result.effects?.status?.error || 'Unknown error') : undefined
    };
  } catch (error) {
    return {
      positionId: '',
      actualAmountA: '0',
      actualAmountB: '0',
      sharesIssued: '0',
      transactionDigest: result.digest || '',
      success: false,
      error: `Failed to parse result: ${error}`
    };
  }
}

function parseRemoveLiquidityResult(result: any, params: RemoveLiquidityParams): LiquidityResult {
  try {
    let actualAmountA = '0';
    let actualAmountB = '0';
    let sharesIssued = '0'; // shares burned in this case

    // Extract amounts from events
    if (result.events) {
      for (const event of result.events) {
        if (event.type.includes('LiquidityRemoved')) {
          const eventData = event.parsedJson;
          actualAmountA = eventData?.amount_a || '0';
          actualAmountB = eventData?.amount_b || '0';
          sharesIssued = eventData?.shares_burned || '0';
          break;
        }
      }
    }

    return {
      positionId: params.positionId,
      actualAmountA,
      actualAmountB,
      sharesIssued,
      transactionDigest: result.digest,
      success: result.effects?.status?.status === 'success',
      error: result.effects?.status?.status === 'failure' ? 
        (result.effects?.status?.error || 'Unknown error') : undefined
    };
  } catch (error) {
    return {
      positionId: params.positionId,
      actualAmountA: '0',
      actualAmountB: '0',
      sharesIssued: '0',
      transactionDigest: result.digest || '',
      success: false,
      error: `Failed to parse result: ${error}`
    };
  }
}