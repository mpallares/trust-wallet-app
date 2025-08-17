import React from 'react';
import styles from './ChainItem.module.css';

export interface ChainItemProps {
  chainKey: string;
  name?: string;
  icon?: string;
  variant?: 'default' | 'compact';
}

export const ChainItem = ({ 
  chainKey, 
  name, 
  icon, 
  variant = 'default' 
}: ChainItemProps) => {
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
        return { 
          name: chainKey, 
          icon: '?', 
          iconClass: styles.defaultIcon 
        };
    }
  };

  const chainInfo = getChainDisplay(chainKey);
  const displayName = name || chainInfo.name;
  const displayIcon = icon || chainInfo.icon;

  if (variant === 'compact') {
    return (
      <span className={styles.chainName}>
        <div className={`${styles.chainIcon} ${styles.compact} ${chainInfo.iconClass}`}>
          {displayIcon}
        </div>
        {displayName}:
      </span>
    );
  }

  return (
    <div className={styles.chainItem}>
      <div className={`${styles.chainIcon} ${chainInfo.iconClass}`}>
        {displayIcon}
      </div>
      <span>{displayName}</span>
    </div>
  );
};

export default ChainItem;