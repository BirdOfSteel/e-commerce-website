import { useContext } from 'react';

import styles from '../styles/Home.module.css';
import Layout from './Layout.tsx';

import PhonesScrollList from '../components/PhonesScrollDiv';
import TabletsScrollList from '../components/TabletsScrollDiv';

export default function Home() {
  return (
      <Layout>
          <div className={styles.root}>
          <img 
            src='/phone-hero-display.jpg'
            className={styles.heroDesktopImage}
            />
          <div className={styles.heroMobileDiv}>
            <h1 style={{
              textAlign: 'center'
            }}>
              The new Samsung Galaxy S25 Ultra
            </h1>
            <img 
              src='/phone-images/S25-ultra.png'
              className={styles.heroMobileImage}
              />
            <h1>From £1,249.00</h1>
          </div>

          <PhonesScrollList />
          <TabletsScrollList />
        </div>
      </Layout>
  );
}