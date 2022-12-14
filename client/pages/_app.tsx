import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Goerli}>
      <div className='relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row'>
        <div className='relative hidden mr-10 sm:flex'>
          <Sidebar />
        </div>
        <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
          <Navbar />
          <Component {...pageProps} />
        </div>
      </div>
    </ThirdwebProvider>
  );
}

export default MyApp;
