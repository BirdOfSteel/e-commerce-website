import { useState, useEffect } from 'react';
import styles from '../../styles/ProductsPage.module.css';
import Layout from '../Layout.tsx';
import RenderProductPageListings from '../../components/RenderProductPageListings.tsx';

export default function phonesPage() {
    const [ tabletData, setTabletData ] = useState([])

    useEffect(() => { // CHANGE THIS TO WORK TO FETCH FROM RENDER URL
        fetch('http://localhost:3001/phones')
            .then((res) => res.json())
            .then((data) => setTabletData(data));
    }, []);

    return (
        <Layout>
            <div className={styles.pageDiv}>
                <ul>
                    <RenderProductPageListings productData={tabletData}/>
                </ul>
            </div>
        </Layout>
    )
}