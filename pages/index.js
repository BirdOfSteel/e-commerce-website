import styles from '../styles/Home.module.css';
import Layout from './Layout.tsx';

import PhonesScrollList from '../components/PhonesScrollDiv'
import TabletsScrollList from '../components/TabletsScrollDiv'

export default function Home() {
  return (
    <div className={styles.root}>
      <Layout>
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
            src='/S25-ultra.png'
            className={styles.heroMobileImage}
          />
          <h1>From £1,249.00</h1>
        </div>

        <PhonesScrollList />
        <TabletsScrollList />
      </Layout>












      <style jsx global>
        {`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}
     </style>
    </div>
  );
}
