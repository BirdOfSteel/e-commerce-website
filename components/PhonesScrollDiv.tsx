import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css';
import ScrollProductListItem from './ScrollProductListItem';

export default function PhonesScrollList() {
    const [ phoneData, setPhoneData ] = useState([])

    useEffect(() => {
        fetch('/phoneData.json')
            .then((res) => res.json())
            .then((data) => setPhoneData(data))
    },[])

    return (
        <div className={styles.scrollListDiv}>
            <p className={styles.scrollListHeading}>Phones</p>
            <ul className={styles.productScrollList}>
                {
                    phoneData.map((phoneObject, index) => {
                        return (
                            <ScrollProductListItem
                                src={phoneObject.src}
                                price={phoneObject.price}
                                name={phoneObject.name}
                                key={index}
                            />
                        )
                    })
                }
            </ul>
        </div>
    )
}