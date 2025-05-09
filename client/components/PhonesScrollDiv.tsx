import styles from '../styles/Home.module.css';
import useFetchProductData from '../hooks/useFetchProductData';
import RenderProductScrollListings from './RenderProductScrollListings';

export default function PhonesScrollList() {
    const { data, isLoading, error } = useFetchProductData('phones');

    if (error) return <p>Error: {error.message}</p>

    return (
        <div className={styles.scrollListDiv}>
            <p className={styles.scrollListHeading}>Phones</p>
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