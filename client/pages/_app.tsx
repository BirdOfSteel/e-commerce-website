import "../styles/global.css";
import NextApp, {AppContext, AppProps} from 'next/app';
import { PagePropsType, CustomIncomingMessage } from '../types/types';
import { ShoppingBasketProvider } from "../context/shoppingBasketProvider";
import { AuthProvider} from "../context/AuthContext";

export default function App({ Component, pageProps }: AppProps<PagePropsType>) {

  return (
    <AuthProvider initialUser={pageProps.userinfo}>
      <ShoppingBasketProvider>
          <Component {...pageProps} />
      </ShoppingBasketProvider>
    </AuthProvider>
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
      console.error("Failed to parse userinfo cookie");
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
