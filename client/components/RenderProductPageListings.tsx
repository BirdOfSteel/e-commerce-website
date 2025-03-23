import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { useState, useEffect, useContext } from 'react';
import { ShoppingBasketContext } from '../context/shoppingBasketProvider';
import styles from '../styles/ProductsPage.module.css'

// import useAddToShoppingBasket from '../../hooks/useAddToShoppingBasket';


export default function RenderProductPageListings({ productData }) {
    const { shoppingBasket, setShoppingBasket } = useContext(ShoppingBasketContext);

    // can we move this to another file?
    function addToBasket(e) {
        const productObject = JSON.parse(e.target.dataset.object);
        setShoppingBasket((prevBasket) => {

            // creates array of IDs in shopping basket
            const prevBasketIDs = prevBasket.map((object) => { 
                return object.id
            })

            // if selected product is already in the basket, maps over them all.
            if (prevBasketIDs.includes(productObject.id)) {

                const updatedBasket = 
                    prevBasket.map((objectInBasket) => {
                        if (objectInBasket.id === productObject.id) { // if already in basket, add 1 to quantity
                            return {
                                ...objectInBasket,
                                quantity: objectInBasket.quantity + 1
                            }
                        } else { // else, do not modify the object.
                            return objectInBasket
                        }
                    })

                return updatedBasket
            } 
            
            // else, a new product object is added to the basket.
            else {
                return [...prevBasket, {
                    id: productObject.id,
                    name: productObject.name,
                    price: productObject.price,
                    img: productObject.img_src,
                    quantity: 1
                }]
            }

            
        })
    }
    console.log(productData)

    return (
        productData.map((productObject, index) => (
            <li key={index} className={styles.productListItem}>
                <img src={productObject.img_src} alt={productObject.name} />
                <div className={styles.productListItemInfo}>
                    <div className={styles.productListInfoDivLeft}>
                        <p>{productObject.price}</p>
                        <p>{productObject.name}</p>
                    </div>
                    <div className={styles.productListInfoDivRight}>
                        <img
                            className="bg-[#2563EB]/20 p-[5px] box-content rounded-md "
                            data-object={JSON.stringify(productObject)}
                            src={'/cart-icon.png'}
                            alt="Add to cart"
                            onClick={(e) => addToBasket(e)}
                        />
                    </div>
                </div>
            </li>
        ))
    );
}
