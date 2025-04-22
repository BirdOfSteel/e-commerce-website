import styles from '../styles/Home.module.css';
import { RenderScrollListingsProps } from '../types/types';
import { useAddToBasket } from '../hooks/useAddToBasket';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function RenderProductScrollListings({ data, isLoading, error }: RenderScrollListingsProps) {
    const addToBasket = useAddToBasket();

    if (error) return <p>Error: {error.message}</p>;

    function ProductSkeleton() {
        return (
            <li className={styles.scrollProductLi}>
                <Skeleton height={150} width={150} className={styles.scrollProductImage} />
                <div className={styles.scrollProductInfoDiv}>
                    <div className={styles.infoDivLeftDiv}>
                        <Skeleton width={100} height={20} />
                        <Skeleton width={50} height={20} />
                    </div>
                    <Skeleton circle height={30} width={30} className={styles.scrollProductLiCartIcon} />
                </div>
            </li>
        );
    }

    return (
        <>  
            {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                ))
            ) : (
                data.map((productObject) => (
                    <li key={productObject.product_id} className={styles.scrollProductLi}>
                        <img
                            src={productObject.filepath}
                            alt={productObject.name}
                            className={styles.scrollProductImage}
                        />
                        <div className={styles.scrollProductInfoDiv}>
                            <div className={styles.infoDivLeftDiv}>
                                <p className={styles.scrollProductLiName}>{productObject.name}</p>
                                <p className={styles.scrollProductLiPrice}>{'£' + productObject.price}</p>
                            </div>
                            <svg 
                                className='w-[clamp(35px,5vw,45px)] h-[clamp(35px,5vw,45px)] mt-auto active:stroke-[rgb(255,165,0)] hover:stroke-[rgb(255,165,0)] active:scale-105 hover:scale-105 cursor-pointer transition duration-200 stroke-[black]' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.25" stroke="currentColor"
                                aria-label='Add to cart'
                                onClick={(e) => addToBasket(productObject)}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                    </li>
                ))
            )}
        </>
    );
}