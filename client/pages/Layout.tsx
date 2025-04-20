import Header from "../components/Header";
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <div className={styles.backgroundPattern} />
    </>
  );
}