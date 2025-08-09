// pearl-fe/src/hooks/usePoolCreation.ts
'use client';

import { useState, useCallback } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { createTestnetClient } from '@/lib/Pearl-TS-SDK/src';

interface PoolCreationState {
  loading: boolean;
  error: string | null;
  lastResult: any | null;
}

/**
 * Hook for creating DLMM pools on testnet
 */
export const usePoolCreation = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [state, setState] = useState<PoolCreationState>({
    loading: false,
    error: null,
    lastResult: null
  });

  // Create SUI/TEST_USDC pool
  const createSUIUSDCPool = useCallback(async () => {
    if (!suiClient || !currentAccount) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🏗️ Creating SUI/TEST_USDC pool...');
      
      const dlmmClient = createTestnetClient(suiClient);
      
      const txb = new Transaction();
      
      // Token types
      const SUI_TYPE = "0x2::sui::SUI";
      const TEST_USDC_TYPE = "0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2::test_usdc::TEST_USDC";
      
      // Pool parameters
      const BIN_STEP = 25; // 0.25% fee tier
      const INITIAL_PRICE = "18446744073709551616"; // Price scaled by 2^64 (approximately 1:1)
      const INITIAL_BIN_ID = 1000; // Starting bin
      
      console.log('📝 Pool creation parameters:', {
        tokenA: SUI_TYPE,
        tokenB: TEST_USDC_TYPE,
        binStep: BIN_STEP,
        initialPrice: INITIAL_PRICE,
        initialBinId: INITIAL_BIN_ID
      });

      // Create pool using factory
      txb.moveCall({
        target: `${dlmmClient.addresses.PACKAGE_ID}::factory::create_and_store_pool`,
        typeArguments: [SUI_TYPE, TEST_USDC_TYPE],
        arguments: [
          txb.object(dlmmClient.addresses.FACTORY_ID),
          txb.pure.u16(BIN_STEP),
          txb.pure.u128(INITIAL_PRICE),
          txb.pure.u32(INITIAL_BIN_ID),
          txb.object('0x6'), // Clock object
        ],
      });

      console.log('📝 Submitting pool creation transaction...');

      // Execute transaction with wallet signature
      signAndExecuteTransaction(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log('✅ Pool created successfully:', result);
            setState(prev => ({
              ...prev,
              loading: false,
              lastResult: result,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error creating pool:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to create pool'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building pool creation transaction:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to build transaction';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, [suiClient, currentAccount, signAndExecuteTransaction]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    lastResult: state.lastResult,
    
    // Actions
    createSUIUSDCPool,
    
    // Utils
    isReady: !!(suiClient && currentAccount),
    userAddress: currentAccount?.address
  };
};