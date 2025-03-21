import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css';
import ScrollProductListItem from './ScrollProductListItem';
import { ProductProps } from '../types/productDataProps';

export const getStaticProps = (async () => {
    const res = await fetch(`https://e-commerce-website-m9nj.onrender.com/phones`); 
    const phoneData = await res.json();
    console.log(phoneData)
    return { props: { phoneData } }

}) satisfies GetStaticProps<{phoneData: ProductProps[]}>;

export default function PhonesScrollList({ phoneData }: InferGetStaticPropsType<typeof getStaticProps>) {

    return (
        <div className={styles.scrollListDiv}>
            <p className={styles.scrollListHeading}>Phones</p>
            <ul className={styles.productScrollList}>
                {/* {phoneData.map((phoneObject, index) => {
                    return (
                        <ScrollProductListItem
                            src={phoneObject.src}
                            price={phoneObject.price}
                            name={phoneObject.name}
                            key={index}
                        />
                    )
                })} */}
            </ul>
        </div>
    )
}