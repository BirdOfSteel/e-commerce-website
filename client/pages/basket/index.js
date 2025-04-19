import { useEffect } from 'react';
import Layout from '../Layout.tsx';
import styles from '../../styles/Basket.module.css';

import BasketList from './BasketList'
import { ShoppingBasketProvider } from '../../context/shoppingBasketProvider.tsx';


export default function Basket() {
    
    return (
        <Layout>
            <div className={styles.pageDiv}>
                <BasketList />   
            </div>  
        </Layout>
    )
}

