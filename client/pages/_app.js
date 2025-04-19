import "../styles/global.css";
import { ShoppingBasketContext, ShoppingBasketProvider } from "../context/shoppingBasketProvider";

export default function App({ Component, pageProps }) {
  return (
    <ShoppingBasketProvider>
      <Component {...pageProps} />
    </ShoppingBasketProvider>
  )
}