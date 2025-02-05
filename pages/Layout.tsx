import { useState } from 'react'
import Header from "../components/Header";
import styles from '../styles/Layout.module.css';
import Link from 'next/link';

export default function Layout({ children }) {
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);


  return (
    <>
      <Header 
        setIsMenuOpen={() => {
          setIsMenuOpen(!isMenuOpen)
        }}
      />
      <div 
        className={styles.test}
        style={{
          transform: isMenuOpen ? 'translateX(0%)' : 'translateX(-100%)',
          transition: 'all 1s'
        }}
      >
        <Link href='/'>Home</Link>
        <Link href='/phones'>Phones</Link>
        <Link href='/tablets'>Tablets</Link>
      </div>
      {children}
    </>
  );
}