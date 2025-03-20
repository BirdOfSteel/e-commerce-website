import { useState, useEffect } from 'react';
import styles from '../../styles/ProductsPage.module.css';
import Layout from '../Layout.tsx';

export default function phonesPage() {
    const [ tabletData, setTabletData ] = useState([])

    useEffect(() => {
        fetch('/tabletData.json')
            .then((res) => res.json())
            .then((data) => setTabletData(data))
    },[])

    return (
        <>
            <Layout>
                <div className={styles.pageDiv}>
                    <ul>
                        {
                            tabletData.map((phoneObject, index) => {
                                return (
                                    <li className={styles.productListItem}>
                                        <img src={phoneObject.src} />
                                        <div className={styles.productListItemInfo}>                                        
                                            <div className={styles.productListInfoDivLeft}>
                                                <p>{phoneObject.price}</p>
                                                <p>{phoneObject.name}</p>
                                            </div>
                                            <div className={styles.productListInfoDivRight}>
                                                <img src={'/cart-icon.png'}/>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </Layout>
        </>
    )
}