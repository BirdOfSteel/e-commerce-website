import { useEffect, useState } from "react";
import { Product } from "../types/types";

export default function useFetchProductData(endpoint: string) {
    const [ data, setData ] = useState<Product[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<Error | null>(null);

    useEffect(() => { // CHANGE THIS TO NOT USE LOCALHOST ON PRODUCTION
        async function fetchPhoneData() {
            try {
                const res = await fetch(`http://localhost:3001/${endpoint}`);
                const data = await res.json();
                
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