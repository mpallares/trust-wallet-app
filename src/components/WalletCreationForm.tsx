import React, { useState } from 'react';
import styles from './WalletCreationForm.module.css';
import { Button } from './Button';

export interface WalletCreationFormProps {
  onSubmit: (data: { walletName: string; password: string }) => void;
  onCancel: () => void;
  isCreating?: boolean;
}

export const WalletCreationForm = ({
  onSubmit,
  onCancel,
  isCreating = false,
}: WalletCreationFormProps) => {
  const [walletName, setWalletName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!walletName.trim()) {
      newErrors.walletName = 'Wallet name is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ walletName: walletName.trim(), password });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>
          Wallet Name
        </label>
        <input
          id="walletName"
          type="text"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          className={`${styles.input} ${errors.walletName ? styles.inputError : ''}`}
          placeholder="Enter wallet name"
          disabled={isCreating}
        />
        {errors.walletName && (
          <span className={styles.error}>{errors.walletName}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
          placeholder="Minimum 8 characters"
          disabled={isCreating}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
          placeholder="Re-enter password"
          disabled={isCreating}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <div className={styles.buttons}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isCreating}
          disabled={isCreating}
        >
          Create Wallet
        </Button>
      </div>
    </form>
  );
};

export default WalletCreationForm;