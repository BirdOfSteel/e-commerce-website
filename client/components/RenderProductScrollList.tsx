import styles from '../styles/Home.module.css';
import { RenderListingsProps } from '../types/types';

export default function RenderProductScrollListings({data, isLoading, error}: RenderListingsProps) {
    if (error) return <p>Error: {error.message}</p>
    console.log(data)
    return (
        <>
        {isLoading ?
            <p>Loading...</p>
                :
            data.map((productObject) => {
                console.log(productObject)
                console.log(`/images${productObject.filepath}`)
                return (
                    <li className={styles.scrollProductLi}>
                        <div className={styles.scrollProductImageDiv}>
                            <img 
                                src={productObject.filepath}
                                alt={productObject.name}
                                className={styles.scrollProductImage}
                            />
                        </div>
            
                        <p className={styles.scrollProductLiPrice}>
                            {'£' + productObject.price}
                            
                        </p>
                        <p className={styles.scrollProductLiName}>
                            {productObject.name}
                        </p>
                    </li>
                )
            })
        }
        </>
    )
}