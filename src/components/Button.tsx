import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    loading && styles.loading,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && variant === 'primary' ? (
        <>
          <div className={styles.buttonSpinner}></div>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;