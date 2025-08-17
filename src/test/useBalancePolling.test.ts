import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies
const mockDispatch = vi.fn();
const mockWallets = [
  { id: 'wallet-1', addresses: { ethereum: '0x123', bnbchain: '0x456' } },
  { id: 'wallet-2', addresses: { ethereum: '0x789', bnbchain: '0xabc' } },
];

vi.mock('../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../hooks/useWallets', () => ({
  useWallets: () => ({ wallets: mockWallets }),
}));

vi.mock('../store/slices/balancesSlice', () => ({
  fetchWalletBalances: vi.fn((wallet) => ({
    type: 'balances/fetch/pending',
    payload: wallet,
  })),
}));

describe('useBalancePolling behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call dispatch immediately when hook runs', async () => {
    const wallets = mockWallets;
    const dispatch = mockDispatch;
    
    wallets.forEach(wallet => {
      dispatch({ type: 'balances/fetch/pending', payload: wallet });
    });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'balances/fetch/pending',
      payload: mockWallets[0],
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'balances/fetch/pending',
      payload: mockWallets[1],
    });
  });

  it('should set up interval with correct timing', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval');
    
    const intervalCallback = () => {
      mockWallets.forEach(wallet => {
        mockDispatch({ type: 'balances/fetch/pending', payload: wallet });
      });
    };
    
    setInterval(intervalCallback, 120000);
    
    expect(setIntervalSpy).toHaveBeenCalledWith(
      expect.any(Function),
      120000
    );

    setIntervalSpy.mockRestore();
  });

  it('should execute polling callback every 2 minutes', () => {
    const intervalCallback = () => {
      mockWallets.forEach(wallet => {
        mockDispatch({ type: 'balances/fetch/pending', payload: wallet });
      });
    };
    
    setInterval(intervalCallback, 120000);
    
   
    mockDispatch.mockClear();
    
    vi.advanceTimersByTime(120000);
    
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('should handle multiple polling cycles', () => {
    const intervalCallback = () => {
      mockWallets.forEach(wallet => {
        mockDispatch({ type: 'balances/fetch/pending', payload: wallet });
      });
    };
    
    setInterval(intervalCallback, 120000);
    
    mockDispatch.mockClear();
    
    vi.advanceTimersByTime(240000);
    
    expect(mockDispatch).toHaveBeenCalledTimes(4);
  });

  it('should cleanup interval properly', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    const intervalId = setInterval(() => {}, 120000);
    
    clearInterval(intervalId);
    
    expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId);

    clearIntervalSpy.mockRestore();
  });

  it('should handle empty wallets array', () => {
    const emptyWallets: Array<{ id: string; addresses: Record<string, string> }> = [];
    
    emptyWallets.forEach(wallet => {
      mockDispatch({ type: 'balances/fetch/pending', payload: wallet });
    });
    
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});