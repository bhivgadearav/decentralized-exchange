import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SwapPage from './components/SwapPage';


function App() {

  return (
    <>
    <div>
      <ConnectionProvider endpoint='https://solana-mainnet.g.alchemy.com/v2/CcKKKKkD5h1LccFP80nHoc469FjlaNrf'>
        <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<SwapPage />} />
                  <Route path="*" element={<SwapPage />} />
                </Routes>
              </BrowserRouter>
            </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
    </>
  )
}

export default App
