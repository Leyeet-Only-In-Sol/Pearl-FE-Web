// pearl-fe/src/hooks/useDLMMSwap.ts
'use client';

import { useState, useCallback } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { createTestnetClient } from '@/lib/Pearl-TS-SDK/src';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

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

  // Execute swap
  const executeSwap = useCallback(async (
    quote: any,
    coinObjectId: string,
    keypair: Ed25519Keypair
  ) => {
    if (!suiClient || !currentAccount || !quote) {
      setState(prev => ({ ...prev, error: 'Invalid swap parameters' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('⚡ Executing DLMM swap:', {
        poolId: quote.poolId,
        amountIn: quote.amountIn,
        amountOutMin: quote.amountOut,
        coinObjectId
      });

      // Create DLMM client
      const dlmmClient = createTestnetClient(suiClient);

      // Execute swap on your deployed contracts
      const swapResult = await dlmmClient.executeSwap(
        {
          poolId: quote.poolId,
          tokenIn: quote.route.hops[0]?.tokenIn || '',
          tokenOut: quote.route.hops[0]?.tokenOut || '',
          amountIn: quote.amountIn,
          amountOutMin: quote.amountOut
        },
        coinObjectId,
        keypair
      );

      console.log('✅ Swap executed:', swapResult);

      setState(prev => ({
        ...prev,
        loading: false,
        lastSwapResult: swapResult,
        error: swapResult.success ? null : (swapResult.error || 'Unknown error')
      }));

      return swapResult;

    } catch (error) {
      console.error('❌ Error executing swap:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute swap';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      return null;
    }
  }, [suiClient, currentAccount]);

  // Get test tokens (for testnet)
  const getTestTokens = useCallback(async (keypair: Ed25519Keypair) => {
    if (!suiClient) return null;

    try {
      console.log('🪙 Getting test tokens...');
      
      const dlmmClient = createTestnetClient(suiClient);
      const result = await dlmmClient.getTestTokens(keypair);
      
      console.log('✅ Test tokens result:', result);
      return result;

    } catch (error) {
      console.error('❌ Error getting test tokens:', error);
      return null;
    }
  }, [suiClient]);

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