import { useState,useEffect } from 'react';
import styles from '../../styles/ProductsPage.module.css';
import Layout from '../Layout';
import RenderProductPageListings from '../../components/RenderProductPageListings';
import useProductData from '../../hooks/useFetchProductData';
import ProductFilterDropdown from '../../components/ProductFilterDropdown';

export default function PhonesPage() {
    const { data, isLoading, error } = useProductData('tablets'); 
    const [ sortingMethod, setSortingMethod ] = useState('Featured');
    
    return (
        <Layout>
            <div className={styles.pageDiv}>
                <ProductFilterDropdown 
                    sortingMethod={sortingMethod}
                    setSortingMethod={(method: string) => setSortingMethod(method)}
                />
                <ul>
                    <RenderProductPageListings 
                        data={data}
                        isLoading={isLoading}
                        error={error}
                        sortingMethod={sortingMethod} 
                    />
                </ul>
            </div>
        </Layout>
    )
}