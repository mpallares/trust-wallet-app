// =============================================================================
// TIMING CONSTANTS
// =============================================================================

export const TIMING = {
  BALANCE_POLLING_INTERVAL: 120000, // 2 minutes
  BALANCE_CACHE_TTL: 30000, // 30 seconds
  RATE_LIMIT_DELAY: 500, // 500ms between requests
  API_TIMEOUT: 10000, // 10 seconds
} as const;

// =============================================================================
// NETWORK CONSTANTS
// =============================================================================

export const NETWORK_IDS = {
  SEPOLIA: 'sepolia',
  BSC_TESTNET: 'bsc-testnet',
} as const;

export const CHAIN_IDS = {
  SEPOLIA: 11155111,
  BSC_TESTNET: 97,
} as const;

export const ADDRESS_TYPES = {
  ETHEREUM: 'ethereum',
  BNBCHAIN: 'bnbchain',
} as const;

// =============================================================================
// RPC ENDPOINTS
// =============================================================================

export const RPC_URLS = {
  [NETWORK_IDS.SEPOLIA]: 'https://ethereum-sepolia-rpc.publicnode.com',
  [NETWORK_IDS.BSC_TESTNET]: 'https://bsc-testnet.publicnode.com',
} as const;

// =============================================================================
// STORAGE KEYS
// =============================================================================

export const STORAGE_KEYS = {
  WALLETS: 'wallets',
  WALLET_COUNT: 'walletCount',
} as const;

// =============================================================================
// VALIDATION CONSTANTS
// =============================================================================

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MNEMONIC_WORD_COUNT: 12,
  MAX_WALLET_NAME_LENGTH: 50,
} as const;

// =============================================================================
// UI CONSTANTS
// =============================================================================

export const UI = {
  LOADING_SPINNER: '🔄',
  ERROR_ICON: '❌',
  SUCCESS_ICON: '✅',
  WALLET_ICON: '🔑',
} as const;

// =============================================================================
// REDUX ACTION TYPES
// =============================================================================

export const REDUX_ACTIONS = {
  BALANCES: {
    FETCH: 'balances/fetch',
    FETCH_PENDING: 'balances/fetch/pending',
    FETCH_FULFILLED: 'balances/fetch/fulfilled',
    FETCH_REJECTED: 'balances/fetch/rejected',
  },
} as const;

// =============================================================================
// API ROUTES
// =============================================================================

export const API_ROUTES = {
  BALANCE: '/api/balance',
} as const;

// =============================================================================
// CURRENCY DECIMALS
// =============================================================================

export const DECIMALS = {
  ETH: 18,
  BNB: 18,
  USDC: 6,
  BTC: 8,
} as const;