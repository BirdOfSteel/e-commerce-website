import Link from "next/link";
import styles from '../styles/Header.module.css';

export default function Header({ setIsMenuOpen }) {
  return (
    <header className={styles.header}>
        <img className={styles.hamburgerIcon} src='/hamburger.png' onClick={setIsMenuOpen}/>
        
        <div className={styles.rightIcons}>
          <Link href='/basket' className={styles.basketDiv}>
            <img 
              className={styles.cartIcon} src='/cart-icon.png'
            />
          </Link>
          <Link href='/register' className={styles.userDiv}>
            <img 
              className={styles.userIcon} src='/profile-icon.png'
            />
          </Link>
        </div>
      

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