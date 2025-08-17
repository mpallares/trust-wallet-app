import React from 'react';
import styles from './WalletCard.module.css';
import { SecureWallet, WalletBalance, NetworkConfig } from '../types';
import { ChainItem } from './ChainItem';
import { Button } from './Button';

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
        <Button
          onClick={() => onViewPrivateKey(wallet.id)}
          variant="secondary"
        >
          🔑 View Private Key
        </Button>
      </div>

      <div className={styles.addressesList}>
        <h4 className={styles.addressesTitle}>Addresses:</h4>
        {Object.entries(wallet.addresses).map(([chain, address]) => {
          return (
            <div key={chain} className={styles.addressItem}>
              <ChainItem chainKey={chain} variant="compact" />
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