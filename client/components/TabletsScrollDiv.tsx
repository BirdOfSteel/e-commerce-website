import styles from '../styles/Home.module.css';
import useFetchProductData from '../hooks/useFetchProductData';
import RenderProductScrollListings from './RenderProductScrollList';

export default function TabletsScrollList() {
    const { data, isLoading, error } = useFetchProductData('tablets');

    if (error) return <p>Error: {error.message}</p>

    return (
        <div className={styles.scrollListDiv}>
            <p className={styles.scrollListHeading}>Tablets</p>
            <ul className={styles.productScrollList}>
                <RenderProductScrollListings
                    data={data}
                    isLoading={isLoading}
                    error={error}
                />
            </ul>
        </div>
    )
}