import { createContext, useEffect, useState } from 'react';

export const ShoppingBasketContext = createContext(null);

export function ShoppingBasketProvider({ children }) {
    const [ shoppingBasket, setShoppingBasket ] = useState([]);

    useEffect(() => { // sync shoppingBasket to basket in local storage on first render
        if (typeof window !== 'undefined') {
            const localStorageBasket = localStorage.getItem('basket');
            if (localStorageBasket && localStorageBasket !== 'undefined') {
                setShoppingBasket(JSON.parse(localStorageBasket));
            } else {
                setShoppingBasket([]);
            };
        }
    }, []);
    
    useEffect(() => { // sync basket to local storage on each basket interaction
        localStorage.setItem('basket', JSON.stringify(shoppingBasket));
    },[shoppingBasket])

    return (
        <ShoppingBasketContext.Provider value={{ shoppingBasket, setShoppingBasket }}>
            { children }
        </ShoppingBasketContext.Provider>
    )
}
