import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {title && (
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>{title}</h3>
            <Button
              onClick={onClose}
              variant="icon"
            >
              ✕
            </Button>
          </div>
        )}
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;