import "../styles/global.css"; // Ensure the correct path
import { ShoppingBasketContext, ShoppingBasketProvider } from "../context/shoppingBasketProvider";

export default function App({ Component, pageProps }) {
  return (
    <ShoppingBasketProvider>
      <Component {...pageProps} />
    </ShoppingBasketProvider>
  )
}