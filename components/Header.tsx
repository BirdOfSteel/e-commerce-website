import Link from "next/link";
import styles from '../styles/Header.module.css';

export default function Header({ setIsMenuOpen }) {
  return (
    <header className={styles.header}>
        <img className={styles.hamburgerIcon} src='/hamburger.png' onClick={setIsMenuOpen}/>
        <img className={styles.cartIcon} src='/cart-icon.png'/>
      

      {/* <nav className="nav">
        <Link href="/" className="logo">MySite</Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav> */}
    </header>
  );
}