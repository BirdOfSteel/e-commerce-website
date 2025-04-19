import React, {useState, useEffect} from "react";
import Layout from "../Layout";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    

    return (
        <Layout> 
            <p className='flex mt-[50px] text-[red]'>
                PROTECTED
            </p>
        </Layout>
    )
}