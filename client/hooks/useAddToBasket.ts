import { useContext } from "react";
import { ShoppingBasketContext } from "../context/shoppingBasketProvider";
import { Product } from "../types/types";
import { BasketObject } from "../types/types";

export function useAddToBasket() {
    const { setShoppingBasket } = useContext(ShoppingBasketContext);

    const addToBasket = (productObject: Product) => {
        setShoppingBasket((prevBasket: BasketObject[]) => {
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
                    img_src: productObject.img_src,
                    quantity: 1
                }]
            }
        })
    }

    return addToBasket;
}