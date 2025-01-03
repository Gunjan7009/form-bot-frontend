import React from 'react';
import styles from './LoadingOverlay.module.css';

const LoadingOverlay = () => {
  return (
    <div className={styles.overlayContainer}>
      <div className={styles.loadingBox}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>Processing...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;