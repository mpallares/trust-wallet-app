// =============================================================================
// WALLET TYPES
// =============================================================================

export interface SecureWallet {
  id: string;
  name: string;
  addresses: Record<string, string>;
  encryptedMnemonic: string;
  createdAt: string;
}

export interface WalletBalance {
  address: string;
  networkId: string;
  balance: string;
  formattedBalance: string;
  lastUpdated: number;
  error?: string;
}

// =============================================================================
// NETWORK TYPES
// =============================================================================

export interface NetworkConfig {
  id: string;
  name: string;
  displayName: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet: boolean;
}

// =============================================================================
// REDUX TYPES
// =============================================================================

export interface WalletState {
  balances: WalletBalance[];
  isLoading: boolean;
  error: string | null;
}

export interface BalancesState {
  wallets: Record<string, WalletState>;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface BalanceApiRequest {
  address: string;
  networkId: string;
}

export interface BalanceApiResponse {
  success: boolean;
  balance?: string;
  network?: string;
  error?: string;
}

// =============================================================================
// HOOK TYPES
// =============================================================================

export interface UseBalancePollingOptions {
  interval?: number;
  enabled?: boolean;
}

export interface UseWalletsReturn {
  wallets: SecureWallet[];
  addWallet: (wallet: Omit<SecureWallet, 'id' | 'createdAt'>) => void;
  removeWallet: (id: string) => void;
  clearWallets: () => void;
}

// =============================================================================
// WALLET CORE TYPES
// =============================================================================

export interface WalletCore {
  HexCoding: {
    decode: (hex: string) => Uint8Array;
    encode: (data: Uint8Array) => string;
  };
  HDWallet: {
    create: (strength: number, passphrase: string) => unknown;
    createWithMnemonic: (mnemonic: string, passphrase: string) => unknown;
  };
  CoinType: {
    ethereum: number;
    smartChain: number;
  };
  HRP: {
    ethereum: string;
    smartChain: string;
  };
  AnyAddress: unknown;
  Mnemonic: {
    isValid: (mnemonic: string) => boolean;
  };
}