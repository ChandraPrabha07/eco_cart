import '@/styles/globals.css'
import { CartProvider } from '../context/CartContext';
import Header from '../components/Header';

export default function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <>
        <Header />
        <Component {...pageProps} />
      </>
    </CartProvider>
  );
}
