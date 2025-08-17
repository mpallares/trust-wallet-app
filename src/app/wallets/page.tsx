'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './wallets.module.css';
import { exportMnemonic } from '../../lib/secureWallet';
import { useWallets } from '../../hooks/useWallets';
import { useAppSelector } from '../../store/hooks';
import { useBalancePolling } from '../../hooks/useBalancePolling';
import { getAllTestnetNetworks } from '../../config/networks';
import { Modal } from '../../components/Modal';
import { WalletCard } from '../../components/WalletCard';

const WalletsPage = () => {
  const router = useRouter();
  const { wallets } = useWallets();
  const { wallets: balanceWallets } = useAppSelector((state) => state.balances);
  useBalancePolling();

  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decryptedMnemonic, setDecryptedMnemonic] = useState<string | null>(
    null
  );

  // Handle viewing private key
  const handleViewPrivateKey = (walletId: string) => {
    setSelectedWallet(walletId);
    setShowPrivateKey(true);
    setPassword('');
    setError(null);
    setDecryptedMnemonic(null);
  };

  // Handle password submission
  const handlePasswordSubmit = async () => {
    if (!selectedWallet || !password) return;

    try {
      setError(null);
      // Decrypt and show the mnemonic using Trust Wallet Core encryption
      const mnemonic = await exportMnemonic(selectedWallet, password);

      // Update state to show the mnemonic
      setDecryptedMnemonic(mnemonic);
    } catch (err) {
      setError('Invalid password or failed to decrypt wallet');
      console.error('Decryption failed:', err);
    }
  };

  // Close private key modal
  const closePrivateKeyModal = () => {
    setShowPrivateKey(false);
    setSelectedWallet(null);
    setPassword('');
    setError(null);
    setDecryptedMnemonic(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get wallet balances
  const getWalletBalances = (walletId: string) => {
    return balanceWallets[walletId]?.balances || [];
  };

  // Check if wallet balances are loading
  const isWalletBalancesLoading = (walletId: string) => {
    return balanceWallets[walletId]?.isLoading || false;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          ←
        </button>
        <h1 className={styles.title}>My Wallets</h1>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.walletsList}>
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onViewPrivateKey={handleViewPrivateKey}
              getWalletBalances={getWalletBalances}
              isWalletBalancesLoading={isWalletBalancesLoading}
              formatDate={formatDate}
              getAllTestnetNetworks={getAllTestnetNetworks}
            />
          ))}
        </div>
      </main>

      {/* Private Key Modal */}
      <Modal
        isOpen={showPrivateKey}
        onClose={closePrivateKeyModal}
        title={!decryptedMnemonic ? "Enter Password" : undefined}
      >
        {!decryptedMnemonic && (
          <>
            <p className={styles.modalDescription}>
              Enter your password to view the private key for Wallet #
              {selectedWallet?.slice(-6)}
            </p>
            <div className={styles.passwordInput}>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter password'
                className={styles.input}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handlePasswordSubmit()
                }
              />
            </div>
          </>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div
          className={`${styles.privateKeyDisplay} ${
            !decryptedMnemonic ? styles.hidden : ''
          }`}
        >
          <h4>Mnemonic Phrase:</h4>
          <div className={styles.mnemonicBox}>
            {decryptedMnemonic ||
              'Mnemonic will be displayed here after successful decryption'}
          </div>
          <p className={styles.warning}>
            ⚠️ Never share your mnemonic phrase with anyone!
          </p>
        </div>

        <div className={styles.modalButtons}>
          <button
            onClick={handlePasswordSubmit}
            className={styles.submitButton}
            disabled={!password}
          >
            View Private Key
          </button>
          <button
            onClick={closePrivateKeyModal}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default WalletsPage;
