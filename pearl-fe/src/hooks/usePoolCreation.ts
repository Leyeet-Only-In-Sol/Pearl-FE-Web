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
 * FIXED VERSION - Addresses the MoveAbort error
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
      
      // Updated addresses from your confirmation
      const FACTORY_ID = "0x160e34d10029993bccf6853bb5a5140bcac1794b7c2faccc060fb3d5b7167d7f";
      const PACKAGE_ID = "0x6a01a88c704d76ef8b0d4db811dff4dd13104a35e7a125131fa35949d0bc2ada";
      const TEST_USDC_TREASURY = "0x2270d37729375d0b1446c101303f65a24677ae826ed3a39a4bb9c744f77537e9";

      // Define liquidity amounts at the top
      const liquiditySuiAmount = 30000000; // 0.03 SUI in MIST
      const liquidityUsdcAmount = 30000000; // 30 TEST_USDC (matching ~0.03 SUI value)

      // Check if user has SUI balance first
      const suiBalance = await suiClient.getBalance({
        owner: currentAccount.address,
        coinType: '0x2::sui::SUI'
      });

      const requiredSui = 100000000; // 0.1 SUI total (0.03 for liquidity + 0.07 for gas)
      if (parseInt(suiBalance.totalBalance) < requiredSui) {
        setState(prev => ({ ...prev, error: 'Insufficient SUI balance. Need at least 0.1 SUI for pool creation (0.03 for liquidity + gas fees).' }));
        return null;
      }

      // Check if user has TEST_USDC coins
      const usdcCoins = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: '0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2::test_usdc::TEST_USDC'
      });

      if (usdcCoins.data.length === 0 || parseInt(usdcCoins.data[0]!.balance) < liquidityUsdcAmount) {
        setState(prev => ({ ...prev, error: `Insufficient TEST_USDC balance. Please mint TEST_USDC first (need at least ${liquidityUsdcAmount / 1e9} USDC to match ${liquiditySuiAmount / 1e9} SUI liquidity).` }));
        return null;
      }

      const txb = new Transaction();
      
      // FIXED: Based on Move bytecode analysis, the function expects these exact types
      // From the bytecode: typeArguments: [Ty0, Ty1] must match token order in pool key generation
      // The generate_pool_key function sorts tokens alphabetically using compare_bytes
      
      const SUI_TYPE = "0x2::sui::SUI";
      const TEST_USDC_TYPE = "0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2::test_usdc::TEST_USDC";
      
      // Sort token types alphabetically to match contract's generate_pool_key logic
      // This is CRITICAL - the contract generates keys by sorting token types
      const [tokenA, tokenB] = [SUI_TYPE, TEST_USDC_TYPE].sort();
      
      // FIXED Pool parameters - Based on actual Move contract analysis
      const BIN_STEP = 25; // 0.25% fee tier (confirmed in allowed_bin_steps)
      
      // From bytecode analysis: The contract checks allowed_bin_steps at initialization
      // Constants[5] shows allowed steps: [1, 5, 10, 25, 50, 100, 200, 1000]
      // Bin step 25 is valid
      
      // Initial bin ID should be reasonable for DLMM math
      const INITIAL_BIN_ID = 8388608; // 2^23, commonly used in DLMM for neutral price
      
      // Initial price: The contract uses u128, we need a price that works with bin math
      // For DLMM: price = (1 + bin_step/10000)^(bin_id - neutral_bin) * base_price
      const INITIAL_PRICE = "79228162514264337593543950336"; // 2^96, standard DLMM base price
      
      console.log('📝 Pool creation parameters:', {
        tokenA, // Sorted token A (will be SUI since "0x2" < "0xbeb...")
        tokenB, // Sorted token B (will be TEST_USDC)
        binStep: BIN_STEP,
        initialPrice: INITIAL_PRICE,
        initialBinId: INITIAL_BIN_ID,
        liquiditySuiAmount: `${liquiditySuiAmount / 1e9} SUI`,
        liquidityUsdcAmount: `${liquidityUsdcAmount / 1e9} USDC`,
        factory: FACTORY_ID
      });

      // Get the first USDC coin
      const usdcCoinId = usdcCoins.data[0]!.coinObjectId;

      // FIXED: Determine coin order based on sorted token types
      // Since tokens are sorted: tokenA = SUI, tokenB = TEST_USDC
      const [suiCoin] = txb.splitCoins(txb.gas, [liquiditySuiAmount]);
      const [usdcCoin] = txb.splitCoins(txb.object(usdcCoinId), [liquidityUsdcAmount]);

      // FIXED: Use sorted token types and matching coin order
      txb.moveCall({
        target: `${PACKAGE_ID}::factory::create_and_store_pool`,
        typeArguments: [tokenA, tokenB], // Use sorted tokens
        arguments: [
          txb.object(FACTORY_ID),        // factory object
          txb.pure.u16(BIN_STEP),        // bin_step
          txb.pure.u128(INITIAL_PRICE),  // initial_price 
          txb.pure.u32(INITIAL_BIN_ID),  // initial_bin_id
          suiCoin,                       // coin_a (SUI - first in sorted order)
          usdcCoin,                      // coin_b (TEST_USDC - second in sorted order)
          txb.object('0x6'),             // clock
        ],
      });

      // FIXED: Set appropriate gas budget for pool creation (reduced)
      txb.setGasBudget(70000000); // 0.07 SUI gas budget (reduced from 0.01)

      console.log('📝 Submitting pool creation transaction...');

      // Execute transaction with wallet signature - Updated approach
      signAndExecuteTransaction(
        {
          transaction: txb,
        },
        {
          onSuccess: async (result) => {
            console.log('✅ Pool created successfully:', result);
            
            // For dapp-kit, we need to fetch the full transaction details separately
            // to get events and object changes
            try {
              const fullTxResult = await suiClient.getTransactionBlock({
                digest: result.digest,
                options: {
                  showEvents: true,
                  showObjectChanges: true,
                  showEffects: true,
                },
              });
              
              // Extract pool ID from events
              let poolId = '';
              
              if (fullTxResult.events) {
                for (const event of fullTxResult.events) {
                  if (event.type.includes('PoolCreatedInFactory')) {
                    poolId = (event.parsedJson as any)?.pool_id || '';
                    break;
                  }
                }
              }
              
              // If no pool ID from events, try to extract from object changes
              if (!poolId && fullTxResult.objectChanges) {
                for (const change of fullTxResult.objectChanges) {
                  if (change.type === 'created' && change.objectType?.includes('PoolWrapper')) {
                    poolId = change.objectId;
                    break;
                  }
                }
              }
              
              setState(prev => ({
                ...prev,
                loading: false,
                lastResult: { ...result, poolId, fullTxResult },
                error: null
              }));
            } catch (fetchError) {
              console.warn('Could not fetch full transaction details:', fetchError);
              // Fallback: just use the basic result
              setState(prev => ({
                ...prev,
                loading: false,
                lastResult: result,
                error: null
              }));
            }
          },
          onError: (error) => {
            console.error('❌ Error creating pool:', error);
            
            // Provide more specific error messages
            let errorMessage = 'Failed to create pool';
            if (error.message.includes('MoveAbort')) {
              if (error.message.includes('2')) {
                errorMessage = 'Pool creation failed: Invalid parameters or insufficient funds. Please check your SUI and TEST_USDC balances.';
              } else if (error.message.includes('1')) {
                errorMessage = 'Pool creation failed: Pool might already exist for this token pair.';
              } else {
                errorMessage = `Pool creation failed: Move contract error. ${error.message}`;
              }
            } else if (error.message.includes('InsufficientGas')) {
              errorMessage = 'Insufficient gas for transaction. Please ensure you have enough SUI.';
            }
            
            setState(prev => ({
              ...prev,
              loading: false,
              error: errorMessage
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
        error: `Transaction build failed: ${errorMessage}`
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