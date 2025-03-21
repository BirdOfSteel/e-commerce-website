import { InferGetStaticPropsType, GetStaticProps } from 'next';
import { useState, useEffect, useContext } from 'react';
import { ShoppingBasketContext } from '../../context/shoppingBasketProvider';
import styles from '../../styles/ProductsPage.module.css';
import { ProductProps } from '../../types/productDataProps';

// import useAddToShoppingBasket from '../../hooks/useAddToShoppingBasket';


export default function PhoneList() {
    const [phoneData, setPhoneData] = useState([]);
    const { shoppingBasket, setShoppingBasket } = useContext(ShoppingBasketContext);

    useEffect(() => {
        fetch('http://localhost:3001/phones')
            .then((res) => res.json())
            .then((data) => setPhoneData(data));
    }, []);
        
        console.log(phoneData)

    // can we move this to another file?
    function addToBasket(e) {
        const productObject = JSON.parse(e.target.dataset.object);
        console.log(productObject)

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
                    img: productObject.src,
                    quantity: 1
                }]
            }

            
        })
    }

    return (
        phoneData.map((phoneObject, index) => (
            <li key={index} className={styles.productListItem}>
                <img src={phoneObject.img_src} alt={phoneObject.name} />
                <div className={styles.productListItemInfo}>
                    <div className={styles.productListInfoDivLeft}>
                        <p>{phoneObject.price}</p>
                        <p>{phoneObject.name}</p>
                    </div>
                    <div className={styles.productListInfoDivRight}>
                        <img
                            data-object={JSON.stringify(phoneObject)}
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
