import Layout from '../Layout.tsx';
import styles from '../../styles/Basket.module.css';

import BasketList from './BasketList'


export default function Basket() {
    
    return (
        <Layout>
            <div className={styles.pageDiv}>
                <BasketList />   
            </div>  
        </Layout>
    )
}

