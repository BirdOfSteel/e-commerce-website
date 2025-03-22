import { useContext } from 'react';
import styles from '../../styles/Basket.module.css';
import { ShoppingBasketContext } from '../../context/shoppingBasketProvider';

export default function BasketList() {
    const { shoppingBasket, setShoppingBasket} = useContext(ShoppingBasketContext);

    function updateQuantity(objectInBasket, action:string) {
        let newQuantity: number = null;

        switch (action) {
            case 'add': newQuantity = objectInBasket.quantity + 1;
                break;
            case 'subtract': newQuantity = objectInBasket.quantity - 1;
                break;
            case 'delete': newQuantity = objectInBasket.quantity = 0;
                break;
        }

        return newQuantity
    }

    function updateBasket(e, prevBasket) { 
        const productObject = JSON.parse(e.target.parentElement.dataset.object);
        const action:string = e.target.id;

        let updatedBasket = 
                prevBasket.map((objectInBasket) => {
                    if (objectInBasket.id === productObject.id) {
                        return {
                            ...objectInBasket,
                            quantity: updateQuantity(objectInBasket, action)
                        }
                    } else {
                        return objectInBasket
                    }
                })
            
        updatedBasket = updatedBasket.filter((item) => {
            return item.quantity > 0
        })

        return updatedBasket
    }

    function changeProductQuantity(e) {
        setShoppingBasket((prevBasket) => {
            const updatedBasket = updateBasket(e, prevBasket)

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
                            id='delete'
                            onClick={(e) => changeProductQuantity(e)}
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