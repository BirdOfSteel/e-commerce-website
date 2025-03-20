import styles from '../styles/Home.module.css';

export default function TabletListItem({src, price, name}) {
    return (
        <li className={styles.tabletListItem}>
            <img 
                src={src}
                className={styles.scrollProductImage}
                style={{
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
            <p className={styles.scrollProductLiPrice}>
                {price}
            </p>
            <p className={styles.scrollProductLiName}>
                {name}
            </p>
        </li>
    )
}