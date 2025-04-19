import { useState, useEffect, useContext } from "react";
import Layout from '../Layout.tsx'
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
    const router = useRouter();
    const [serverResponseMessage, setServerResponseMessage] = useState(null);
    const { user, setUser } = useContext(AuthContext);

    const searchParams = useSearchParams();

    useEffect(() => { // checks for error message in searchparams
        const errorSearchParams = searchParams.get('error');

        if (errorSearchParams) {
            setServerResponseMessage(errorSearchParams);
        }
    },[searchParams]);


    async function handleLoginSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const email = formData.get('email');
        const password = formData.get('password');

        const loginForm = {
            email: email.toLowerCase(),
            password: password
        }

        try {
            setServerResponseMessage(null); // remove or move?
            const res = await fetch('http://localhost:3001/login', {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(loginForm)
            });
            
            const data = await res.json(); 

            // extract 'userinfo' cookie
            let cookieArray = document.cookie.split('; ');
            let userData = cookieArray.find(row => row.startsWith('userinfo=')).replace('userinfo=', '');
            
            if (data) {
                setServerResponseMessage(data.message || "Something went wrong");
                if (res.ok) {
                    console.log(data)
                    setUser(JSON.parse(decodeURIComponent(userData)));
                    router.push('/');    
                };
            };
        } catch (err) {
            setServerResponseMessage("Server error: Unable to connect. Please try again later.");
        }

    }

  return (
    <Layout>
      <div className="h-screen w-[17.5rem] box-content mx-auto flex flex-col items-center justify-center">
        <form
          onSubmit={handleLoginSubmit}
          className="bg-[#2563EB] w-[100%] text-white border border-black/20 border-2 rounded-md box-content px-[0.5rem] py-[20px] flex flex-col items-center justify-center gap-3"
        >
            <p className="font-bold my-[10px]">
                Enter login details
            </p>

            <label className="w-[185px] flex flex-col">
            E-mail
            <input
                name="email"
                type="text"
                className="text-black mt-1 px-2 py-1 border border-gray-400 rounded focus:outline-none"
            />
            </label>

            <label className="w-[185px] flex flex-col">
            Password
            <input
                name="password"
                type="password"
                className="text-black mt-1 px-2 py-1 border border-gray-400 rounded focus:outline-none"
            />
            </label>

            {serverResponseMessage && 
            <p 
                id='error-text'
                className='text-center text-slate-200 p-[3%] mx-[10%] rounded-md bg-[black]/50'
            >
                {serverResponseMessage}    
            </p>}

            <button 
                className="mt-[10px] px-4 py-2 bg-blue-500 text-white rounded transition transform active:font-bold hover:scale-105"
            >
                Log In
            </button>

        </form>
        <Link href='/register' className="w-[100%] px-[0.5rem] border-2 border-[rgb(255,145,0)] flex flex-row justify-center mt-[10px] p-[10px] text-white font-bold px-[2%] rounded-md box-content bg-[orange]">
            Create a new account
        </Link>
      </div>
    </Layout>
  );
}
