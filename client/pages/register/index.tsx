import { useState } from "react";
import Layout from '../Layout'
import Link from "next/link";
import { RegistrationFormObject, ServerResponse } from '../../types/types'

export default function Register() {
    const [serverResponseText, setServerResponseText] = useState(null);

    // handles account registration
    async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        const email = formData.get('email');
        const name = formData.get('name');
        const password = formData.get('password');

        const formObject: RegistrationFormObject = {
            email: typeof email === 'string' ? email.toLowerCase() : '',
            name: name,
            password: password
        };

        try {
            setServerResponseText(null);
            const res = await fetch('http://192.168.1.100:3001/register', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject)
            }); // form data is sent

            const data: ServerResponse = await res.json();

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
      <div className="px-[10%] min-w-[280px] max-w-[320px] h-[100%] box-content mx-auto flex flex-col items-center justify-center">
        <form
          onSubmit={handleRegisterSubmit}
          className="py-[20px] bg-[#2563EB] h-[100%] gap-5 w-[100%] text-white border border-black/20 border-2 rounded-md box-content flex flex-col items-center justify-center"
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
        <Link href='/login' className="bg-[rgb(255,145,0)] transition transform hover:scale-105 py-[0.75rem] w-[100%] border-[rgb(255,125,0)] border-2 flex flex-row justify-center mt-[10px] text-white font-bold rounded-md box-content">
            Back to log in
        </Link>
      </div>
    </Layout>
  );
}
