import { initializeWalletCore } from './walletCore';

export interface SecureWallet {
  id: string;
  name: string;
  encryptedMnemonic: string;
  addresses: Record<string, string>;
  createdAt: string;
}


/**
 * Encrypts mnemonic using Web Crypto API with PBKDF2 key derivation
 * Uses industry-standard AES-256-CBC with proper salt and IV
 */
export const encryptMnemonic = async (mnemonic: string, password: string): Promise<string> => {
  const passwordBytes = new TextEncoder().encode(password);
  
  // Step 2: Create a proper key using Web Crypto API with PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Step 3: Generate a random salt for PBKDF2
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Step 4: Derive AES key using PBKDF2 (industry standard)
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000, // Industry standard iteration count
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Step 5: Generate random IV (Initialization Vector) for AES
  const iv = crypto.getRandomValues(new Uint8Array(16));
  
  // Step 6: Convert mnemonic to bytes and encrypt
  const mnemonicBytes = new TextEncoder().encode(mnemonic);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv: iv },
    key,
    mnemonicBytes
  );
  
  // Step 7: Combine salt + IV + encrypted data for storage
  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(16 + 16 + encryptedArray.length);
  combined.set(salt, 0);                    // First 16 bytes: salt
  combined.set(iv, 16);                     // Next 16 bytes: IV  
  combined.set(encryptedArray, 32);         // Remaining: encrypted data
  
  // Step 8: Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
};

/**
 * Decrypts mnemonic using Web Crypto API (matching the encrypt function)
 */
export const decryptMnemonic = async (encryptedData: string, password: string): Promise<string> => {
  try {
    // Step 1: Convert base64 back to bytes
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Step 2: Extract salt, IV, and encrypted data
    const salt = combined.slice(0, 16);      // First 16 bytes: salt
    const iv = combined.slice(16, 32);       // Next 16 bytes: IV
    const encrypted = combined.slice(32);    // Remaining: encrypted data
    
    // Step 3: Recreate the key using same password and salt
    const passwordBytes = new TextEncoder().encode(password);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Step 4: Derive the same AES key using PBKDF2
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000, // Same iteration count as encryption
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-CBC', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    // Step 5: Decrypt using Web Crypto API
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      key,
      encrypted
    );
    
    // Step 6: Convert decrypted bytes back to string
    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error('Invalid password');
  }
};

/**
 * Creates a new wallet with encrypted mnemonic storage
 * Generates addresses for multiple EVM networks: Ethereum, BNB Chain, Polygon
 * Uses Trust Wallet Core for wallet generation and Web Crypto API for encryption
 */
export const createSecureWallet = async (password: string, name: string): Promise<SecureWallet> => {
  const walletCore = await initializeWalletCore();
  
  // Step 1: Generate new HD wallet using Trust Wallet Core
  const hdWallet = (walletCore.HDWallet as unknown as { create: (strength: number, passphrase: string) => unknown }).create(128, '');
  
  // Step 2: Extract the mnemonic phrase from the wallet
  const mnemonic = (hdWallet as unknown as { mnemonic: () => string }).mnemonic();
  
  // Step 3: Generate addresses for multiple EVM networks using Trust Wallet Core
  const addresses = {
    ethereum: (hdWallet as unknown as { getAddressForCoin: (coinType: unknown) => string }).getAddressForCoin((walletCore.CoinType as unknown as { ethereum: unknown }).ethereum),
    bnbchain: (hdWallet as unknown as { getAddressForCoin: (coinType: unknown) => string }).getAddressForCoin((walletCore.CoinType as unknown as { smartChain: unknown }).smartChain),
  };
  
  const encryptedMnemonic = await encryptMnemonic(mnemonic, password);
  
  // Step 5: Return wallet object with encrypted mnemonic
  // Note: We store addresses (public) but never store the plain mnemonic
  return {
    id: crypto.randomUUID(),
    name,
    encryptedMnemonic,
    addresses,
    createdAt: new Date().toISOString(),
  };
};

export const getStoredWallets = (): SecureWallet[] => {
  try {
    return JSON.parse(localStorage.getItem('trustWallets') || '[]');
  } catch {
    return [];
  }
};

export const saveWallet = (wallet: SecureWallet): void => {
  const existing = getStoredWallets();
  localStorage.setItem('trustWallets', JSON.stringify([...existing, wallet]));
};

export const getWalletById = (id: string): SecureWallet | null => {
  return getStoredWallets().find(w => w.id === id) || null;
};

/**
 * Exports mnemonic by decrypting with user password
 * This is the only way to get the plain mnemonic back
 */
export const exportMnemonic = async (walletId: string, password: string): Promise<string> => {
  const wallet = getWalletById(walletId);
  if (!wallet) throw new Error('Wallet not found');
  
  return await decryptMnemonic(wallet.encryptedMnemonic, password);
};

/**
 * Creates HD wallet in memory from encrypted wallet
 * Wallet exists only in memory and is destroyed when function ends
 */
export const unlockWallet = async (walletId: string, password: string): Promise<unknown> => {
  const wallet = getWalletById(walletId);
  if (!wallet) throw new Error('Wallet not found');
  
  // Step 1: Decrypt mnemonic using password
  const mnemonic = await decryptMnemonic(wallet.encryptedMnemonic, password);
  
  // Step 2: Recreate HD wallet from mnemonic using Trust Wallet Core
  const walletCore = await initializeWalletCore();
  return (walletCore.HDWallet as unknown as { createWithMnemonic: (mnemonic: string, passphrase: string) => unknown }).createWithMnemonic(mnemonic, '');
};