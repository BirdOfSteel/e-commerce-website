import { useState } from 'react';
import Link from "next/link";
import styles from '../styles/Header.module.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation'; 

export default function Header() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [ showProfileMenu, setShowProfileMenu ] = useState(false);
  
  async function handleLogout() {
    const res = await fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (res.ok) {
      setUser(null);
      router.push('/');
    }
  }
  
  return (
    <>
    <div className='w-[100vw] h-[15px] fixed top-0 bg-[#2563EB] z-[99]' />
    <header className={`${styles.header} 'h-[60px] w-[100%] bg-[#2563EB] flex items-center px-[10px] fixed top-0 z-[99]`}>
        <div className='flex [&>a]:mr-[clamp(12px,2vw,30px)] text-[clamp(20px,2.3vw,22px)] ml-[1vw] text-white font-bold select-none'>
          <Link 
            href='/' 
            className='inline-block transition duration-150 ease-in hover:scale-105 hover:text-[rgb(255,153,0)] active:text-[rgb(255,153,0)] active:duration-0'
          >
            Home
          </Link>
          <Link 
            href='/phones' 
            className='inline-block transition duration-150 ease-in hover:scale-105 hover:text-[rgb(255,153,0)] active:text-[rgb(255,153,0)] active:duration-0'
          >
            Phones
          </Link>
          <Link 
            href='/tablets' 
            className='inline-block transition duration-150 ease-in hover:scale-105 hover:text-[rgb(255,153,0)] active:text-[rgb(255,153,0)] active:duration-0'
          >
            Tablets
          </Link>
        </div>

        <div className='right-[1rem] ml-auto flex items-center justify-between'>
          <Link href='/basket'>
            <svg className='w-[clamp(35px,1vw,35px)] h-[clamp(35px, 1vw, 35px)] hover:scale-105 active:stroke-[rgb(255,165,0)] hover:stroke-[rgb(255,165,0)] transition duration-200 stroke-[white]' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.25" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </Link>

          {user ?
            <div className='h-[100%] flex flex-col justify-center' onClick={() => setShowProfileMenu(!showProfileMenu)} onMouseEnter={() => setShowProfileMenu(true)} onMouseLeave={() => setShowProfileMenu(false)}>
              <div className='ml-[1vw] flex flex-col items-end right-0'>
                <div style={{backgroundColor: user.profileColour}} className={`w-[37.5px] h-[37.5px] ml-[0.5rem] border-[2px] border-[white] cursor-pointer select-none text-lg my-auto rounded-full flex justify-center`}>
                  <p className='m-auto text-[white] font-bold text-shadow'>{user.name[0].toUpperCase()}</p>
                </div>
                <ul className={`${showProfileMenu ? 'opacity-100' : 'opacity-0'} px-[5%] font-bold text-center max-w-min min-w-max w-min select-none [&>li]:my-[0.8rem] rounded-bl-lg rounded-br-lg transition-opacity duration-200 ease-in absolute top-[100%] bg-[rgb(30,64,175)] text-[#fff]`}>
                  <li 
                    className='transition duration-150 ease-in hover:text-[rgb(255,153,0)] active:text-[rgb(255,153,0)] active:duration-0'
                  >
                    <Link href='/orders'>
                      Orders
                    </Link>
                  </li>
                  <li 
                    onClick={() => handleLogout()} 
                    className='transition duration-150 ease-in hover:text-[rgb(255,153,0)] cursor-pointer active:text-[rgb(255,153,0)] active:duration-0'
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
              :
            <Link href='/login'>
              <svg className='ml-[1vw] active:stroke-[rgb(255,165,0)] hover:stroke-[rgb(255,165,0)] hover:scale-105 transition duration-105 w-[42.5px] stroke-white' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </Link>
          }
        </div>
    </header>
    </>
  );
}
