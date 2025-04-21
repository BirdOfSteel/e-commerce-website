import { useEffect, useState } from 'react';
import Layout from '../Layout';
import priceNumberToString from '../../utils/priceNumberToString';

export default function Orders() {
    const [ serverResponseMessage, setServerResponseMessage ] = useState(null);
    const [ orderHistory, setOrderHistory ] = useState([]); 

    useEffect(() => { // on entering orders page, fetches order history
        async function fetchOrderHistory() {
            try {
                const res = await fetch(
                    'http://localhost:3001/get-order-history', {
                        method: 'GET',
                        credentials: 'include'
                    }
                );
                const data = await res.json();
                if (!res.ok) {
                    setServerResponseMessage(data);
                    return;
                }

                setOrderHistory(data);
            } catch (err) {
                setServerResponseMessage(err.message);
            }
        }
        
        fetchOrderHistory();
    },[]);

    return (
        <Layout>
            <div className='max-w-min mx-[auto] flex flex-col items-center'>
                { serverResponseMessage ?
                    <p className='w-[100vw] text-center'>
                        {serverResponseMessage.message}
                    </p>
                     :
                    orderHistory.map((orderObject, i) => {
                        const shoppingBasket = orderObject.order.shoppingBasket;
                        return (
                            <div className='mb-[2.5rem] w-[100%] min-w-max text-[clamp(1rem,1.5vw,1.25rem)]'>
                                <div className='w-[100%] mb-[0.5rem] font-bold flex flex-row align-end justify-between'>
                                    <p className='mt-auto'>{orderObject.order.timestamp}</p>
                                    <p>Total: £{orderObject.order.total}</p>
                                </div>
                                <div className='p-[0.5rem] min-w-max border-2 border-[grey] rounded-md flex flex-col'>
                                    {shoppingBasket.map((item) => {
                                        console.log(item)
                                        return (
                                            <div className='[&:not(:last-child)]:border-b-[1px] [&:not(:last-child)]:border-[grey] px-[0.5rem] py-[1rem] mb-[0.5rem] max-h-min flex flex-row'>
                                                <img 
                                                    className='h-auto w-[clamp(6rem,10vw,9rem)] object-contain'
                                                    src={item.img_src} 
                                                    />
                                                <div className='[&>p:not(:last-child)]:py-[0.3rem] ml-[1rem] max-h-min flex flex-col justify-end'>
                                                    <p className='mb-[auto] pt-[10px] font-bold'>{item.name}</p>
                                                    <p>Price each: £{priceNumberToString(item.price)}</p>
                                                    <p>Qty: {item.quantity}</p>
                                                    <p>Subtotal: £{priceNumberToString(item.subtotal)}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </Layout>
    )
}