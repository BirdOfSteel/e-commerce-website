import { useEffect, useState } from 'react';
import Layout from '../Layout';

export default function Error() {
    const [ isServerOnline, setIsServerOnline ] = useState<boolean>(false);

    useEffect(() => {
        async function pingServer() {
            try {
                const res = await fetch('http://localhost:3001/', {
                    method: 'GET'
                });
    
                if (res.ok) {
                    setIsServerOnline(true);
                }

                return;
            } catch (err) {
                setIsServerOnline(false);                
            };
        }

        pingServer();
    },[])

    return (
        <Layout>
            <div className='px-[25%] w-[100%] text-[clamp(20px,2vw,24px)]'>
                <p className='font-bold mb-[2rem] text-center'>Error</p>
                <p className='mb-[1rem]'>
                    There was a problem with the website that caused the app to crash, or there may be an issue with our server.
                </p>
                <p className='mb-[1rem]'>
                    Please try again or contact the website owner if this continues.
                </p>

                <p className='font-bold'>SERVER STATUS:</p>
                { isServerOnline ? 
                    <p className='text-[green] font-bold'>ONLINE</p> 
                    : 
                    <p className='text-[red] font-bold'>OFFLINE</p>
                }
            </div>
        </Layout>
    )
}