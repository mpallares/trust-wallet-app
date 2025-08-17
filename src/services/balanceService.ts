import { NetworkConfig } from '../config/networks';

export interface WalletBalance {
  address: string;
  networkId: string;
  balance: string;
  formattedBalance: string;
  lastUpdated: number;
  error?: string;
}

// cache
const cache = new Map<string, { balance: string; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

// Convert Wei to readable format
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

// Get balance for one address/network
export const getBalance = async (address: string, network: NetworkConfig): Promise<WalletBalance> => {
  const cacheKey = `${address}-${network.id}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  // Return cached if fresh
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return {
      address,
      networkId: network.id,
      balance: cached.balance,
      formattedBalance: formatBalance(cached.balance, network.nativeCurrency.decimals),
      lastUpdated: cached.timestamp,
    };
  }

  // Fetch fresh balance
  try {
    const response = await fetch('/api/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, networkId: network.id }),
    });

    const data = await response.json();

    if (data.success && data.balance) {
      const balanceWei = BigInt(data.balance).toString();
      
      // Cache result
      cache.set(cacheKey, { balance: balanceWei, timestamp: now });

      return {
        address,
        networkId: network.id,
        balance: balanceWei,
        formattedBalance: formatBalance(balanceWei, network.nativeCurrency.decimals),
        lastUpdated: now,
      };
    }
    
    throw new Error(data.error || 'API failed');
  } catch (error) {
    return {
      address,
      networkId: network.id,
      balance: '0',
      formattedBalance: '0',
      lastUpdated: now,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Get balances for multiple networks
export const getBalancesForWallet = async (
  addresses: Record<string, string>, 
  networks: NetworkConfig[]
): Promise<WalletBalance[]> => {
  const results: WalletBalance[] = [];

  for (const network of networks) {
    // Map network to address type
    const addressKey = network.id === 'sepolia' ? 'ethereum' : 'bnbchain';
    const address = addresses[addressKey];
    
    if (address) {
      // Add delay to prevent rate limiting
      if (results.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const balance = await getBalance(address, network);
      results.push(balance);
    }
  }

  return results;
};