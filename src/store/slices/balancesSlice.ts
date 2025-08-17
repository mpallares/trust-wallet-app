import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WalletBalance, getBalancesForWallet } from '../../services/balanceService';
import { getAllTestnetNetworks } from '../../config/networks';
import { SecureWallet } from '../../lib/secureWallet';

interface WalletState {
  balances: WalletBalance[];
  isLoading: boolean;
  error: string | null;
}

export const fetchWalletBalances = createAsyncThunk(
  'balances/fetch',
  async (wallet: SecureWallet) => {
    const balances = await getBalancesForWallet(wallet.addresses, getAllTestnetNetworks());
    return { walletId: wallet.id, balances };
  }
);

const balancesSlice = createSlice({
  name: 'balances',
  initialState: { wallets: {} as Record<string, WalletState> },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalances.pending, (state, action) => {
        state.wallets[action.meta.arg.id] = { balances: [], isLoading: true, error: null };
      })
      .addCase(fetchWalletBalances.fulfilled, (state, action) => {
        const { walletId, balances } = action.payload;
        state.wallets[walletId] = { balances, isLoading: false, error: null };
      })
      .addCase(fetchWalletBalances.rejected, (state, action) => {
        const error = action.error.message || 'Failed to fetch balances';
        state.wallets[action.meta.arg.id] = { balances: [], isLoading: false, error };
      });
  },
});

export default balancesSlice.reducer;
