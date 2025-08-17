'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './wallets.module.css';
import { exportMnemonic } from '../../lib/secureWallet';
import { useWallets } from '../../hooks/useWallets';
import { useAppSelector } from '../../store/hooks';
import { useBalancePolling } from '../../hooks/useBalancePolling';
import { getAllTestnetNetworks } from '../../config/networks';

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
      <div className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          ←
        </button>
        <h1 className={styles.title}>My Wallets</h1>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.walletsList}>
          {wallets.map((wallet) => (
            <div key={wallet.id} className={styles.walletCard}>
              <div className={styles.walletHeader}>
                <div className={styles.walletInfo}>
                  <h3 className={styles.walletTitle}>
                    {wallet.name || `Wallet #${wallet.id.slice(-6)}`}
                  </h3>
                  <p className={styles.walletDate}>
                    Created: {formatDate(wallet.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleViewPrivateKey(wallet.id)}
                  className={styles.viewKeyButton}
                >
                  🔑 View Private Key
                </button>
              </div>

              <div className={styles.addressesList}>
                <h4 className={styles.addressesTitle}>Addresses:</h4>
                {Object.entries(wallet.addresses).map(([chain, address]) => {
                  const getChainDisplay = (chainKey: string) => {
                    switch (chainKey) {
                      case 'ethereum':
                        return {
                          name: 'Ethereum',
                          icon: 'Ξ',
                          iconClass: styles.ethereumIcon,
                        };
                      case 'bnbchain':
                        return {
                          name: 'BNB Chain',
                          icon: 'B',
                          iconClass: styles.bnbchainIcon,
                        };
                      default:
                        return { name: chainKey, icon: '?', iconClass: '' };
                    }
                  };

                  const chainInfo = getChainDisplay(chain);

                  return (
                    <div key={chain} className={styles.addressItem}>
                      <span className={styles.chainName}>
                        <div
                          className={`${styles.chainIcon} ${chainInfo.iconClass}`}
                        >
                          {chainInfo.icon}
                        </div>
                        {chainInfo.name}:
                      </span>
                      <span className={styles.address}>{address}</span>
                    </div>
                  );
                })}
              </div>

              {/* Testnet Balances */}
              <div className={styles.balancesSection}>
                <h4 className={styles.balancesTitle}>
                  Testnet Balances
                  {isWalletBalancesLoading(wallet.id) && (
                    <span className={styles.loadingSpinner}>🔄</span>
                  )}
                </h4>
                {getWalletBalances(wallet.id).length > 0 ? (
                  <div className={styles.balancesList}>
                    {getWalletBalances(wallet.id).map((balance) => {
                      const networks = getAllTestnetNetworks();
                      const network = networks.find(
                        (n) => n.id === balance.networkId
                      );

                      return (
                        <div
                          key={`${balance.address}-${balance.networkId}`}
                          className={styles.balanceItem}
                        >
                          <span className={styles.balanceNetwork}>
                            {network?.displayName || balance.networkId}:
                          </span>
                          <span
                            className={`${styles.balanceAmount} ${
                              balance.error ? styles.balanceError : ''
                            }`}
                          >
                            {balance.error
                              ? 'Error'
                              : `${balance.formattedBalance} ${network?.nativeCurrency.symbol}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : !isWalletBalancesLoading(wallet.id) ? (
                  <p className={styles.noBalances}>Loading balances...</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Private Key Modal */}
      {showPrivateKey && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              {!decryptedMnemonic && (
                <h3 className={styles.modalTitle}>Enter Password</h3>
              )}
              <button
                onClick={closePrivateKeyModal}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletsPage;
