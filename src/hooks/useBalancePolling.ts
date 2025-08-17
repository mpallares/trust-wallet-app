import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchWalletBalances } from '../store/slices/balancesSlice';
import { useWallets } from './useWallets';
import { TIMING } from '../constants';

export const useBalancePolling = () => {
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();

  const fetchAllBalances = useCallback(() => {
    wallets.forEach(wallet => dispatch(fetchWalletBalances(wallet)));
  }, [wallets, dispatch]);

  useEffect(() => {
    fetchAllBalances();
    
    // Polling interval
    const interval = setInterval(fetchAllBalances, TIMING.BALANCE_POLLING_INTERVAL);
    
    return () => {
      clearInterval(interval);
    };
  }, [fetchAllBalances]);
};