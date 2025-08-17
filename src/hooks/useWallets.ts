import { useState, useEffect, useCallback } from 'react';
import { SecureWallet, getStoredWallets, saveWallet } from '../lib/secureWallet';

export const useWallets = () => {
  const [wallets, setWallets] = useState<SecureWallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWallets = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      const storedWallets = getStoredWallets();
      setWallets(storedWallets);
    } catch (err) {
      setError('Failed to load wallets from storage');
      console.error('Failed to load wallets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addWallet = useCallback((wallet: SecureWallet) => {
    try {
      saveWallet(wallet);
      setWallets(prev => [...prev, wallet]);
      setError(null);
    } catch (err) {
      setError('Failed to save wallet');
      console.error('Failed to save wallet:', err);
    }
  }, []);

  const getWalletsCount = useCallback(() => {
    return wallets.length;
  }, [wallets.length]);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  return {
    wallets,
    isLoading,
    error,
    addWallet,
    loadWallets,
    getWalletsCount,
  };
};