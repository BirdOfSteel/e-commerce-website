import { useState } from "react";
import Layout from '../Layout.tsx'
import Link from "next/link";

export default function Register() {
    const [serverResponseText, setServerResponseText] = useState(null);

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const email = formData.get('email');
        const name = formData.get('name');
        const password = formData.get('password');

        const formObject = {
            email: email.toLowerCase(),
            name: name,
            password: password
        }

        try {
            setServerResponseText(null);
            const res = await fetch('http://localhost:3001/register', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject)
            }); // sends form data

            const data = await res.json();

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
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <form
          onSubmit={handleRegisterSubmit}
          className="bg-[#2563EB] text-white border border-black/20 border-2 rounded-md box-content px-[2%] py-[20px] w-[30%] flex flex-col items-center justify-center gap-3"
        >
            <p className="font-bold my-[10px]">
                Register a new account
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
            Name
            <input
                name="name"
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
                className="px-4 py-2 bg-blue-500 text-white rounded transition transform active:font-bold hover:scale-105"
            >
                Register
            </button>

        </form>
        <Link href='/login' className="flex w-[30%] flex-row justify-center mt-[10px] p-[10px] text-white font-bold px-[2%] rounded-md box-content bg-[orange]">
            Back to log in
        </Link>
      </div>
    </Layout>
  );
}
