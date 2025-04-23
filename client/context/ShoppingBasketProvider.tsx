import { createContext, useEffect, useState } from 'react';

export const ShoppingBasketContext = createContext(null);

export function ShoppingBasketProvider({ children }) {
    const [ shoppingBasket, setShoppingBasket ] = useState([]);

    useEffect(() => { // for syncing basket context to basket in local storage on first render
        if (typeof window !== 'undefined') { // checks window to see if we're in browser environment
            const localStorageBasket = localStorage.getItem('basket');
            if (localStorageBasket !== 'undefined') { 
                setShoppingBasket(JSON.parse(localStorageBasket));
            }
        }
    },[])
    
    useEffect(() => { // sync basket to local storage on each basket interaction
        localStorage.setItem('basket', JSON.stringify(shoppingBasket));
    },[shoppingBasket])

    return (
        <ShoppingBasketContext.Provider value={{ shoppingBasket, setShoppingBasket }}>
            { children }
        </ShoppingBasketContext.Provider>
    )
}
