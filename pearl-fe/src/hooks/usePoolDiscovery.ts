// pearl-fe/src/hooks/usePoolDiscovery.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

interface DiscoveredPool {
  id: string;
  tokenA: {
    coinType: string;
    symbol: string;
    decimals: number;
  };
  tokenB: {
    coinType: string;
    symbol: string;
    decimals: number;
  };
  binStep: number;
  reserveA: string;
  reserveB: string;
  tvl: string;
  isActive: boolean;
  createdAt: string;
}

interface PoolDiscoveryState {
  loading: boolean;
  error: string | null;
  pools: DiscoveredPool[];
  totalCount: number;
}

/**
 * Hook for discovering pools from factory with proper token sorting
 * Matches the contract's generate_pool_key function logic
 */
export const usePoolDiscovery = () => {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  
  const [state, setState] = useState<PoolDiscoveryState>({
    loading: false,
    error: null,
    pools: [],
    totalCount: 0
  });

  // Factory and contract addresses
  const FACTORY_ID = '0x160e34d10029993bccf6853bb5a5140bcac1794b7c2faccc060fb3d5b7167d7f';
  const PACKAGE_ID = '0x6a01a88c704d76ef8b0d4db811dff4dd13104a35e7a125131fa35949d0bc2ada';

  /**
   * Sort token types alphabetically to match contract logic
   * This matches the compare_bytes and generate_pool_key functions in factory.move
   */
  const sortTokenTypes = useCallback((tokenA: string, tokenB: string): { tokenA: string; tokenB: string } => {
    // Sort alphabetically exactly like the contract does
    if (tokenA < tokenB) {
      return { tokenA, tokenB };
    } else {
      return { tokenA: tokenB, tokenB: tokenA };
    }
  }, []);

  /**
   * Check if pool exists with proper token sorting
   */
  const checkPoolExists = useCallback(async (tokenA: string, tokenB: string, binStep: number): Promise<boolean> => {
    if (!suiClient) return false;

    try {
      // Sort tokens to match contract's generate_pool_key function
      const sortedTokens = sortTokenTypes(tokenA, tokenB);
      
      console.log(`🔍 Checking pool existence with sorted tokens: ${sortedTokens.tokenA} / ${sortedTokens.tokenB}`);

      const txb = new Transaction();
      
      txb.moveCall({
        target: `${PACKAGE_ID}::factory::pool_exists`,
        typeArguments: [sortedTokens.tokenA, sortedTokens.tokenB],
        arguments: [
          txb.object(FACTORY_ID),
          txb.pure.u16(binStep),
        ],
      });

      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
      });

      if (result.results?.[0]?.returnValues?.[0]) {
        const returnValue = result.results[0].returnValues[0][0];
        const exists = Array.isArray(returnValue) ? returnValue[0] === 1 : returnValue === 1;
        console.log(`✅ Pool exists result: ${exists}`);
        return exists;
      }

      return false;
    } catch (error) {
      console.error('Error checking pool existence:', error);
      return false;
    }
  }, [suiClient, sortTokenTypes]);

  /**
   * Get pool ID with proper token sorting
   */
  const getPoolId = useCallback(async (tokenA: string, tokenB: string, binStep: number): Promise<string | null> => {
    if (!suiClient) return null;

    try {
      // Sort tokens to match contract logic
      const sortedTokens = sortTokenTypes(tokenA, tokenB);
      
      console.log(`🔍 Getting pool ID for sorted tokens: ${sortedTokens.tokenA} / ${sortedTokens.tokenB}`);

      const txb = new Transaction();
      
      txb.moveCall({
        target: `${PACKAGE_ID}::factory::get_pool_id`,
        typeArguments: [sortedTokens.tokenA, sortedTokens.tokenB],
        arguments: [
          txb.object(FACTORY_ID),
          txb.pure.u16(binStep),
        ],
      });

      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
      });

      if (result.results?.[0]?.returnValues?.[0]) {
        const optionBytes = result.results[0].returnValues[0][0];
        // Parse Option<ID> from Move
        if (Array.isArray(optionBytes) && optionBytes.length > 0) {
          if (optionBytes[0] === 1 && optionBytes.length > 1) {
            const poolId = bytesToObjectId(optionBytes.slice(1));
            console.log(`✅ Pool ID found: ${poolId}`);
            return poolId;
          }
        }
      }

      console.log('ℹ️ No pool ID found');
      return null;
    } catch (error) {
      console.error('Error getting pool ID:', error);
      return null;
    }
  }, [suiClient, sortTokenTypes]);

  /**
   * Debug recent pool creation transaction and check if it's real or dummy
   */
  const debugRecentPoolCreation = useCallback(async () => {
    // Debug the transaction you mentioned in the logs
    const recentTransactionDigest = '8fZFpuVMngDZ4uD5JtvHCnQ1jBn2YJzmdxt8nuNqjPYT';
    
    console.log('🔍 Debugging recent pool creation transaction:', recentTransactionDigest);
    
    try {
      // 1. Fetch complete transaction details
      const txDetails = await suiClient.getTransactionBlock({
        digest: recentTransactionDigest,
        options: {
          showEvents: true,
          showObjectChanges: true,
          showEffects: true,
          showInput: true,
          showBalanceChanges: true
        }
      });
      
      console.log('📝 Transaction Details:');
      console.log('Events:', txDetails.events);
      console.log('Object Changes:', txDetails.objectChanges);
      console.log('Balance Changes:', txDetails.balanceChanges);
      
      // 2. Check if this was a real pool creation or dummy
      console.log('🔍 Analyzing if pool creation was real or dummy...');
      
      const objectChanges = txDetails.objectChanges || [];
      const createdObjects = objectChanges.filter(change => change.type === 'created');
      const deletedObjects = objectChanges.filter(change => change.type === 'deleted');
      const balanceChanges = txDetails.balanceChanges || [];
      
      console.log(`📦 Created objects: ${createdObjects.length}`);
      console.log(`🗑️ Deleted objects: ${deletedObjects.length}`);
      console.log(`💰 Balance changes: ${balanceChanges.length}`);
      
      // Check for coin consumption (real pool should consume coins)
      const deletedCoins = deletedObjects.filter(obj => 
        obj.objectType?.includes('Coin')
      );
      
      console.log(`🪙 Coins consumed: ${deletedCoins.length}`);
      if (deletedCoins.length > 0) {
        console.log('✅ REAL POOL: Coins were consumed during creation');
        deletedCoins.forEach((coin, index) => {
          console.log(`  Consumed coin ${index + 1}: ${coin.objectType}`);
        });
      } else {
        console.log('⚠️ SUSPICIOUS: No coins were consumed - this might be a dummy pool');
      }
      
      // 3. Look for PoolCreatedInFactory event
      const poolCreatedEvent = txDetails.events?.find(event => 
        event.type.includes('PoolCreatedInFactory')
      );
      
      if (poolCreatedEvent) {
        console.log('🎉 Found PoolCreatedInFactory event:', poolCreatedEvent.parsedJson);
        const eventData = poolCreatedEvent.parsedJson as any;
        
        console.log('📊 Pool Creation Data:');
        console.log('- Pool ID:', eventData.pool_id);
        console.log('- Token A:', eventData.coin_a);
        console.log('- Token B:', eventData.coin_b);
        console.log('- Bin Step:', eventData.bin_step);
        console.log('- Creator:', eventData.creator);
        console.log('- Pool Count:', eventData.pool_count);
        
        // 4. Look for PoolWrapper creation
        const poolWrapperCreated = createdObjects.find(obj => 
          obj.objectType?.includes('PoolWrapper')
        );
        
        if (poolWrapperCreated) {
          console.log('✅ PoolWrapper object created:', poolWrapperCreated.objectId);
          
          // Try to fetch the PoolWrapper object to check if it has real pool data
          try {
            const poolWrapperObject = await suiClient.getObject({
              id: poolWrapperCreated.objectId,
              options: {
                showContent: true,
                showType: true,
              }
            });
            
            if (poolWrapperObject.data?.content && poolWrapperObject.data.content.dataType === 'moveObject') {
              const wrapperFields = (poolWrapperObject.data.content as any).fields;
              console.log('🏊 Pool inside wrapper fields:', Object.keys(wrapperFields));
              
              // Check if the pool has real data
              if (wrapperFields.pool?.fields) {
                const poolFields = wrapperFields.pool.fields;
                console.log('📊 Pool state inside wrapper:');
                console.log('- Reserves A:', poolFields.reserves_a);
                console.log('- Reserves B:', poolFields.reserves_b);
                console.log('- Active Bin ID:', poolFields.active_bin_id);
                console.log('- Is Active:', poolFields.is_active);
                console.log('- Bin Step:', poolFields.bin_step);
                
                // Check if reserves are > 0 (indicating real liquidity)
                const reserveA = parseInt(poolFields.reserves_a || '0');
                const reserveB = parseInt(poolFields.reserves_b || '0');
                
                if (reserveA > 0 || reserveB > 0) {
                  console.log('✅ CONFIRMED REAL POOL: Has actual liquidity reserves!');
                  console.log(`- Reserve A: ${reserveA}`);
                  console.log(`- Reserve B: ${reserveB}`);
                } else {
                  console.log('⚠️ EMPTY POOL: Pool created but no liquidity added');
                  console.log('This suggests the pool creation consumed coins but didn\'t add them as liquidity');
                }
              } else if (wrapperFields.pool) {
                console.log('🔍 Pool data format different than expected:', wrapperFields.pool);
              }
            }
          } catch (error) {
            console.error('❌ Error fetching PoolWrapper object:', error);
          }
        } else {
          console.log('❌ No PoolWrapper object found in created objects');
          console.log('Created objects:', createdObjects.map(obj => ({
            id: obj.objectId,
            type: obj.objectType
          })));
        }
        
        // 5. Test different token orders with the actual event data
        const tokenA = eventData.coin_a;
        const tokenB = eventData.coin_b;
        const binStep = eventData.bin_step;
        
        console.log('🔍 Testing different token orders with actual event data...');
        
        // Test Order 1: A, B (as in event)
        const exists1 = await testPoolExistsOrder(tokenA, tokenB, binStep, 'Event Order A,B');
        
        // Test Order 2: B, A (reversed)
        const exists2 = await testPoolExistsOrder(tokenB, tokenA, binStep, 'Reversed B,A');
        
        // Test Order 3: Sorted alphabetically
        const sortedTokens = sortTokenTypes(tokenA, tokenB);
        const exists3 = await testPoolExistsOrder(sortedTokens.tokenA, sortedTokens.tokenB, binStep, 'Alphabetically Sorted');
        
        console.log('📋 Token order test results:');
        console.log(`- Event order (${tokenA.split('::').pop()} / ${tokenB.split('::').pop()}): ${exists1}`);
        console.log(`- Reversed order: ${exists2}`);
        console.log(`- Sorted order: ${exists3}`);
        
        // 6. Check if pool exists in factory as dynamic object using pool ID
        const poolId = eventData.pool_id;
        console.log('🔍 Checking if pool exists as dynamic object in factory...');
        
        try {
          const poolExistsInFactory = await suiClient.devInspectTransactionBlock({
            transactionBlock: (() => {
              const txb = new Transaction();
              txb.moveCall({
                target: `${PACKAGE_ID}::factory::pool_exists_in_factory`,
                arguments: [
                  txb.object(FACTORY_ID),
                  txb.pure.id(poolId),
                ],
              });
              return txb;
            })(),
            sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
          });
          
          if (poolExistsInFactory.results?.[0]?.returnValues?.[0]) {
            const exists = poolExistsInFactory.results[0].returnValues[0][0];
            const poolExistsAsObject = Array.isArray(exists) ? exists[0] === 1 : exists === 1;
            console.log(`🏭 Pool exists as dynamic object in factory: ${poolExistsAsObject}`);
            
            if (poolExistsAsObject) {
              console.log('✅ POOL STORED CORRECTLY: Pool exists as dynamic object field');
              
              // The issue is likely in the table key generation or lookup
              console.log('🔍 The issue is likely in the table key generation for pool_exists function');
              
              // Test the key generation manually
              console.log('🔑 Testing manual key generation...');
              
              // Try to replicate the key generation logic
              const keyTest1 = `${tokenA}::${tokenB}::${binStep}`;
              const keyTest2 = `${tokenB}::${tokenA}::${binStep}`;
              const keyTest3 = `${sortedTokens.tokenA}::${sortedTokens.tokenB}::${binStep}`;
              
              console.log('Possible keys:');
              console.log(`- Event order key: ${keyTest1}`);
              console.log(`- Reversed order key: ${keyTest2}`);
              console.log(`- Sorted order key: ${keyTest3}`);
              
            } else {
              console.log('❌ STORAGE ISSUE: Pool not found as dynamic object field');
            }
          }
        } catch (error) {
          console.error('❌ Error checking pool exists in factory:', error);
        }
        
        return { 
          tokenA, 
          tokenB, 
          binStep, 
          poolId,
          isRealPool: deletedCoins.length > 0,
          poolExistsAsObject: true // We'll update this based on the check above
        };
        
      } else {
        console.error('❌ No PoolCreatedInFactory event found in transaction');
      }
      
    } catch (error) {
      console.error('❌ Error debugging transaction:', error);
    }
    
    return null;
  }, [suiClient, sortTokenTypes]);

  /**
   * Test pool existence with specific token order
   */
  const testPoolExistsOrder = useCallback(async (tokenA: string, tokenB: string, binStep: number, orderDescription: string): Promise<boolean> => {
    try {
      console.log(`🧪 Testing ${orderDescription}: ${tokenA} / ${tokenB}`);
      
      const txb = new Transaction();
      txb.moveCall({
        target: `${PACKAGE_ID}::factory::pool_exists`,
        typeArguments: [tokenA, tokenB],
        arguments: [
          txb.object(FACTORY_ID),
          txb.pure.u16(binStep),
        ],
      });

      const result = await suiClient.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: '0x0000000000000000000000000000000000000000000000000000000000000000',
      });

      if (result.results?.[0]?.returnValues?.[0]) {
        const returnValue = result.results[0].returnValues[0][0];
        const exists = Array.isArray(returnValue) ? returnValue[0] === 1 : returnValue === 1;
        console.log(`   Result: ${exists}`);
        return exists;
      }
      
      console.log(`   Result: false (no return value)`);
      return false;
    } catch (error) {
      console.error(`   Error testing ${orderDescription}:`, error);
      return false;
    }
  }, [suiClient]);

  /**
   * Discover all pools from the factory using the pool_registry table
   */
  const discoverPools = useCallback(async () => {
    if (!suiClient) {
      setState(prev => ({ ...prev, error: 'Sui client not available' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Discovering pools from factory...');

      // First, debug the recent pool creation to understand what happened
      const debugResult = await debugRecentPoolCreation();

      // Get factory object to read pool data
      const factoryObject = await suiClient.getObject({
        id: FACTORY_ID,
        options: {
          showContent: true,
          showType: true,
        }
      });

      if (!factoryObject.data?.content || factoryObject.data.content.dataType !== 'moveObject') {
        throw new Error('Factory object not found');
      }

      const factoryFields = (factoryObject.data.content as any).fields;
      console.log('📊 Factory info:', {
        poolCount: factoryFields.pool_count,
        allowedBinSteps: factoryFields.allowed_bin_steps,
        poolsTableSize: factoryFields.pools?.fields?.size || 'unknown',
        registryTableSize: factoryFields.pool_registry?.fields?.size || 'unknown'
      });

      // If we have debug results, use them for more targeted testing
      if (debugResult) {
        const { tokenA, tokenB, binStep, poolId } = debugResult;
        
        console.log('🎯 Using debug results for targeted pool discovery...');
        console.log(`- Pool ID from event: ${poolId}`);
        console.log(`- Token A from event: ${tokenA}`);
        console.log(`- Token B from event: ${tokenB}`);
        console.log(`- Bin Step from event: ${binStep}`);
        
        // Try to get the pool object directly with the known pool ID
        try {
          const poolObject = await suiClient.getObject({
            id: poolId,
            options: {
              showContent: true,
              showType: true,
            }
          });

          if (poolObject.data?.content && poolObject.data.content.dataType === 'moveObject') {
            console.log('✅ Found pool object directly with event pool ID');
            
            const pool = parsePoolDirectly(poolObject, tokenA, tokenB);
            if (pool) {
              setState(prev => ({
                ...prev,
                loading: false,
                pools: [pool],
                totalCount: 1,
                error: null
              }));
              console.log(`✅ Successfully discovered 1 pool using debug data`);
              return;
            }
          }
        } catch (error) {
          console.warn('Could not fetch pool object with debug pool ID:', error);
        }
      }

      // Continue with original logic if debug didn't work
      // Test with known token pairs using proper sorting
      const TEST_USDC_TYPE = "0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2::test_usdc::TEST_USDC";
      const SUI_TYPE = "0x2::sui::SUI";
      
      console.log('🔍 Checking if SUI/TEST_USDC pool exists...');
      const poolExists = await checkPoolExists(SUI_TYPE, TEST_USDC_TYPE, 25);
      console.log(`✅ Pool exists: ${poolExists}`);

      if (poolExists) {
        console.log('🔍 Getting pool ID...');
        const poolId = await getPoolId(SUI_TYPE, TEST_USDC_TYPE, 25);
        console.log(`✅ Pool ID: ${poolId}`);

        if (poolId) {
          // Get the pool object directly
          try {
            const poolResponse = await suiClient.getObject({
              id: poolId,
              options: {
                showContent: true,
                showType: true,
              }
            });

            if (poolResponse.data?.content && poolResponse.data.content.dataType === 'moveObject') {
              console.log('✅ Found pool object, checking if it\'s a PoolWrapper...');
              
              // Check if this is a PoolWrapper by looking at dynamic object fields
              const dynamicFields = await suiClient.getDynamicFields({
                parentId: FACTORY_ID,
              });

              console.log(`🏊 Found ${dynamicFields.data.length} dynamic fields in factory`);

              const discoveredPools: DiscoveredPool[] = [];

              // Process dynamic object fields (PoolWrapper objects)
              for (const field of dynamicFields.data) {
                try {
                  if (field.objectId === poolId) {
                    console.log(`🎯 Found matching pool in dynamic fields: ${poolId}`);
                    
                    // This is our pool, parse it
                    const poolWrapper = await suiClient.getObject({
                      id: field.objectId,
                      options: {
                        showContent: true,
                        showType: true,
                      }
                    });

                    if (poolWrapper.data?.content && poolWrapper.data.content.dataType === 'moveObject') {
                      const pool = parsePoolFromWrapper(poolWrapper);
                      if (pool) {
                        discoveredPools.push(pool);
                        console.log(`✅ Successfully parsed pool: ${pool.id}`);
                      }
                    }
                  }
                } catch (error) {
                  console.warn(`Failed to parse pool ${field.objectId}:`, error);
                }
              }

              // If we didn't find it in dynamic fields, try to parse it directly
              if (discoveredPools.length === 0) {
                console.log('🔄 Trying to parse pool directly...');
                const pool = parsePoolDirectly(poolResponse, SUI_TYPE, TEST_USDC_TYPE);
                if (pool) {
                  discoveredPools.push(pool);
                  console.log(`✅ Successfully parsed pool directly: ${pool.id}`);
                }
              }

              setState(prev => ({
                ...prev,
                loading: false,
                pools: discoveredPools,
                totalCount: discoveredPools.length,
                error: null
              }));

              console.log(`✅ Successfully discovered ${discoveredPools.length} pools`);
              return;
            }
          } catch (error) {
            console.warn('Could not fetch pool object directly:', error);
          }
        }
      }

      // Fallback: Try to discover all dynamic object fields
      const dynamicFields = await suiClient.getDynamicFields({
        parentId: FACTORY_ID,
      });

      console.log(`🏊 Found ${dynamicFields.data.length} dynamic fields`);

      const discoveredPools: DiscoveredPool[] = [];

      // Process each dynamic field to extract pool data
      for (const field of dynamicFields.data) {
        try {
          // Get the pool wrapper object
          const poolWrapper = await suiClient.getObject({
            id: field.objectId,
            options: {
              showContent: true,
              showType: true,
            }
          });

          if (poolWrapper.data?.content && poolWrapper.data.content.dataType === 'moveObject') {
            const pool = parsePoolFromWrapper(poolWrapper);
            if (pool) {
              discoveredPools.push(pool);
            }
          }
        } catch (error) {
          console.warn(`Failed to parse pool ${field.objectId}:`, error);
        }
      }

      console.log(`✅ Successfully discovered ${discoveredPools.length} pools`);

      setState(prev => ({
        ...prev,
        loading: false,
        pools: discoveredPools,
        totalCount: discoveredPools.length,
        error: null
      }));

    } catch (error) {
      console.error('❌ Error discovering pools:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to discover pools';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, [suiClient, checkPoolExists, getPoolId, debugRecentPoolCreation, testPoolExistsOrder]);

  // Auto-discover pools on mount and when dependencies change
  useEffect(() => {
    if (suiClient) {
      discoverPools();
    }
  }, [suiClient, discoverPools]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    pools: state.pools,
    totalCount: state.totalCount,
    
    // Actions
    discoverPools,
    checkPoolExists,
    getPoolId,
    debugRecentPoolCreation,
    testPoolExistsOrder,
    
    // Utils
    isReady: !!suiClient,
    refreshPools: discoverPools,
    sortTokenTypes
  };
};

/**
 * Parse pool from PoolWrapper object
 */
function parsePoolFromWrapper(poolWrapper: any): DiscoveredPool | null {
  try {
    if (!poolWrapper.data?.content || poolWrapper.data.content.dataType !== 'moveObject') {
      return null;
    }

    const content = poolWrapper.data.content as any;
    const wrapperFields = content.fields;
    
    // Extract token types from the wrapper type
    const typeMatch = content.type.match(/<([^,]+),\s*([^>]+)>/);
    const tokenAType = typeMatch?.[1] || '';
    const tokenBType = typeMatch?.[2] || '';

    // Get the actual pool data from the wrapper
    let poolFields;
    if (wrapperFields.pool?.fields) {
      poolFields = wrapperFields.pool.fields;
    } else if (wrapperFields.pool) {
      poolFields = wrapperFields.pool;
    } else {
      console.warn('Could not find pool fields in wrapper');
      return null;
    }

    // Calculate TVL
    const reserveA = poolFields.reserves_a || '0';
    const reserveB = poolFields.reserves_b || '0';
    const tvl = (parseInt(reserveA) + parseInt(reserveB)).toString();

    return {
      id: poolFields.id?.id || poolWrapper.data.objectId,
      tokenA: {
        coinType: tokenAType,
        symbol: extractTokenSymbol(tokenAType),
        decimals: 9
      },
      tokenB: {
        coinType: tokenBType,
        symbol: extractTokenSymbol(tokenBType),
        decimals: 9
      },
      binStep: parseInt(poolFields.bin_step || '25'),
      reserveA,
      reserveB,
      tvl,
      isActive: poolFields.is_active !== false,
      createdAt: poolFields.created_at || Date.now().toString()
    };
  } catch (error) {
    console.error('Error parsing pool from wrapper:', error);
    return null;
  }
}

/**
 * Parse pool from direct object access
 */
function parsePoolDirectly(poolObject: any, expectedTokenA: string, expectedTokenB: string): DiscoveredPool | null {
  try {
    const content = poolObject.data.content as any;
    
    // For direct pool objects, we know the token types
    const tokenAType = expectedTokenA;
    const tokenBType = expectedTokenB;

    // The fields might be structured differently for direct pool access
    let poolFields = content.fields;

    // Calculate TVL
    const reserveA = poolFields.reserves_a || '0';
    const reserveB = poolFields.reserves_b || '0';
    const tvl = (parseInt(reserveA) + parseInt(reserveB)).toString();

    return {
      id: poolObject.data.objectId,
      tokenA: {
        coinType: tokenAType,
        symbol: extractTokenSymbol(tokenAType),
        decimals: 9
      },
      tokenB: {
        coinType: tokenBType,
        symbol: extractTokenSymbol(tokenBType),
        decimals: 9
      },
      binStep: parseInt(poolFields.bin_step || '25'),
      reserveA,
      reserveB,
      tvl,
      isActive: poolFields.is_active !== false,
      createdAt: poolFields.created_at || Date.now().toString()
    };
  } catch (error) {
    console.error('Error parsing pool directly:', error);
    return null;
  }
}

/**
 * Helper function to extract token symbol from coin type
 */
function extractTokenSymbol(coinType: string): string {
  const parts = coinType.split('::');
  const symbol = parts[parts.length - 1] || 'UNKNOWN';
  
  // Handle special cases
  if (symbol === 'SUI') return 'SUI';
  if (symbol === 'TEST_USDC') return 'USDC';
  
  return symbol.toUpperCase();
}

/**
 * Helper function to convert bytes to object ID
 */
function bytesToObjectId(bytes: number[]): string {
  try {
    return '0x' + Buffer.from(bytes).toString('hex');
  } catch (error) {
    return '';
  }
}