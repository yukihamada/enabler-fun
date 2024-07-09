import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
  return (
    <div className={`${styles.spinner} ${styles[size]}`} role="status">
      <span className={styles.visuallyHidden}>Loading...</span>
    </div>
  );
};

export default Loader;