import styles from '../styles/ProductsPage.module.css';
import { RenderListingsProps } from '../types/types';
import { useAddToBasket } from '../hooks/useAddToBasket';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


export default function RenderProductPageListings({ data, isLoading, error }: RenderListingsProps) {
    const addToBasket = useAddToBasket();

    if (error) return <p>Error: {error.message}</p>


    function ProductSkeleton() { // skeleton structure
        return (
            <li className={styles.productListItem}>
                <Skeleton height={180} width="100%" />

                <div className={styles.productListItemInfo} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <div className={styles.productListInfoDivTop} style={{ flex: 1 }}>
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={20} width="80%" style={{ marginTop: '0.5rem' }} />
                </div>
                <div className={styles.productListInfoDivBottom} style={{ marginLeft: '1rem' }}>
                    <Skeleton circle height={40} width={40} />
                </div>
                </div>
            </li>
        )
    };


    return (
        <>
        { isLoading ? 
            Array.from({length: 9}).map((_, index) => { // returns loading skeletons
                return (
                    <ProductSkeleton key={index}/>
                )
            })
                
                : 

            data.map((productObject) => ( // render listings
                <li key={productObject.product_id} className={styles.productListItem}>
                    <img src={productObject.filepath} alt={`${productObject.name} image`} />
                    <div className={styles.productListItemInfo}>
                        <div className={styles.productListInfoDivTop}>
                            <p className='font-bold'>{productObject.name}</p>
                        </div>
                        <div className={styles.productListInfoDivBottom}>
                            <p>{'£' + productObject.price}</p>
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
