import { useState } from "react";
import Layout from '../Layout.tsx'
import Link from "next/link";

export default function Login() {
    const [serverResponseText, setServerResponseText] = useState(null);

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
            setServerResponseText(null); // remove or move?
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
            localStorage.setItem('user_info', decodeURIComponent(userData));

            // PICK UP FROM HERE!!!!
            console.log(JSON.parse(localStorage.getItem('user_info'))); // retrieve and parse to object
        
            if (data) {
                setServerResponseText(data.message || "Something went wrong");
                return;
            }
            
        } catch (err) {
            console.error("Fetch failed:", err);
            setServerResponseText("Server error: Unable to connect. Please try again later.");
        }

    }

  return (
    <Layout>
      <div className="h-screen w-[30%] mx-auto flex flex-col items-center justify-center">
        <form
          onSubmit={handleLoginSubmit}
          className="bg-[#2563EB] text-white border border-black/20 border-2 rounded-md box-content px-[2%] py-[20px] w-[100%] flex flex-col items-center justify-center gap-3"
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

            {serverResponseText && 
            <p 
                id='error-text'
                className='text-center text-slate-200 p-[3%] mx-[10%] rounded-md bg-[black]/50'
            >
                {serverResponseText}    
            </p>}

            <button 
                className="mt-[10px] px-4 py-2 bg-blue-500 text-white rounded transition transform active:font-bold hover:scale-105"
            >
                Log In
            </button>

        </form>
        <Link href='/register' className="flex flex-row justify-center mt-[10px] p-[10px] text-white font-bold px-[2%] rounded-md box-content bg-[orange] w-[100%]">
            Create a new account
        </Link>
      </div>
    </Layout>
  );
}
