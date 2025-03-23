import { useState, useEffect } from 'react'; 
import styles from '../styles/Home.module.css';
import ScrollProductListItem from './ScrollProductListItem';

export default function TabletsScrollList() {
    const [ tabletData, setTabletData ] = useState([])

    // set up loading and error for fetch failure

    useEffect(() => {
        fetch('http://localhost:3001/tablets')
            .then((res) => res.json())
            .then((data) => setTabletData(data))
    },[])

    return ( 
        <div className={styles.scrollListDiv}>
            <p className={styles.scrollListHeading}>Tablets</p>
            <ul className={styles.productScrollList}>
                {tabletData.map((tabletObject, index) => {
                    return (
                        <ScrollProductListItem
                            src={tabletObject.img_src}
                            price={tabletObject.price}
                            name={tabletObject.name}
                            key={index}
                        />
                    )
                })}
            </ul>
        </div>
    )
}