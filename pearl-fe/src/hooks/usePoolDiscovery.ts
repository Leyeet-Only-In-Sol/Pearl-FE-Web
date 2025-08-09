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
 * Hook for discovering and listing real pools from your factory
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

  // Discover all pools from the factory
  const discoverPools = useCallback(async () => {
    if (!suiClient) {
      setState(prev => ({ ...prev, error: 'Sui client not available' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Discovering pools from factory...');

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
        allowedBinSteps: factoryFields.allowed_bin_steps
      });

      // Debug: Check if SUI/TEST_USDC pool exists
      const SUI_TYPE = "0x2::sui::SUI";
      const TEST_USDC_TYPE = "0xbeb0bfff8de500ffd56210e21fc506a3e67bbef45cb65a515d72b223770e3ab2::test_usdc::TEST_USDC";
      
      console.log('🔍 Checking if SUI/TEST_USDC pool exists...');
      const poolExists = await checkPoolExists(SUI_TYPE, TEST_USDC_TYPE, 25);
      console.log('✅ Pool exists:', poolExists);

      if (poolExists) {
        console.log('🔍 Getting pool ID...');
        const poolId = await getPoolId(SUI_TYPE, TEST_USDC_TYPE, 25);
        console.log('✅ Pool ID:', poolId);

        if (poolId) {
          // Try to get the pool object directly
          try {
            const poolObject = await suiClient.getObject({
              id: poolId,
              options: {
                showContent: true,
                showType: true,
              }
            });

            if (poolObject.data?.content) {
              console.log('✅ Found pool object directly:', poolId);
              const pool = parsePoolDirectly(poolObject);
              if (pool) {
                setState(prev => ({
                  ...prev,
                  loading: false,
                  pools: [pool],
                  totalCount: 1,
                  error: null
                }));
                return;
              }
            }
          } catch (error) {
            console.warn('Could not fetch pool object directly:', error);
          }
        }
      }

      // Fallback: Get all dynamic fields (pools) from the factory
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
            const pool = await parsePoolFromWrapper(poolWrapper, suiClient);
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
  }, [suiClient]);

  // Auto-discover pools on mount and when dependencies change
  useEffect(() => {
    if (suiClient) {
      discoverPools();
    }
  }, [suiClient, discoverPools]);

  // Get specific pool details
  const getPoolDetails = useCallback(async (poolId: string) => {
    if (!suiClient) return null;

    try {
      const poolObject = await suiClient.getObject({
        id: poolId,
        options: {
          showContent: true,
          showType: true,
        }
      });

      if (!poolObject.data?.content || poolObject.data.content.dataType !== 'moveObject') {
        return null;
      }

      return await parsePoolFromWrapper(poolObject, suiClient);
    } catch (error) {
      console.error('Error fetching pool details:', error);
      return null;
    }
  }, [suiClient]);

  // Check if a specific pool exists
  const checkPoolExists = useCallback(async (tokenA: string, tokenB: string, binStep: number) => {
    if (!suiClient) return false;

    try {
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
        return Array.isArray(returnValue) ? returnValue[0] === 1 : returnValue === 1;
      }

      return false;
    } catch (error) {
      console.error('Error checking pool existence:', error);
      return false;
    }
  }, [suiClient]);

  // Get pool ID for specific token pair and bin step
  const getPoolId = useCallback(async (tokenA: string, tokenB: string, binStep: number) => {
    if (!suiClient) return null;

    try {
      const txb = new Transaction();
      
      txb.moveCall({
        target: `${PACKAGE_ID}::factory::get_pool_id`,
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
        const optionBytes = result.results[0].returnValues[0][0];
        // Parse Option<ID> from Move
        if (Array.isArray(optionBytes) && optionBytes.length > 0) {
          if (optionBytes[0] === 1 && optionBytes.length > 1) {
            return bytesToObjectId(optionBytes.slice(1));
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting pool ID:', error);
      return null;
    }
  }, [suiClient]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    pools: state.pools,
    totalCount: state.totalCount,
    
    // Actions
    discoverPools,
    getPoolDetails,
    checkPoolExists,
    getPoolId,
    
    // Utils
    isReady: !!suiClient,
    refreshPools: discoverPools
  };
};

// Helper function to parse pool from direct object access
function parsePoolDirectly(poolObject: any): DiscoveredPool | null {
  try {
    const content = poolObject.data.content as any;
    
    // Extract token types from the object type
    const typeMatch = content.type.match(/<([^,]+),\s*([^>]+)>/);
    const tokenAType = typeMatch?.[1] || '';
    const tokenBType = typeMatch?.[2] || '';

    // For direct pool objects, the fields might be structured differently
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

// Helper function to parse pool from wrapper object
async function parsePoolFromWrapper(poolWrapper: any, suiClient: any): Promise<DiscoveredPool | null> {
  try {
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
        decimals: 9 // Default, should be fetched from coin metadata
      },
      tokenB: {
        coinType: tokenBType,
        symbol: extractTokenSymbol(tokenBType),
        decimals: 9 // Default, should be fetched from coin metadata
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

// Helper function to extract token symbol from coin type
function extractTokenSymbol(coinType: string): string {
  const parts = coinType.split('::');
  const symbol = parts[parts.length - 1] || 'UNKNOWN';
  
  // Handle special cases
  if (symbol === 'SUI') return 'SUI';
  if (symbol === 'TEST_USDC') return 'USDC';
  
  return symbol.toUpperCase();
}

// Helper function to convert bytes to object ID
function bytesToObjectId(bytes: number[]): string {
  try {
    return '0x' + Buffer.from(bytes).toString('hex');
  } catch (error) {
    return '';
  }
}