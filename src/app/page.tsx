'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { initializeWalletCore, WalletCore } from '../lib/walletCore';
import { createSecureWallet } from '../lib/secureWallet';
import { useWallets } from '../hooks/useWallets';
import { Button } from '../components/Button';
import { ChainItem } from '../components/ChainItem';
import { Modal } from '../components/Modal';
import { WalletCreationForm } from '../components/WalletCreationForm';

const HomePage = () => {
  const router = useRouter();
  const { addWallet, getWalletsCount } = useWallets();
  
  const [walletCore, setWalletCore] = useState<WalletCore | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initSuccess, setInitSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
  const handleCreateWallet = async (formData: { walletName: string; password: string }) => {
    if (!walletCore) {
      setError('Wallet Core not initialized. Please refresh the page.');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      // Create encrypted wallet using Trust Wallet Core's AES encryption
      const newWallet = await createSecureWallet(formData.password, formData.walletName);

      // Save encrypted wallet
      addWallet(newWallet);

      // Close modal and show success popup
      setShowCreateModal(false);
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
      <header className={styles.header}>
        <h1 className={styles.brandName}>Trust Wallet</h1>
        <p className={styles.brandTagline}>Multi-Chain Wallet Manager</p>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>
            Secure Multi-Chain
            <span className={styles.gradientText}> Wallet Solution</span>
          </h2>
          <p className={styles.heroDescription}>
            Generate secure HD wallets compatible with all EVM networks including Ethereum and BNB Chain.
          </p>

          {/* Supported Chains */}
          <div className={styles.chainGrid}>
            <ChainItem chainKey="ethereum" />
            <ChainItem chainKey="bnbchain" name="BSC" />
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
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
              >
                Retry
              </Button>
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
                <Button
                  onClick={() => setShowSuccessPopup(false)}
                  variant="secondary"
                >
                  Continue
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    router.push('/wallets');
                  }}
                  variant="primary"
                >
                  View All Wallets
                </Button>
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
              <Button
                onClick={() => setShowCreateModal(true)}
                disabled={isCreating}
                variant="primary"
              >
                <span className={styles.buttonIcon}>🎲</span>
                Create New Wallet
              </Button>

              {getWalletsCount() > 0 && (
                <Button
                  disabled={
                    isCreating || isInitializing || getWalletsCount() === 0
                  }
                  onClick={viewWallets}
                  variant="secondary"
                >
                  <span className={styles.buttonIcon}>💼</span>
                  View Wallets ({getWalletsCount()})
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Wallet Creation Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Wallet"
        >
          <WalletCreationForm
            onSubmit={handleCreateWallet}
            onCancel={() => setShowCreateModal(false)}
            isCreating={isCreating}
          />
        </Modal>
      </main>
    </div>
  );
};

export default HomePage;
