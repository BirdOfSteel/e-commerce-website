import { useState, useEffect, useContext } from "react";
import Layout from '../Layout'
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
    const router = useRouter();
    const [ serverResponseMessage, setServerResponseMessage ] = useState(null);
    const { setUser } = useContext(AuthContext);

    const searchParams = useSearchParams();

    useEffect(() => { // checks for error message in searchparams
        const errorSearchParams = searchParams.get('error');

        if (errorSearchParams) {
            setServerResponseMessage(errorSearchParams);
        };
    },[searchParams]);

    async function handleLoginSubmit(event) { // handles login
        event.preventDefault();
        const formData = new FormData(event.target);

        const email = formData.get('email');
        const password = formData.get('password');

        const loginForm = {
            email: typeof email === 'string' ? email.toLowerCase() : '',
            password: password
        }

        try {
            setServerResponseMessage(null);
            const res = await fetch('http://localhost:3001/login', {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(loginForm)
            });
            
            const data = await res.json(); 

            if (!res.ok) {
                setServerResponseMessage(data.message || "Something went wrong");
                return;
            } else {
                setServerResponseMessage(data.message)
                let cookieArray = document.cookie.split('; ');
                let userData = cookieArray.find(row => row.startsWith('userinfo=')).replace('userinfo=', '');
                setUser(JSON.parse(decodeURIComponent(userData)));
                router.push('/');
            };
        } catch (err) {
            setServerResponseMessage("Server error: Unable to connect. Please try again later.");
        }

    }

  return (
    <Layout>
        <div className="px-[10%] min-w-[280px] max-w-[320px] h-[100%] box-content mx-auto flex flex-col items-center justify-center">
            <form
            onSubmit={handleLoginSubmit}
            className="py-[20px] bg-[#2563EB] h-[100%] gap-5 w-[100%] text-white border border-black/20 border-2 rounded-md box-content flex flex-col items-center justify-center "
            >
                <p className="font-bold my-[1rem]">
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
                    className="mt-[10px] px-[1rem] py-2 bg-blue-500 text-white rounded transition transform hover:scale-105 active:font-bold"
                >
                    Log In
                </button>

            </form>
        <Link href='/register' className="bg-[rgb(255,145,0)] transition transform hover:scale-105 py-[0.75rem] w-[100%] border-2 border-[rgb(255,125,0)] flex flex-row justify-center mt-[10px] text-white font-bold rounded-md box-content">
            Create a new account
        </Link>
      </div>
    </Layout>
  );
}
