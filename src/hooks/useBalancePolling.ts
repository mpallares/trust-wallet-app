import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchWalletBalances } from '../store/slices/balancesSlice';
import { useWallets } from './useWallets';
import { TIMING } from '../constants';

export const useBalancePolling = () => {
  const dispatch = useAppDispatch();
  const { wallets } = useWallets();

  useEffect(() => {
    wallets.forEach(wallet => dispatch(fetchWalletBalances(wallet)));
    const interval = setInterval(() => {
      wallets.forEach(wallet => dispatch(fetchWalletBalances(wallet)));
    }, TIMING.BALANCE_POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [wallets, dispatch]);
};