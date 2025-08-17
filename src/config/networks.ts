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

export const TESTNET_NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    id: 'sepolia',
    name: 'ethereum-sepolia',
    displayName: 'Ethereum Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.publicnode.com',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    testnet: true,
   
  },
  'bsc-testnet': {
    id: 'bsc-testnet',
    name: 'bsc-testnet',
    displayName: 'BSC Testnet',
    chainId: 97,
    rpcUrl: 'https://bsc-testnet.publicnode.com',
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