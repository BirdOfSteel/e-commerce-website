import styles from '../styles/ProductsPage.module.css';
import { useState, useEffect } from 'react';
import { RenderListingsProps } from '../types/types';
import { useAddToBasket } from '../hooks/useAddToBasket';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function RenderProductPageListings({ data, isLoading, error, sortingMethod }: RenderListingsProps) {
    const addToBasket = useAddToBasket();
    const [ productList, setProductList ] = useState(data);
    
    // triggers sorting of product list
    useEffect(() => {
        sortProductList();
    },[sortingMethod, data])

    if (error) return <p>Error: {error.message}</p>

    // handles sorting fetched product list data
    function sortProductList() {
        let updatedProductList = null;

        if (sortingMethod === 'Featured') {
            updatedProductList = data;
        } 

        else if (sortingMethod === 'Low to High') {
            const lowToHigh = data.toSorted((a, b) => {
                return Number(a.price) - Number(b.price); 
            });
            
            updatedProductList = lowToHigh;
        } 
        
        else if (sortingMethod === 'High to Low') {
            const highToLow = data.toSorted((a, b) => {
                return Number(b.price) - Number(a.price); 
            });
            
            updatedProductList = highToLow;
        } 
        
        else {
            updatedProductList = data;
        }
        setProductList(updatedProductList)
    }
    
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

            productList.map((productObject) => ( // render listings
                <li key={productObject.product_id} className={styles.productListItem}>
                    <img src={productObject.filepath} alt={`${productObject.name} image`} />
                    <div className={styles.productListItemInfo}>
                        <div className={styles.productListInfoDivTop}>
                            <p className='font-bold'>{productObject.name}</p>
                        </div>
                        <div className={styles.productListInfoDivBottom}>
                            <p>{'£' + productObject.price}</p>
                            <svg 
                                className='w-[clamp(28px,5vw,35px)] h-[clamp(28px,5vw,35px)] mt-auto active:stroke-[rgb(255,165,0)] hover:stroke-[rgb(255,165,0)] active:scale-105 hover:scale-105 cursor-pointer transition duration-200 stroke-[black]' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.25" stroke="currentColor"
                                aria-label='Add to cart'
                                onClick={(e) => addToBasket(productObject)}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                    </div>
                </li>
            ))
        }
        </>
    );
}
