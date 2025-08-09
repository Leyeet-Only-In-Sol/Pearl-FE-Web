// pearl-fe/src/hooks/useDLMMClient.ts
'use client';

import { useMemo } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSuiClient } from '@mysten/dapp-kit';
import { createTestnetClient } from '@/lib/Pearl-TS-SDK/src';

/**
 * Hook to manage DLMM client instance
 * Connects to your deployed testnet contracts
 */
export const useDLMMClient = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  // Create DLMM client instance
  const dlmmClient = useMemo(() => {
    if (!suiClient) {
      console.log('⏳ Sui client not available yet');
      return null;
    }
    
    try {
      // Create client connected to your testnet contracts
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

  // Get network info
  const networkInfo = useMemo(() => {
    if (!dlmmClient) return null;
    return dlmmClient.getNetworkInfo();
  }, [dlmmClient]);

  return {
    dlmmClient,
    isReady,
    networkInfo,
    isConnected: !!currentAccount,
    userAddress: currentAccount?.address,
    // Helper methods
    formatAmount: dlmmClient?.formatCoinAmount,
    parseAmount: dlmmClient?.parseCoinAmount
  };
};