'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { initializeWalletCore, WalletCore } from '../lib/walletCore';
import { createSecureWallet } from '../lib/secureWallet';
import { useWallets } from '../hooks/useWallets';

const HomePage = () => {
  const router = useRouter();
  const { addWallet, getWalletsCount } = useWallets();
  
  const [walletCore, setWalletCore] = useState<WalletCore | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initSuccess, setInitSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Initialize Trust Wallet Core
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);
        setError(null);
        
        const core = await initializeWalletCore();
        setWalletCore(core);
        
        setInitSuccess(true);
      } catch (err) {
        const errorMsg = `Failed to initialize Trust Wallet Core: ${err}`;
        setError(errorMsg);
        console.error(errorMsg);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  // Create a new wallet with password protection
  const createWallet = async () => {
    if (!walletCore) {
      setError('Wallet Core not initialized. Please refresh the page.');
      return;
    }

    // Get password from user
    const password = prompt(
      'Enter a password to secure your wallet (min 8 characters):'
    );
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const walletName = prompt('Enter a name for your wallet:') || 'My Wallet';

    try {
      setIsCreating(true);
      setError(null);

      // Create encrypted wallet using Trust Wallet Core's AES encryption
      const newWallet = await createSecureWallet(password, walletName);

      // Save encrypted wallet
      addWallet(newWallet);

      // Show success popup
      setShowSuccessPopup(true);
    } catch (err) {
      setError(`Failed to create wallet: ${err}`);
      console.error('Wallet creation failed:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Navigate to existing wallets
  const viewWallets = () => {
    router.push('/wallets');
  };


  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.brandName}>Trust Wallet</h1>
        <p className={styles.brandTagline}>Multi-Chain Wallet Manager</p>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>
            Secure Multi-Chain
            <span className={styles.gradientText}> Wallet Solution</span>
          </h2>
          <p className={styles.heroDescription}>
            Built with Trust Wallet Core supporting 130+ blockchains. Generate
            secure HD wallets compatible with all EVM networks including
            Ethereum, BNB Chain, Polygon, and more. Industry-leading
            cryptographic standards with encrypted storage.
          </p>

          {/* Supported Chains */}
          <div className={styles.chainGrid}>
            <div className={styles.chainItem}>
              <div className={`${styles.chainIcon} ${styles.bitcoinIcon}`}>
                ₿
              </div>
              <span>Bitcoin</span>
            </div>
            <div className={styles.chainItem}>
              <div className={`${styles.chainIcon} ${styles.ethereumIcon}`}>
                Ξ
              </div>
              <span>Ethereum</span>
            </div>
            <div className={styles.chainItem}>
              <div className={`${styles.chainIcon} ${styles.binanceIcon}`}>
                B
              </div>
              <span>BSC</span>
            </div>
            <div className={styles.chainItem}>
              <div className={`${styles.chainIcon} ${styles.polygonIcon}`}>
                ⟠
              </div>
              <span>Polygon</span>
            </div>
            <div className={styles.chainItem}>
              <div className={`${styles.chainIcon} ${styles.solanaIcon}`}>
                ◎
              </div>
              <span>Solana</span>
            </div>
          </div>
        </div>

        {/* Initialization Status */}
        {isInitializing && (
          <div className={styles.statusCard}>
            <div className={styles.loadingSpinner}></div>
            <h3 className={styles.statusTitle}>
              Initializing Trust Wallet Core
            </h3>
            <p className={styles.statusDescription}>
              Loading WebAssembly module for multi-chain support...
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚠️</div>
            <div className={styles.errorContent}>
              <h3 className={styles.errorTitle}>Initialization Error</h3>
              <p className={styles.errorDescription}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className={styles.retryButton}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popup}>
              <div className={styles.popupIcon}>🎉</div>
              <h3 className={styles.popupTitle}>
                Wallet Created Successfully!
              </h3>
              <p className={styles.popupDescription}>
                Your new multi-chain wallet has been generated and saved
                securely.
              </p>
              <div className={styles.popupButtons}>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className={styles.popupButton}
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    router.push('/wallets');
                  }}
                  className={styles.popupButtonSecondary}
                >
                  View All Wallets
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success State - Wallet Actions */}
        {initSuccess && !error && (
          <div className={styles.actionsCard}>
            <div className={styles.actionsHeader}>
              <h3 className={styles.actionsTitle}>🚀 Ready to Get Started</h3>
              <p className={styles.actionsDescription}>
                Trust Wallet Core is ready. Create your first secure multi-chain
                wallet or manage existing ones.
              </p>
            </div>

            <div className={styles.actionButtons}>
              <button
                onClick={createWallet}
                disabled={isCreating}
                className={`${styles.primaryButton} ${
                  isCreating ? styles.loading : ''
                }`}
              >
                {isCreating ? (
                  <>
                    <div className={styles.buttonSpinner}></div>
                    Creating Wallet...
                  </>
                ) : (
                  <>
                    <span className={styles.buttonIcon}>🎲</span>
                    Create New Wallet
                  </>
                )}
              </button>

              {getWalletsCount() > 0 && (
                <button
                  disabled={
                    isCreating || isInitializing || getWalletsCount() === 0
                  }
                  onClick={viewWallets}
                  className={styles.secondaryButton}
                >
                  <span className={styles.buttonIcon}>💼</span>
                  View Wallets ({getWalletsCount()})
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
