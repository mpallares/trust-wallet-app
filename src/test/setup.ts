import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Trust Wallet Core
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).TrustWalletCore = {
  HexCoding: {
    decode: vi.fn(),
    encode: vi.fn(),
  },
  HDWallet: {
    createWithMnemonic: vi.fn(),
  },
};