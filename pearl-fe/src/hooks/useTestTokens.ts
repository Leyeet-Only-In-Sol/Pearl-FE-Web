// pearl-fe/src/hooks/useTestTokens.ts
'use client';

import { useState, useCallback } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { createTestnetClient } from '@/lib/Pearl-TS-SDK/src';

interface TestTokenState {
  loading: boolean;
  error: string | null;
  lastResult: any | null;
}

/**
 * Hook for minting test USDC tokens on testnet
 */
export const useTestTokens = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [state, setState] = useState<TestTokenState>({
    loading: false,
    error: null,
    lastResult: null
  });

  // Mint test USDC tokens
  const mintTestUSDC = useCallback(async (amount?: string) => {
    if (!suiClient || !currentAccount) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🪙 Minting test USDC tokens...');
      
      const dlmmClient = createTestnetClient(suiClient);
      
      if (!dlmmClient.addresses.TEST_USDC_TREASURY) {
        throw new Error('Test USDC treasury not configured');
      }

      const txb = new Transaction();
      
      // Use the correct TEST_USDC package ID
      const TEST_USDC_PACKAGE = "0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2";
      const TEST_USDC_TREASURY = "0x2270d37729375d0b1446c101303f65a24677ae826ed3a39a4bb9c744f77537e9";

      if (amount) {
        // Mint custom amount
        txb.moveCall({
          target: `${TEST_USDC_PACKAGE}::test_usdc::mint_custom_amount`,
          arguments: [
            txb.object(TEST_USDC_TREASURY),
            txb.pure.u64(amount), // Amount in raw units
          ],
        });
      } else {
        // Get default test tokens (1000 USDC)
        txb.moveCall({
          target: `${TEST_USDC_PACKAGE}::test_usdc::get_test_tokens`,
          arguments: [
            txb.object(TEST_USDC_TREASURY),
          ],
        });
      }

      console.log('📝 Submitting test USDC mint transaction...');

      // Execute transaction with wallet signature
      signAndExecuteTransaction(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log('✅ Test USDC minted successfully:', result);
            setState(prev => ({
              ...prev,
              loading: false,
              lastResult: result,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error minting test USDC:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to mint test USDC'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building mint transaction:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to build transaction';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, [suiClient, currentAccount, signAndExecuteTransaction]);

  // Get liquidity tokens (larger amounts for LP)
  const getLiquidityTokens = useCallback(async () => {
    if (!suiClient || !currentAccount) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('💰 Getting liquidity tokens...');
      
      const dlmmClient = createTestnetClient(suiClient);
      
      if (!dlmmClient.addresses.TEST_USDC_TREASURY) {
        throw new Error('Test USDC treasury not configured');
      }

      const txb = new Transaction();
      
      // Use the correct TEST_USDC package ID
      const TEST_USDC_PACKAGE = "0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2";
      const TEST_USDC_TREASURY = "0x2270d37729375d0b1446c101303f65a24677ae826ed3a39a4bb9c744f77537e9";

      // Get liquidity tokens (10,000 USDC for LP)
      txb.moveCall({
        target: `${TEST_USDC_PACKAGE}::test_usdc::get_liquidity_tokens`,
        arguments: [
          txb.object(TEST_USDC_TREASURY),
        ],
      });

      console.log('📝 Submitting liquidity tokens transaction...');

      // Execute transaction with wallet signature
      signAndExecuteTransaction(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log('✅ Liquidity tokens received:', result);
            setState(prev => ({
              ...prev,
              loading: false,
              lastResult: result,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error getting liquidity tokens:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to get liquidity tokens'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building liquidity tokens transaction:', error);
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
    mintTestUSDC,
    getLiquidityTokens,
    
    // Utils
    isReady: !!(suiClient && currentAccount),
    userAddress: currentAccount?.address
  };
};