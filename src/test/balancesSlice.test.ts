import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import balancesReducer, { fetchWalletBalances } from '../store/slices/balancesSlice';
import type { BalancesState } from '../types';

// Mock services
vi.mock('../services/balanceService', () => ({
  getBalancesForWallet: vi.fn(() => Promise.resolve([{
    address: '0x123',
    networkId: 'sepolia',
    balance: '1000000000000000000',
    formattedBalance: '1.0',
    lastUpdated: Date.now(),
  }])),
}));

vi.mock('../config/networks', () => ({
  getAllTestnetNetworks: vi.fn(() => [
    { id: 'sepolia', name: 'Sepolia', chainId: 11155111 }
  ]),
}));

describe('balancesSlice', () => {
  let store: ReturnType<typeof configureStore<{ balances: BalancesState }>>;
  const mockWallet = { 
    id: 'wallet-1', 
    addresses: { ethereum: '0x123' },
    name: 'Test Wallet',
    encryptedMnemonic: 'encrypted',
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    store = configureStore({
      reducer: { balances: balancesReducer },
    });
  });

  it('starts with empty wallets', () => {
    expect(store.getState().balances.wallets).toEqual({});
  });

  it('sets loading state when fetching', () => {
    store.dispatch(fetchWalletBalances.pending('test-id', mockWallet));
    
    const state = store.getState().balances.wallets['wallet-1'];
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('stores balances when fetch succeeds', () => {
    const balances = [{
      address: '0x123',
      networkId: 'sepolia',
      balance: '1000000000000000000',
      formattedBalance: '1.0',
      lastUpdated: Date.now(),
    }];

    store.dispatch(fetchWalletBalances.fulfilled(
      { walletId: 'wallet-1', balances }, 
      'test-id', 
      mockWallet
    ));
    
    const state = store.getState().balances.wallets['wallet-1'];
    expect(state.balances).toEqual(balances);
    expect(state.isLoading).toBe(false);
  });

  it('stores error when fetch fails', () => {
    store.dispatch(fetchWalletBalances.rejected(
      new Error('Network error'), 
      'test-id', 
      mockWallet
    ));
    
    const state = store.getState().balances.wallets['wallet-1'];
    expect(state.error).toBe('Network error');
    expect(state.isLoading).toBe(false);
  });
});