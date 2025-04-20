import Layout from '../Layout';
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

