import styles from '../styles/ProductsPage.module.css';
import { RenderListingsProps } from '../types/types';
import { useAddToBasket } from '../hooks/useAddToBasket';
import Skeleton from 'react-loading-skeleton';

export default function RenderProductPageListings({ data, isLoading, error }: RenderListingsProps) {
    const addToBasket = useAddToBasket();

    if (error) return <p>Error: {error.message}</p>

    return (
        <>
        { isLoading ? 
            Array.from({length: 9}).map((i) => {
                <Skeleton className={styles.productListItem} />
            })
                
                : 

            data.map((productObject) => (
                <li key={productObject.id} className={styles.productListItem}>
                    <img src={productObject.img_src} alt={productObject.name} />
                    <div className={styles.productListItemInfo}>
                        <div className={styles.productListInfoDivLeft}>
                            <p>{productObject.price}</p>
                            <p>{productObject.name}</p>
                        </div>
                        <div className={styles.productListInfoDivRight}>
                            <img
                                src={'/cart-icon.png'}
                                alt="Add to cart"
                                onClick={(e) => addToBasket(productObject)}
                            />
                        </div>
                    </div>
                </li>
            ))
        }
        </>
    );
}
