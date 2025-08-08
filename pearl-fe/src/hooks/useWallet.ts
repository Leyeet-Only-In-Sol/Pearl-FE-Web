'use client';

import { useState, useCallback } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
  });

  const connectWallet = useCallback(async () => {
    // Mock wallet connection
    setWallet({
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      balance: 1.5,
    });
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      balance: 0,
    });
  }, []);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
  };
};