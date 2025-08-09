// pearl-fe/src/hooks/useDLMMClient.ts
'use client';

import { useMemo, useCallback } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { DLMMClient, createTestnetClient, type DLMMClientConfig } from '@/lib/Pearl-TS-SDK/src';

/**
 * Enhanced DLMM client hook with full SDK integration
 * Provides access to all DLMM managers and utilities
 */
export const useDLMMClient = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  // Create DLMM client instance with your deployed contracts
  const dlmmClient = useMemo(() => {
    if (!suiClient) {
      console.log('⏳ Sui client not available yet');
      return null;
    }
    
    try {
      // Use your SDK's testnet client factory
      const client = createTestnetClient(suiClient);
      
      console.log('🚀 DLMM Client created successfully:', {
        packageId: client.addresses.PACKAGE_ID,
        factoryId: client.addresses.FACTORY_ID,
        network: client.network,
        isConfigured: client.isConfigured()
      });
      
      return client;
    } catch (error) {
      console.error('❌ Failed to create DLMM client:', error);
      return null;
    }
  }, [suiClient]);

  // Check if client is ready for operations
  const isReady = useMemo(() => {
    return !!(dlmmClient && currentAccount && dlmmClient.isConfigured());
  }, [dlmmClient, currentAccount]);

  // Enhanced network info
  const networkInfo = useMemo(() => {
    if (!dlmmClient) return null;
    return {
      ...dlmmClient.getNetworkInfo(),
      userAddress: currentAccount?.address,
      isConnected: !!currentAccount
    };
  }, [dlmmClient, currentAccount]);

  // Utility functions for common operations
  const utils = useMemo(() => {
    if (!dlmmClient) return null;

    return {
      // Format amounts for display
      formatAmount: (amount: string, decimals: number = 9) => 
        dlmmClient.formatCoinAmount(amount, decimals),
      
      // Parse user input to contract units
      parseAmount: (amount: string, decimals: number = 9) => 
        dlmmClient.parseCoinAmount(amount, decimals),
      
      // Validate addresses
      isValidAddress: (address: string) => 
        dlmmClient.isValidObjectId(address),
      
      // Get protocol stats
      getProtocolStats: async () => {
        try {
          return await dlmmClient.getProtocolStats();
        } catch (error) {
          console.error('Error fetching protocol stats:', error);
          return null;
        }
      }
    };
  }, [dlmmClient]);

  // Manager access with null safety
  const managers = useMemo(() => {
    if (!dlmmClient) return null;

    return {
      factory: dlmmClient.factory,
      pools: dlmmClient.pools,
      positions: dlmmClient.positions,
      quoter: dlmmClient.quoter,
      router: dlmmClient.router
    };
  }, [dlmmClient]);

  // Quick access methods for common operations
  const quickActions = useMemo(() => {
    if (!dlmmClient || !currentAccount) return null;

    return {
      // Get all pools
      getAllPools: useCallback(async () => {
        try {
          return await dlmmClient.getAllPools();
        } catch (error) {
          console.error('Error fetching pools:', error);
          return [];
        }
      }, [dlmmClient]),

      // Find best pool for token pair
      findBestPool: useCallback(async (tokenA: string, tokenB: string) => {
        try {
          return await dlmmClient.findBestPool(tokenA, tokenB);
        } catch (error) {
          console.error('Error finding best pool:', error);
          return null;
        }
      }, [dlmmClient]),

      // Get quote
      getQuote: useCallback(async (tokenIn: string, tokenOut: string, amountIn: string) => {
        try {
          return await dlmmClient.getQuote({ tokenIn, tokenOut, amountIn });
        } catch (error) {
          console.error('Error getting quote:', error);
          throw error;
        }
      }, [dlmmClient]),

      // Get user positions (when position discovery is implemented)
      getUserPositions: useCallback(async () => {
        try {
          if (!currentAccount?.address) return [];
          return await dlmmClient.positions.getPositionsByOwner(currentAccount.address);
        } catch (error) {
          console.error('Error fetching user positions:', error);
          return { positions: [], totalCount: 0, hasMore: false };
        }
      }, [dlmmClient, currentAccount])
    };
  }, [dlmmClient, currentAccount]);

  return {
    // Core client
    dlmmClient,
    isReady,
    networkInfo,
    
    // Manager access
    managers,
    
    // Utilities
    utils,
    
    // Quick actions
    quickActions,
    
    // Connection state
    isConnected: !!currentAccount,
    userAddress: currentAccount?.address,
    
    // SDK version info
    sdkInfo: dlmmClient ? {
      name: 'pearl-dlmm-sdk',
      version: '1.0.0',
      protocolVersion: '1.0.0'
    } : null
  };
};