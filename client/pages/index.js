import styles from '../styles/Home.module.css';
import Layout from './Layout.tsx';

import PhonesScrollList from '../components/PhonesScrollDiv';
import TabletsScrollList from '../components/TabletsScrollDiv';

export default function Home() {
  return (
      <Layout>
          <div className={styles.root}>
          <div className={styles.heroMobileDiv}>
            <img 
              src='/phone-images/S25-ultra.png'
              className={styles.heroMobileImage}
            />
            <img 
              src='/phone-hero-display.jpg'
              className={styles.heroDesktopImage}
            />
            <h1 style={{
              textAlign: 'center'
            }}>
              The new <span className='font-bold'> Samsung Galaxy S25 Ultra</span>
            </h1>
            <h1>From <span className='font-bold'>£1,249.00</span></h1>
          </div>

          <PhonesScrollList />
          <TabletsScrollList />
        </div>
      </Layout>
  );
}