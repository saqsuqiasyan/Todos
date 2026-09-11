import React from 'react';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.checkmark}>✓</span>
        <h1 className={styles.title}>ToDos</h1>
      </div>
      <p className={styles.tagline}>Organize your tasks by priority</p>
    </header>
  );
}

export default Header;
