import { useState, useEffect } from 'react'
import Header from "../components/Header";
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  
  return (
    <>
      <Header 
        setIsMenuOpen={() => {
          setIsMenuOpen(!isMenuOpen)
        }}
      />
       {children}
      <div className={styles.backgroundPattern} />
    </>
  );
}