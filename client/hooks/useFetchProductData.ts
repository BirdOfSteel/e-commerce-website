import { useEffect, useState } from "react";
import { Product } from "../types/types";

export default function useFetchProductData(endpoint: string) {
    const [ data, setData ] = useState<Product[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchPhoneData() {
            try {
                const res = await fetch(`http://192.168.1.100:3001/${endpoint}`,{
                    method: 'GET',
                    credentials: 'include'
                }); // Pi IP address
                const data = await res.json();
                console.log(data)
                
                setData(data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPhoneData();
    }, []);

    return { data, isLoading, error };
}