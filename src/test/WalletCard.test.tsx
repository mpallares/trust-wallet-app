import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletCard } from '../components/WalletCard';
import type { SecureWallet } from '../types';

describe('WalletCard', () => {
  const mockWallet: SecureWallet = {
    id: 'wallet-123456',
    name: 'Test Wallet',
    addresses: {
      ethereum: '0x1234567890abcdef',
      bnbchain: '0xabcdef1234567890'
    },
    encryptedMnemonic: 'encrypted',
    createdAt: '2023-01-01T00:00:00.000Z'
  };

  const mockProps = {
    wallet: mockWallet,
    onViewPrivateKey: vi.fn(),
    getWalletBalances: vi.fn(() => []),
    isWalletBalancesLoading: vi.fn(() => false),
    formatDate: vi.fn(() => 'Jan 1, 2023'),
    getAllTestnetNetworks: vi.fn(() => [])
  };

  it('renders wallet name and creation date', () => {
    render(<WalletCard {...mockProps} />);
    
    expect(screen.getByText('Test Wallet')).toBeDefined();
    expect(screen.getByText('Created: Jan 1, 2023')).toBeDefined();
  });

  it('renders wallet addresses with chain items', () => {
    render(<WalletCard {...mockProps} />);
    
    expect(screen.getByText('0x1234567890abcdef')).toBeDefined();
    expect(screen.getByText('0xabcdef1234567890')).toBeDefined();
  });

  it('calls onViewPrivateKey when button is clicked', () => {
    render(<WalletCard {...mockProps} />);
    
    const button = screen.getByText('🔑 View Private Key');
    fireEvent.click(button);
    
    expect(mockProps.onViewPrivateKey).toHaveBeenCalledWith('wallet-123456');
  });

  it('shows loading spinner when balances are loading', () => {
    const loadingProps = {
      ...mockProps,
      isWalletBalancesLoading: vi.fn(() => true)
    };
    
    render(<WalletCard {...loadingProps} />);
    
    expect(screen.getByText('🔄')).toBeDefined();
  });
});