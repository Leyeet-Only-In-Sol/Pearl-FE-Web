'use client';

import { useConnectWallet, useCurrentAccount, useWallets, useDisconnectWallet } from '@mysten/dapp-kit';
import { isEnokiWallet, type EnokiWallet, type AuthProvider } from '@mysten/enoki';
import { useMemo } from 'react';

export const useWalletConnection = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();

  // Filter and organize Enoki wallets by provider
  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = useMemo(() => {
    return wallets.reduce(
      (map, wallet) => map.set(wallet.provider, wallet),
      new Map<AuthProvider, EnokiWallet>(),
    );
  }, [wallets]);

  const googleWallet = walletsByProvider.get('google');

  const connectWithGoogle = () => {
    if (googleWallet) {
      connect({ wallet: googleWallet });
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  // Format address for display (show first 6 and last 4 characters)
  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    // Connection state
    isConnected: !!currentAccount,
    address: currentAccount?.address,
    formattedAddress: currentAccount?.address ? formatAddress(currentAccount.address) : null,
    
    // Available wallets
    googleWallet,
    
    // Actions
    connectWithGoogle,
    disconnectWallet,
  };
};