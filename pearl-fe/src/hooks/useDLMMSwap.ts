// pearl-fe/src/hooks/useDLMMSwap.ts
'use client';

import { useState, useCallback } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { createTestnetClient } from '@/lib/Pearl-TS-SDK/src';

interface SwapState {
  loading: boolean;
  error: string | null;
  quote: any | null;
  lastSwapResult: any | null;
}

/**
 * Hook for real DLMM swapping functionality
 * Connects to your deployed testnet contracts
 */
export const useDLMMSwap = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [state, setState] = useState<SwapState>({
    loading: false,
    error: null,
    quote: null,
    lastSwapResult: null
  });

  // Get quote for swap
  const getQuote = useCallback(async (
    tokenIn: string,
    tokenOut: string,
    amountIn: string
  ) => {
    if (!suiClient || !currentAccount) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Getting DLMM quote:', {
        tokenIn,
        tokenOut,
        amountIn
      });

      // Create DLMM client
      const dlmmClient = createTestnetClient(suiClient);

      // Get quote from your deployed contracts
      const quote = await dlmmClient.getQuote({
        tokenIn,
        tokenOut,
        amountIn
      });

      console.log('✅ Quote received:', quote);

      setState(prev => ({
        ...prev,
        loading: false,
        quote,
        error: null
      }));

      return quote;

    } catch (error) {
      console.error('❌ Error getting quote:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get quote';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        quote: null
      }));

      return null;
    }
  }, [suiClient, currentAccount]);

  // Execute swap using zkLogin wallet
  const executeSwap = useCallback(async (
    tokenIn: string,
    tokenOut: string,
    amountIn: string
  ) => {
    if (!suiClient || !currentAccount || !state.quote) {
      setState(prev => ({ ...prev, error: 'Invalid swap parameters' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('⚡ Executing DLMM swap:', {
        poolId: state.quote.poolId,
        amountIn,
        amountOutMin: state.quote.amountOut,
        tokenIn,
        tokenOut
      });

      const txb = new Transaction();
      
      // Build swap transaction using your deployed contracts
      txb.moveCall({
        target: `0x6a01a88c704d76ef8b0d4db811dff4dd13104a35e7a125131fa35949d0bc2ada::dlmm_pool::swap`,
        typeArguments: [tokenIn, tokenOut],
        arguments: [
          txb.object(state.quote.poolId),
          txb.pure.u64(amountIn),
          txb.pure.u64(state.quote.amountOut),
          txb.pure.bool(true), // zero_for_one
          txb.object('0x6'), // Clock object
        ],
      });

      // Execute transaction with zkLogin wallet
      signAndExecuteTransaction(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log('✅ Swap executed successfully:', result);
            setState(prev => ({
              ...prev,
              loading: false,
              lastSwapResult: result,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error executing swap:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to execute swap'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building swap transaction:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to build transaction';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, [suiClient, currentAccount, state.quote, signAndExecuteTransaction]);

  // Get test tokens (matching your existing pattern)
  const getTestTokens = useCallback(async () => {
    if (!suiClient || !currentAccount) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🪙 Getting test tokens...');
      
      const txb = new Transaction();
      
      // Get test USDC tokens
      txb.moveCall({
        target: `0x6a01a88c704d76ef8b0d4db811dff4dd13104a35e7a125131fa35949d0bc2ada::test_usdc::get_test_tokens`,
        arguments: [
          txb.object('0x2270d37729375d0b1446c101303f65a24677ae826ed3a39a4bb9c744f77537e9'),
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: txb,
        },
        {
          onSuccess: (result) => {
            console.log('✅ Test tokens received:', result);
            setState(prev => ({
              ...prev,
              loading: false,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error getting test tokens:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to get test tokens'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building test tokens transaction:', error);
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
    quote: state.quote,
    lastSwapResult: state.lastSwapResult,
    
    // Actions
    getQuote,
    executeSwap,
    getTestTokens,
    
    // Utils
    isReady: !!(suiClient && currentAccount),
    userAddress: currentAccount?.address
  };
};