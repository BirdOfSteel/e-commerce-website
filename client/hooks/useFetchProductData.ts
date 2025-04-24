import { useEffect, useState } from "react";
import { Product } from "../types/types";

export default function useFetchProductData(endpoint: string) {
    const [ data, setData ] = useState<Product[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchProductData() {
            try {
                const res = await fetch(`https://ecommerce.amir-api.co.uk/${endpoint}`,{
                    method: 'GET',
                    credentials: 'include'
                }); // Pi IP address
                const data = await res.json();
                
                setData(data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProductData();
    }, []);

    return { data, isLoading, error };
}