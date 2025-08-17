import React from 'react';
import styles from './WalletCard.module.css';
import { SecureWallet, WalletBalance, NetworkConfig } from '../types';

export interface WalletCardProps {
  wallet: SecureWallet;
  onViewPrivateKey: (walletId: string) => void;
  getWalletBalances: (walletId: string) => WalletBalance[];
  isWalletBalancesLoading: (walletId: string) => boolean;
  formatDate: (dateString: string) => string;
  getAllTestnetNetworks: () => NetworkConfig[];
}

export const WalletCard = ({
  wallet,
  onViewPrivateKey,
  getWalletBalances,
  isWalletBalancesLoading,
  formatDate,
  getAllTestnetNetworks,
}: WalletCardProps) => {
  const getChainDisplay = (chainKey: string) => {
    switch (chainKey) {
      case 'ethereum':
        return {
          name: 'Ethereum',
          icon: 'E',
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

  return (
    <article className={styles.walletCard}>
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
          onClick={() => onViewPrivateKey(wallet.id)}
          className={styles.viewKeyButton}
        >
          🔑 View Private Key
        </button>
      </div>

      <div className={styles.addressesList}>
        <h4 className={styles.addressesTitle}>Addresses:</h4>
        {Object.entries(wallet.addresses).map(([chain, address]) => {
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
    </article>
  );
};

export default WalletCard;