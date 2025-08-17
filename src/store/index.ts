import { configureStore } from '@reduxjs/toolkit';
import balancesReducer from './slices/balancesSlice';

export const store = configureStore({
  reducer: {
    balances: balancesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;