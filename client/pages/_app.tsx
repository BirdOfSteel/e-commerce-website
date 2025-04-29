import "../styles/global.css";
import { useState, useEffect } from "react";
import NextApp, {AppContext, AppProps} from 'next/app';
import { PagePropsType, CustomIncomingMessage } from '../types/types';
import { ShoppingBasketProvider } from "../context/ShoppingBasketProvider";
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }) {
  
  if (process.env.NODE_ENV === 'development') {
    console.log("RUNNING ON DEVELOPMENT ENVIRONMENT")
  };

  return (
    <>
    { /* favicons */ }
    <link rel="icon" href="/favicon/favicon.ico" sizes="any"/>
    <link rel="icon" type="image/png" href="/favicon/favicon-16x16.png" sizes="16x16"  />
    <link rel="icon" type="image/png" href="/favicon/favicon-32x32.png" sizes="32x32" />
    <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
    <link rel="manifest" href="/favicon/site.webmanifest" />

    <AuthProvider initialUser={pageProps.userinfo}>
      <ShoppingBasketProvider>
        <Component />
      </ShoppingBasketProvider>
    </AuthProvider>
    </>
  )
}

// catches userinfo cookie, passes it to App, then it's put into context
App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const req = appContext.ctx.req as CustomIncomingMessage | undefined;

  if (!req) {
    return {
      ...appProps,
      pageProps: {
        ...appProps.pageProps,
      },
    };
  }

  const userinfoCookie = req.cookies?.['userinfo'];

  let userinfo = null;
  
  if (userinfoCookie) {
    try {
      userinfo = JSON.parse(userinfoCookie);
    } catch (err) {
      console.log("Failed to parse userinfo cookie");
    }
  }

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      userinfo,
    },
  };
};
