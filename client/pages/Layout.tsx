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
      {children}
    </>
  );
}