import styles from '../styles/Home.module.css';

export default function ScrollProductListItem({src, price, name}) {
    return (
        <li className={styles.scrollProductLi}>
            <div className={styles.scrollProductImageDiv}>
                <img 
                    src={src}
                    className={styles.scrollProductImage}
                />
            </div>

            <p className={styles.scrollProductLiPrice}>
                {price}
            </p>
            <p className={styles.scrollProductLiName}>
                {name}
            </p>
        </li>
    )
}