import { useContext } from "react";
import { ShoppingBasketContext } from "../context/shoppingBasketProvider";
import { Product } from "../types/types";
import { BasketObjectType } from "../types/types";

export function useAddToBasket() {
    const { setShoppingBasket } = useContext(ShoppingBasketContext);

    const addToBasket = (productObject: Product) => {
        setShoppingBasket((prevBasket: BasketObjectType[]) => {
            // creates array of IDs in shopping basket
            const prevBasketIDs = prevBasket.map((object) => { 
                return object.id
            })
    
            // if selected product is already in the basket, maps over them all.
            if (prevBasketIDs.includes(productObject.product_id)) {
    
                const updatedBasket = 
                    prevBasket.map((objectInBasket) => {
                        if (objectInBasket.id === productObject.product_id) { // if already in basket, add 1 to quantity
                            const updatedObjectInBasket = {
                                ...objectInBasket,
                                quantity: objectInBasket.quantity + 1
                            }

                            return {
                                ...updatedObjectInBasket,
                                subtotal: Number(updatedObjectInBasket.price * updatedObjectInBasket.quantity)
                            };
                        } else { // else, do not modify the object.
                            return objectInBasket;
                        }
                    })
    
                return updatedBasket
            } 
            
            // else, a new product object is added to the basket.
            else {
                return [...prevBasket, {
                    id: productObject.product_id,
                    name: productObject.name,
                    price: Number(productObject.price),
                    img_src: productObject.filepath,
                    quantity: 1,
                    subtotal: Number(productObject.price)
                }]
            }
        })
    }

    return addToBasket;
}