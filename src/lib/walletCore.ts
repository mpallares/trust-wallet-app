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
    const walletCoreModule = await import('@trustwallet/wallet-core');

    if (!walletCoreModule.initWasm) {
      throw new Error(
        'initWasm function not found in Trust Wallet Core module'
      );
    }

    let initPromise: Promise<unknown>;
    try {
      initPromise = (
        walletCoreModule.initWasm as (options?: {
          locateFile?: (path: string) => string;
        }) => Promise<unknown>
      )({
        locateFile: (path: string) => {
          if (path.endsWith('.wasm')) {
            const wasmPath = '/wallet-core.wasm';
            return wasmPath;
          }
          return path;
        },
      });
    } catch {
      initPromise = walletCoreModule.initWasm();
    }

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('WASM initialization timeout')), 30000);
    });

    const core = await Promise.race([initPromise, timeoutPromise]);

    if (!core || typeof core !== 'object') {
      throw new Error('Invalid core object returned from initWasm');
    }

    const coreObj = core as Record<string, unknown>;
    if (!coreObj.HDWallet || !coreObj.CoinType) {
      throw new Error('Required Trust Wallet Core components not available');
    }

    // Cache the instance
    walletCoreInstance = {
      HDWallet: coreObj.HDWallet,
      CoinType: coreObj.CoinType,
      HexCoding: coreObj.HexCoding || null,
      AnyAddress: coreObj.AnyAddress || null,
    };
    return walletCoreInstance;
  } catch (error) {
    throw new Error(`Trust Wallet Core initialization failed`);
  }
};
export const clearWalletCore = (): void => {
  walletCoreInstance = null;
};
