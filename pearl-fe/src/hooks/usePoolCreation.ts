// pearl-fe/src/hooks/usePoolCreation.ts
'use client';

import { useState, useCallback } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

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
      
      // First, check if user has TEST_USDC coins
      const coins = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: '0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2::test_usdc::TEST_USDC'
      });

      if (coins.data.length === 0) {
        setState(prev => ({ ...prev, error: 'No TEST_USDC coins found. Please mint some first.' }));
        return null;
      }

      // Use the first available TEST_USDC coin
      const usdcCoinId = coins.data[0]!.coinObjectId;
      
      const txb = new Transaction();
      
      // Token types
      const SUI_TYPE = "0x2::sui::SUI";
      const TEST_USDC_TYPE = "0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2::test_usdc::TEST_USDC";
      
      // Pool parameters - using safe u128 values
      const BIN_STEP = 25; // 0.25% fee tier  
      const INITIAL_PRICE = "18446744073709551616"; // 2^64 - safe u128 value
      const INITIAL_BIN_ID = 0; // Start at bin 0 for simplicity
      
      console.log('📝 Pool creation parameters:', {
        tokenA: SUI_TYPE,
        tokenB: TEST_USDC_TYPE,
        binStep: BIN_STEP,
        initialPrice: INITIAL_PRICE,
        initialBinId: INITIAL_BIN_ID
      });

      // Split larger amounts for initial liquidity - the math might need meaningful amounts
      const [suiCoin] = txb.splitCoins(txb.gas, [1000000000]); // 1 SUI

      // Split larger TEST_USDC amount
      const [usdcCoin] = txb.splitCoins(txb.object(usdcCoinId), [1000000000]); // 1000 TEST_USDC

      // Create pool with exactly 7 arguments as per contract
      txb.moveCall({
        target: `0x6a01a88c704d76ef8b0d4db811dff4dd13104a35e7a125131fa35949d0bc2ada::factory::create_and_store_pool`,
        typeArguments: [SUI_TYPE, TEST_USDC_TYPE],
        arguments: [
          txb.object('0x160e34d10029993bccf6853bb5a5140bcac1794b7c2faccc060fb3d5b7167d7f'), // arg0: Factory
          txb.pure.u16(BIN_STEP),        // arg1: bin_step
          txb.pure.u128(INITIAL_PRICE),  // arg2: initial_price
          txb.pure.u32(INITIAL_BIN_ID),  // arg3: initial_bin_id
          suiCoin,                       // arg4: Coin<T0> (SUI)
          usdcCoin,                      // arg5: Coin<T1> (TEST_USDC)
          txb.object('0x6'),             // arg6: Clock
          // arg7: TxContext is auto-provided
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