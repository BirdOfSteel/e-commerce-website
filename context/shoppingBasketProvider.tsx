import { createContext, useState } from 'react';

export const ShoppingBasketContext = createContext();

export function ShoppingBasketProvider({ children }) {
    const [ shoppingBasket, setShoppingBasket ] = useState([]);

    return (
        <ShoppingBasketContext.Provider value={{ shoppingBasket, setShoppingBasket }}>
            { children }
        </ShoppingBasketContext.Provider>
    )
}