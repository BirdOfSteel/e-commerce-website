import React, {useState, useEffect} from "react";
import Layout from "../Layout";
import checkIfAuthenticated from "../../utils/checkIfAuthenticated";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        const handleAuth = async () => {
            const authResult = await checkIfAuthenticated();
            setIsAuthenticated(authResult);
        };
        handleAuth();
    }, [])

    return (
        <Layout> 
            <p className='flex mt-[50px] text-[red]'>
                { isAuthenticated ? 'allowed' : 'denied' }
            </p>
        </Layout>
    )
}