import styles from '../../styles/ProductsPage.module.css';
import Layout from '../Layout';
import RenderProductPageListings from '../../components/RenderProductPageListings';
import useProductData from '../../hooks/useFetchProductData';

export default function PhonesPage() {
    const { data, isLoading, error } = useProductData('tablets'); 

    return (
        <Layout>
            <div className={styles.pageDiv}>
                <ul>
                    <RenderProductPageListings 
                        productData={data}
                        isLoading={isLoading}
                        error={error}
                    />
                </ul>
            </div>
        </Layout>
    )
}