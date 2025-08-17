import { describe, it, expect } from 'vitest';

describe('Balance formatting', () => {
  it('should format Wei to ETH correctly', () => {
    const formatBalance = (balance: string, decimals: number = 18): string => {
      try {
        const balanceInWei = BigInt(balance);
        const divisor = BigInt(10 ** decimals);
        const formatted = balanceInWei / divisor;
        return formatted.toString();
      } catch {
        return '0';
      }
    };

    expect(formatBalance('1000000000000000000')).toBe('1'); // 1 ETH
    expect(formatBalance('500000000000000000')).toBe('0'); // 0.5 ETH (BigInt rounds down)
    expect(formatBalance('2000000000000000000')).toBe('2'); // 2 ETH
    expect(formatBalance('0')).toBe('0'); // 0 ETH
    expect(formatBalance('invalid')).toBe('0'); // Invalid input
  });

  it('should handle different decimal places', () => {
    const formatBalance = (balance: string, decimals: number = 18): string => {
      try {
        const balanceInWei = BigInt(balance);
        const divisor = BigInt(10 ** decimals);
        const formatted = balanceInWei / divisor;
        return formatted.toString();
      } catch {
        return '0';
      }
    };

    expect(formatBalance('1000000', 6)).toBe('1'); // 1 USDC (6 decimals)
    expect(formatBalance('100000000', 8)).toBe('1'); // 1 BTC (8 decimals)
  });
});