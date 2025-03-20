import { useContext } from 'react';
import styles from '../../styles/Basket.module.css';
import { ShoppingBasketContext } from '../../context/shoppingBasketProvider';

export default function BasketList() {
    const { shoppingBasket, setShoppingBasket} = useContext(ShoppingBasketContext);

    function removeItemFromBasket(objectToRemove) {
        setShoppingBasket((prevBasket) => {
            const updatedBasket = 
                prevBasket.filter((objectInPrevBasket) => objectToRemove.id != objectInPrevBasket.id)

            return updatedBasket
        })
    }

    function returnNewQuantity(objectInBasket, action) {
        console.log(objectInBasket)
        console.log(action)

        if (objectInBasket.quantity === 1 && action === 'subtract') {
            removeItemFromBasket(objectInBasket);
            return 0;
        } else if (action === 'subtract') {
            return objectInBasket.quantity - 1;
        } else if (action === 'add') {
            return objectInBasket.quantity + 1;
        }
    }

    function changeProductQuantity(e) {
        const productObject = JSON.parse(e.target.parentElement.dataset.object);
        const action = e.target.id;

        setShoppingBasket((prevBasket) => {
            const prevBasketIDs = prevBasket.map((objectInBasket) => { 
                return objectInBasket.id
            })

            const updatedBasket = 
                prevBasket.map((objectInBasket) => {
                    if (objectInBasket.id === productObject.id) {
                        return {
                            ...objectInBasket,
                            quantity: returnNewQuantity(objectInBasket, action)
                        }
                    } else {
                        return objectInBasket
                    }
                })

            return updatedBasket
        })
    }
    
    function generateBasketList() {
        return shoppingBasket.map((basketObject, index) => {
            return (
                <div 
                    className={styles.basketItemDiv}
                    key={index}    
                >
                    <img src={basketObject.img} className={styles.basketItemImg}/>
                    <div className={styles.basketItemQuantityDiv} data-object={JSON.stringify(basketObject)}>
                        <p 
                            className={styles.quantityButton}
                            onClick={(e) => changeProductQuantity(e)}
                            id='subtract'
                        >
                            -
                        </p>
                        <p>{basketObject.quantity}</p>
                        <p 
                            className={styles.quantityButton}
                            onClick={(e) => changeProductQuantity(e)}
                            id='add'
                        >
                            +
                        </p>
                        <img 
                            src={'/bin-icon.png'} 
                            className={styles.binIcon}
                            onClick={() => removeItemFromBasket(basketObject)}
                        />
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