import styles from '../styles/Home.module.css';
import { RenderListingsProps } from '../types/types';

export default function RenderProductScrollListings({data, isLoading, error}: RenderListingsProps) {

    if (error) return <p>Error: {error.message}</p>

    return (
        <>
        {isLoading ?
            <p>Loading...</p>
                :
            data.map((productObject) => {
                return (
                    <li className={styles.scrollProductLi}>
                        <div className={styles.scrollProductImageDiv}>
                            <img 
                                src={productObject.img_src}
                                className={styles.scrollProductImage}
                            />
                        </div>
            
                        <p className={styles.scrollProductLiPrice}>
                            {productObject.price}
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