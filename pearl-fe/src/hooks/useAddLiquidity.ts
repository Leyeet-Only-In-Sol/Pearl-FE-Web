// pearl-fe/src/hooks/useAddLiquidity.ts
'use client';

import { useState, useCallback } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

export interface AddLiquidityParams {
  poolId: string;
  amountA: string; // SUI amount in raw units (e.g., "1000000000" for 1 SUI)
  amountB: string; // USDC amount in raw units
  strategy: 'uniform' | 'curve' | 'spot';
  rangeBins?: number; // Optional: number of bins around active price
}

export interface AddLiquidityResult {
  positionId: string;
  actualAmountA: string;
  actualAmountB: string;
  sharesIssued: string;
  transactionDigest: string;
  success: boolean;
  error?: string;
}

interface AddLiquidityState {
  loading: boolean;
  error: string | null;
  result: AddLiquidityResult | null;
}

/**
 * Simple hook for adding liquidity - integrates with your existing modal
 */
export const useAddLiquidity = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [state, setState] = useState<AddLiquidityState>({
    loading: false,
    error: null,
    result: null
  });

  // Contract addresses (from your existing code)
  const PACKAGE_ID = "0x6a01a88c704d76ef8b0d4db811dff4dd13104a35e7a125131fa35949d0bc2ada";
  const SUI_TYPE = "0x2::sui::SUI";
  const TEST_USDC_TYPE = "0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2";

  /**
   * Add liquidity to a pool
   */
  const addLiquidity = useCallback(async (params: AddLiquidityParams) => {
    if (!suiClient || !currentAccount) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🏊 Adding liquidity with params:', params);

      // Get user's coin objects
      const [suiCoins, usdcCoins] = await Promise.all([
        suiClient.getCoins({
          owner: currentAccount.address,
          coinType: SUI_TYPE
        }),
        suiClient.getCoins({
          owner: currentAccount.address,
          coinType: TEST_USDC_TYPE
        })
      ]);

      // Find suitable coins
      const suiCoin = suiCoins.data.find(coin => 
        parseInt(coin.balance) >= parseInt(params.amountA)
      );
      const usdcCoin = usdcCoins.data.find(coin => 
        parseInt(coin.balance) >= parseInt(params.amountB)
      );

      if (!suiCoin) {
        throw new Error(`Insufficient SUI balance. Need ${(parseInt(params.amountA) / 1e9).toFixed(3)} SUI`);
      }
      if (!usdcCoin) {
        throw new Error(`Insufficient USDC balance. Need ${(parseInt(params.amountB) / 1e9).toFixed(3)} USDC`);
      }

      console.log('💰 Found coins:', { 
        suiCoin: suiCoin.coinObjectId, 
        usdcCoin: usdcCoin.coinObjectId 
      });

      // Build transaction
      const txb = new Transaction();

      // Split coins for liquidity provision
      const [suiCoinForLP] = txb.splitCoins(txb.object(suiCoin.coinObjectId), [params.amountA]);
      const [usdcCoinForLP] = txb.splitCoins(txb.object(usdcCoin.coinObjectId), [params.amountB]);

      // Calculate strategy parameters
      const strategyType = strategyToNumber(params.strategy);
      const rangeBins = params.rangeBins || getDefaultRangeBins(params.strategy);

      // Add liquidity using your contract
      // This assumes you have a position manager contract function
      txb.moveCall({
        target: `${PACKAGE_ID}::position_manager::create_position_simple`,
        typeArguments: [SUI_TYPE, TEST_USDC_TYPE],
        arguments: [
          txb.object(params.poolId),
          suiCoinForLP,
          usdcCoinForLP,
          txb.pure.u32(rangeBins),
          txb.pure.u8(strategyType),
          txb.object('0x6'), // Clock object
        ],
      });

      console.log('📝 Submitting add liquidity transaction...');

      // Execute transaction
      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: (result) => {
            console.log('✅ Liquidity added successfully:', result);
            const addLiquidityResult = parseAddLiquidityResult(result, params);
            setState(prev => ({
              ...prev,
              loading: false,
              result: addLiquidityResult,
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
      console.error('❌ Error building add liquidity transaction:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to build transaction'
      }));
    }
  }, [suiClient, currentAccount, signAndExecuteTransaction]);

  /**
   * Add liquidity to existing position
   */
  const addToExistingPosition = useCallback(async (
    positionId: string,
    amountA: string,
    amountB: string
  ) => {
    if (!suiClient || !currentAccount) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔄 Adding to existing position:', positionId);

      // Get user's coin objects
      const [suiCoins, usdcCoins] = await Promise.all([
        suiClient.getCoins({
          owner: currentAccount.address,
          coinType: SUI_TYPE
        }),
        suiClient.getCoins({
          owner: currentAccount.address,
          coinType: TEST_USDC_TYPE
        })
      ]);

      const suiCoin = suiCoins.data.find(coin => 
        parseInt(coin.balance) >= parseInt(amountA)
      );
      const usdcCoin = usdcCoins.data.find(coin => 
        parseInt(coin.balance) >= parseInt(amountB)
      );

      if (!suiCoin || !usdcCoin) {
        throw new Error('Insufficient coin balance');
      }

      const txb = new Transaction();

      // Split coins
      const [suiCoinForLP] = txb.splitCoins(txb.object(suiCoin.coinObjectId), [amountA]);
      const [usdcCoinForLP] = txb.splitCoins(txb.object(usdcCoin.coinObjectId), [amountB]);

      // Add to existing position
      txb.moveCall({
        target: `${PACKAGE_ID}::position_manager::add_liquidity_to_position`,
        typeArguments: [SUI_TYPE, TEST_USDC_TYPE],
        arguments: [
          txb.object(positionId),
          suiCoinForLP,
          usdcCoinForLP,
          txb.object('0x6'), // Clock object
        ],
      });

      signAndExecuteTransaction(
        { transaction: txb },
        {
          onSuccess: (result) => {
            console.log('✅ Liquidity added to position successfully:', result);
            const addLiquidityResult = parseAddLiquidityResult(result, {
              poolId: '',
              amountA,
              amountB,
              strategy: 'uniform'
            });
            setState(prev => ({
              ...prev,
              loading: false,
              result: addLiquidityResult,
              error: null
            }));
          },
          onError: (error) => {
            console.error('❌ Error adding liquidity to position:', error);
            setState(prev => ({
              ...prev,
              loading: false,
              error: error.message || 'Failed to add liquidity to position'
            }));
          },
        }
      );

    } catch (error) {
      console.error('❌ Error building add to position transaction:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to build transaction'
      }));
    }
  }, [suiClient, currentAccount, signAndExecuteTransaction]);

  /**
   * Estimate optimal amounts for liquidity provision
   */
  const estimateOptimalAmounts = useCallback(async (
    poolId: string,
    inputAmount: string,
    inputIsTokenA: boolean = true
  ) => {
    if (!suiClient) return null;

    try {
      // Get pool info to calculate optimal ratio
      const poolObject = await suiClient.getObject({
        id: poolId,
        options: { showContent: true }
      });

      if (!poolObject.data?.content || poolObject.data.content.dataType !== 'moveObject') {
        return null;
      }

      const fields = (poolObject.data.content as any).fields;
      const reserveA = parseInt(fields.reserves_a || '1000000000');
      const reserveB = parseInt(fields.reserves_b || '1000000000');
      
      const inputAmountNum = parseInt(inputAmount);
      
      if (inputIsTokenA) {
        // Calculate optimal B amount based on A input
        const optimalB = Math.floor((inputAmountNum * reserveB) / reserveA);
        return {
          amountA: inputAmount,
          amountB: optimalB.toString()
        };
      } else {
        // Calculate optimal A amount based on B input
        const optimalA = Math.floor((inputAmountNum * reserveA) / reserveB);
        return {
          amountA: optimalA.toString(),
          amountB: inputAmount
        };
      }
    } catch (error) {
      console.error('Error estimating optimal amounts:', error);
      return null;
    }
  }, [suiClient]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    result: state.result,
    
    // Actions
    addLiquidity,
    addToExistingPosition,
    estimateOptimalAmounts,
    
    // Utils
    isReady: !!(suiClient && currentAccount),
    userAddress: currentAccount?.address,
    
    // Reset state
    clearError: () => setState(prev => ({ ...prev, error: null })),
    clearResult: () => setState(prev => ({ ...prev, result: null }))
  };
};

// ==================== HELPER FUNCTIONS ====================

function strategyToNumber(strategy: 'uniform' | 'curve' | 'spot'): number {
  switch (strategy) {
    case 'uniform': return 0;
    case 'curve': return 1;
    case 'spot': return 2;
    default: return 0;
  }
}

function getDefaultRangeBins(strategy: 'uniform' | 'curve' | 'spot'): number {
  switch (strategy) {
    case 'spot': return 2;    // Very tight range
    case 'curve': return 10;  // Medium range
    case 'uniform': return 20; // Wide range
    default: return 10;
  }
}

function parseAddLiquidityResult(result: any, params: AddLiquidityParams): AddLiquidityResult {
  try {
    let positionId = '';
    let sharesIssued = '0';

    // Extract position ID from object changes
    if (result.objectChanges) {
      for (const change of result.objectChanges) {
        if (change.type === 'created' && 
            (change.objectType?.includes('Position') || change.objectType?.includes('LiquidityPosition'))) {
          positionId = change.objectId;
          break;
        }
      }
    }

    // Extract shares from events
    if (result.events) {
      for (const event of result.events) {
        if (event.type.includes('LiquidityAdded') || 
            event.type.includes('PositionCreated') ||
            event.type.includes('Minted')) {
          const eventData = event.parsedJson;
          sharesIssued = eventData?.shares_minted || 
                       eventData?.shares_issued || 
                       eventData?.amount || '0';
          // Sometimes position ID is in events
          if (!positionId && eventData?.position_id) {
            positionId = eventData.position_id;
          }
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