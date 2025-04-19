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

  return ( // dropdown can go here for routes on mobile
    <header className={styles.header}>
        <div className={`${styles.headerLinks} [&>a]:mr-[clamp(16px,2vw,30px)] ml-[1vw] text-white font-bold select-none text-[clamp(18px,2.3vw,22px)]`}>
          <Link 
            href='/' 
            className='transition duration-150 ease-in hover:text-[rgb(255,153,0)] active:text-[rgb(255,153,0)] active:duration-0'
          >
            Home
          </Link>
          <Link 
            href='/phones' 
            className='transition duration-150 ease-in hover:text-[rgb(255,153,0)] active:text-[rgb(255,153,0)] active:duration-0'
          >
            Phones
          </Link>
          <Link 
            href='/tablets' 
            className='transition duration-150 ease-in hover:text-[rgb(255,153,0)] active:text-[rgb(255,153,0)] active:duration-0'
          >
            Tablets
          </Link>
        </div>

        <div className={`${styles.headerIconDiv} h-[100%] absolute right-2 w-[4.5rem] flex items-center justify-between`}>
          <Link href='/basket' className='left-0'>
            <img
              className='w-[1.75rem] h-[1.75rem]' src='/cart-icon.png'
            />
          </Link>

          {user ?
            <div className='h-[100%] flex flex-col justify-center' onClick={() => setShowProfileMenu(!showProfileMenu)} onMouseEnter={() => setShowProfileMenu(true)} onMouseLeave={() => setShowProfileMenu(false)}>
              <div className='flex flex-col items-end absolute right-0'>
                <div style={{backgroundColor: user.profileColour}} className={`select-none text-lg w-[30px] h-[30px] my-auto rounded-full flex justify-center`}>
                  <p>{user.name[0]}</p>
                </div>
              </div>
              <ul className={`select-none [&>li]:my-[0.8rem] rounded-bl-lg rounded-br-lg transition-opacity duration-200 ease-in ${showProfileMenu ? 'opacity-100' : 'opacity-0'} absolute top-[100%] -right-[0.5vw] px-[15%] bg-[rgb(30,64,175)] text-[#fff]`}>
                <li 
                  className='transition duration-150 ease-in hover:text-[rgb(255,153,0)] cursor-pointer active:text-[rgb(255,153,0)] active:duration-0'
                >
                  <Link href='/orders'>
                    Orders
                  </Link>
                </li>
                <li 
                  onClick={() => handleLogout()} 
                  className='transition duration-150 ease-in hover:text-[rgb(255,153,0)] font-bold cursor-pointer active:text-[rgb(255,153,0)] active:duration-0'
                >
                  Logout
                </li>
              </ul>
            </div>
              :
            <Link href='/login'>
              <img 
                className='w-[1.75rem] h-[1.75rem]' src={'/profile-icon.png'}
              />                  
            </Link>
          }
        </div>
    </header>
  );
}
