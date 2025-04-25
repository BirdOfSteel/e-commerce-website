import "../styles/global.css";
import { useState, useEffect } from "react";
import NextApp, {AppContext, AppProps} from 'next/app';
import { PagePropsType, CustomIncomingMessage } from '../types/types';
import { ShoppingBasketProvider } from "../context/ShoppingBasketProvider";
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component }) {
  const [ userInfoState, setUserInfoState ] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    console.log(userInfo)
    if (userInfo) {
      setUserInfoState(userInfo)
      console.log(userInfoState)
    }
  },[])

  return (
    <AuthProvider initialUser={userInfoState}>
      <ShoppingBasketProvider>
          <Component />
      </ShoppingBasketProvider>
    </AuthProvider>
  )
}

// catches userinfo cookie, passes it to App, then it's put into context
// App.getInitialProps = async (appContext: AppContext) => {
//   const appProps = await NextApp.getInitialProps(appContext);
//   const req = appContext.ctx.req as CustomIncomingMessage | undefined;

//   if (!req) {
//     return {
//       ...appProps,
//       pageProps: {
//         ...appProps.pageProps,
//       },
//     };
//   }

//   const userinfoCookie = req.cookies?.['userinfo'];
//   let userinfo = null;

//   if (userinfoCookie) {
//     try {
//       userinfo = JSON.parse(userinfoCookie);
//     } catch (err) {
//       console.error("Failed to parse userinfo cookie");
//     }
//   }

//   return {
//     ...appProps,
//     pageProps: {
//       ...appProps.pageProps,
//       userinfo,
//     },
//   };
// };
