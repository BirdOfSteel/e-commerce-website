import { useContext } from 'react';
import styles from '../../styles/Basket.module.css';
import { ShoppingBasketContext } from '../../context/shoppingBasketProvider';

export default function BasketList() {
    const { shoppingBasket } = useContext(ShoppingBasketContext);
    console.log(shoppingBasket)
    
    function generateBasketList() {
        return shoppingBasket.map((basketObject, index) => {
            return (
                <div 
                    className={styles.basketItemDiv}
                    key={index}    
                >
                    <img src={basketObject.img} className={styles.basketItemImg}/>
                    <div className={styles.basketItemQuantityDiv}>
                        <p className={styles.quantityButton}>-</p>
                        <p>{basketObject.quantity}</p>
                        <p className={styles.quantityButton}>+</p>
                    </div>
                    <div className={styles.basketItemInfoDiv}>
                        <p>{basketObject.price}</p>
                        <p>{basketObject.name}</p>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={styles.basketDiv}>
            {
                shoppingBasket.length > 0 ? 
                generateBasketList() :
                <p>Basket is empty</p>
            }
        </div>
    )
}