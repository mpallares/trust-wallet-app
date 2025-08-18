// Simple interface based on actual Trust Wallet Core exports
export interface WalletCore {
  HDWallet: unknown;
  CoinType: unknown;
  HexCoding: unknown;
  AnyAddress: unknown;
}

let walletCoreInstance: WalletCore | null = null;

export const initializeWalletCore = async (): Promise<WalletCore> => {
  if (walletCoreInstance) {
    return walletCoreInstance;
  }

  try {
   
    
    const { initWasm } = await import('@trustwallet/wallet-core');
    
    let core;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      core = await (initWasm as any)({
        locateFile: (path: string) => {
          if (path.endsWith('.wasm')) {
            return '/wallet-core.wasm';
          }
          return path;
        },
      });
    } catch {
      core = await initWasm();
    }
    
    
    const { HDWallet, CoinType, HexCoding, AnyAddress } = core;
    
    // Cache the instance
    walletCoreInstance = {
      HDWallet,
      CoinType, 
      HexCoding,
      AnyAddress,
    };
    
    return walletCoreInstance;
  } catch (error) {
    throw new Error(`Failed to initialize Trust Wallet Core: ${error}`);
  }
};

export const clearWalletCore = (): void => {
  walletCoreInstance = null;
};
