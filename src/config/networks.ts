import type { NetworkConfig } from '../types';
import { NETWORK_IDS, CHAIN_IDS, RPC_URLS } from '../constants';

export const TESTNET_NETWORKS: Record<string, NetworkConfig> = {
  [NETWORK_IDS.SEPOLIA]: {
    id: NETWORK_IDS.SEPOLIA,
    name: 'ethereum-sepolia',
    displayName: 'Ethereum Sepolia',
    chainId: CHAIN_IDS.SEPOLIA,
    rpcUrl: RPC_URLS[NETWORK_IDS.SEPOLIA],
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    testnet: true,
  },
  [NETWORK_IDS.BSC_TESTNET]: {
    id: NETWORK_IDS.BSC_TESTNET,
    name: 'bsc-testnet',
    displayName: 'BSC Testnet',
    chainId: CHAIN_IDS.BSC_TESTNET,
    rpcUrl: RPC_URLS[NETWORK_IDS.BSC_TESTNET],
    explorerUrl: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'Test BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    testnet: true,
  },
};

export const getAllTestnetNetworks = (): NetworkConfig[] => {
  return Object.values(TESTNET_NETWORKS);
};

export const getNetworkById = (id: string): NetworkConfig | null => {
  return TESTNET_NETWORKS[id] || null;
};