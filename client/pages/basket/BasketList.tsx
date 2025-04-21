import { useContext, useState, useEffect } from 'react';
import { ShoppingBasketContext } from '../../context/shoppingBasketProvider';
import { BasketObjectType, ServerResponse } from '../../types/types';
import getCurrentDate from '../../utils/getCurrentDate';
import priceNumberToString from '../../utils/priceNumberToString';

export default function BasketList() {
    const { shoppingBasket, setShoppingBasket } = useContext(ShoppingBasketContext);
    const [ hasCheckedOut, setHasCheckedOut ] = useState(false);
    const [ serverResponseMessage, setServerResponseMessage ] = useState<ServerResponse | null>(null);
    const [ basketTotal, setBasketTotal ] = useState<number>(0);
    
    useEffect(() => { // on entering basket page, calculates total value
        const basketTotalValue: number = 
            shoppingBasket.reduce((totalValue: number, basketItem: BasketObjectType) => {
                return totalValue += basketItem.subtotal;
        },  0);
        setBasketTotal(basketTotalValue);
    }, [shoppingBasket])

    async function handleCheckout() {
        if (shoppingBasket.length > 0) {
            try {
                const res = await fetch('http://localhost:3001/add-to-order-history', {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        timestamp: 
                            getCurrentDate(),
                        total: 
                            `${basketTotal.toLocaleString('en', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`,
                        shoppingBasket: 
                            shoppingBasket
                    })
                });
                const data = await res.json();

                if (res.ok) {
                    setShoppingBasket([]);
                    setHasCheckedOut(true);                }
            } catch (err) {
                setServerResponseMessage({
                    message: "Server error: Unable to connect. Please try again later."
                });
            }
        }
    }

    function updateQuantity(objectInBasket: BasketObjectType, action:string) {
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

    function updateBasket(e, prevBasket) { // changeProductQuantity runs this. Updates quantity of selected item and re-renders list.
        const productObject = JSON.parse(e.target.parentElement.dataset.object);
        const action: string = e.target.id;

        let updatedBasket = 
                prevBasket.map((objectInBasket: BasketObjectType) => {
                    if (objectInBasket.id === productObject.id) {
                        const updatedObjectInBasket = {
                            ...objectInBasket,
                            quantity: updateQuantity(objectInBasket, action)
                        }

                        return {
                            ...updatedObjectInBasket,
                            subtotal: updatedObjectInBasket.price * updatedObjectInBasket.quantity
                        };
                    } else {
                        return objectInBasket
                    }
                })
            
        updatedBasket = updatedBasket.filter((item) => {
            return item.quantity > 0
        });

        return updatedBasket
    }

    function changeProductQuantity(e) { // runs on clicking - or + on a product in basket
        setShoppingBasket((prevBasket) => {
            const updatedBasket = updateBasket(e, prevBasket);

            return updatedBasket
        })
    }
    
    function generateBasketList() {

        return shoppingBasket.map((basketObject: BasketObjectType, index) => {
            return (
                <div 
                    className='max-w-[14rem] mb-[1rem] border-[2px] border-[rgb(0,0,0,0.3)] rounded-md p-[1rem] items-center jusify-center'
                    key={basketObject.id}    
                >
                    <img src={basketObject.img_src} className='mb-[1rem] w-[100%]'/>
                    <div className='flex flex-row w-[75%] justify-between' data-object={JSON.stringify(basketObject)}>
                        <p 
                            className='bg-[white] border-[rgb(0,0,0,0.3)] select-none transition-transform duration-250 ease-in-out active:scale-105 hover:scale-105 active:border-[rgb(255,153,0)] hover:border-[rgb(255,153,0)] hover:border-[2px] border-[1px]  w-[30px] h-[30px] cursor-pointer flex justify-center items-center rounded-md'
                            onClick={(e) => changeProductQuantity(e)}
                            id='subtract'
                        >
                            -
                        </p>
                        <p className='flex items-center justify-center font-bold'>
                            {basketObject.quantity}
                        </p>
                        <p 
                            className='bg-[white] border-[rgb(0,0,0,0.3)] select-none transition-transform duration-100 ease-in-out active:scale-105 hover:scale-105 active:border-[rgb(255,153,0)] hover:border-[rgb(255,153,0)] hover:border-[2px] border-[1px]  w-[30px] h-[30px] cursor-pointer flex justify-center items-center rounded-md'
                            onClick={(e) => changeProductQuantity(e)}
                            id='add'
                        >
                            +
                        </p>
                        <img 
                            src={'/bin-icon.png'} 
                            className='bg-[white] border-[rgb(0,0,0,0.3)] p-[5px] select-none transition-transform duration-100 ease-in-out active:scale-105 hover:scale-105 active:border-[rgb(255,153,0)] hover:border-[rgb(255,153,0)] hover:border-[2px] border-[1px]  w-[30px] h-[30px] cursor-pointer flex justify-center items-center rounded-md'
                            id='delete'
                            onClick={(e) => changeProductQuantity(e)}
                        />
                    </div>
                    <div className='flex flex-col mt-[1rem] text-[clamp(1rem,1vw,2rem)]'>
                        <p className='font-bold'>{basketObject.name}</p>
                        <p>£{priceNumberToString(basketObject.price)}</p>
                        <p className='mt-[1rem]'>Subtotal: £{priceNumberToString(basketObject.subtotal)}</p>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className='w-[100%] grid grid- items-center justify-center'>
            { hasCheckedOut ?
                <div className='mx-auto mt-[25vh] text-center font-bold'>
                    <p className='mb-[2rem]'>
                        Thank you for your purchase!
                    </p>
                    <p>
                        You can find your orders by hovering over your profile in the top right and clicking 'Orders'.
                    </p>
                </div>
                    : 
                shoppingBasket.length > 0 ? 
                    <>
                        {generateBasketList()}
                        <div>
                            <div className='text-[clamp(1rem,1vw,2rem)] flex flex-col mt-[2rem] text-[rgb(48,48,48)]'>
                                <p className='text-[dark-grey] font-bold'>
                                    Total: &nbsp;
                                </p>
                                <p>
                                    £{basketTotal.toLocaleString('en', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </p>
                            </div>
                            <p>
                                {serverResponseMessage?.message}
                            </p>
                            <p 
                                className='hover:scale-105 duration-105 transition-transform mt-[1rem] text-[clamp(1rem,1vw,1.15rem)] cursor-pointer rounded-md text-white font-bold bg-[rgb(255,153,0)] border-2 border-[rgb(255,145,0)] text-center py-[0.75rem]'
                                onClick={() => handleCheckout()}
                            >
                                Proceed to checkout
                            </p>
                        </div> 
                    </>
                        :
                    <p className='font-bold'>Basket is empty</p>
            }
        </div>
    )
}