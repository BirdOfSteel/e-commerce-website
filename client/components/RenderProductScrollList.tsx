import styles from '../styles/Home.module.css';
import { RenderListingsProps } from '../types/types';
import { useAddToBasket } from '../hooks/useAddToBasket';

export default function RenderProductScrollListings({data, isLoading, error}: RenderListingsProps) {
    if (error) return <p>Error: {error.message}</p>

    const addToBasket = useAddToBasket();
    
    return (
        <>
        {isLoading ?
            <p>Loading...</p>
                :
            data.map((productObject) => {
                return (
                    <li className={styles.scrollProductLi}>
                        <img 
                            src={productObject.filepath}
                            alt={productObject.name}
                            className={styles.scrollProductImage}
                        />
                        <div className={styles.scrollProductInfoDiv}>
                            <div className={styles.infoDivLeftDiv}>
                                <p className={styles.scrollProductLiName}>
                                    {productObject.name}
                                </p>
                                <p className={styles.scrollProductLiPrice}>
                                    {'£' + productObject.price}
                                </p>
                            </div>
                            
                            <img
                                className={styles.scrollProductLiCartIcon}
                                src={'/cart-icon.png'}
                                alt="Add to cart"
                                onClick={(e) => addToBasket(productObject)}
                            />
                        </div>
                    </li>
                )
            })
        }
        </>
    )
}