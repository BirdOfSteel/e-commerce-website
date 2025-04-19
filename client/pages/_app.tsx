import "../styles/global.css";
import { useState, useContext, useEffect } from 'react';
import NextApp from 'next/app';
import { ShoppingBasketContext, ShoppingBasketProvider } from "../context/shoppingBasketProvider";
import { AuthContext, AuthProvider} from "../context/AuthContext";

export default function App({ Component, pageProps }) {

  return (
    <AuthProvider initialUser={pageProps.userinfo}>
      <ShoppingBasketProvider>
        <Component {...pageProps} />
      </ShoppingBasketProvider>
    </AuthProvider>
  )
}

App.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const userinfoCookie = appContext.ctx.req?.cookies['userinfo'];
  
  let userinfo = null;

  if (userinfoCookie) {
    try {
      userinfo = JSON.parse(userinfoCookie);
    } catch (err) {
      console.error("Failed to parse userinfo cookie.")
    }
  }
  
  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps, 
      userinfo 
    }
  };
};