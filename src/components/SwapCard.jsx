import { useState, useEffect, useCallback } from 'react';
import TokenMenu from './TokenMenu';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { useToast } from "@/hooks/use-toast"
import { VersionedTransaction, PublicKey } from '@solana/web3.js';
import '../adapter.css'
import MarketData from './MarketData';

export default function SwapCard() {
  const [sellAmount, setSellAmount] = useState('0');
  const [buyAmount, setBuyAmount] = useState('0');
  const [sellTokenPrice, setSellTokenPrice] = useState(0);
  const [buyTokenPrice, setBuyTokenPrice] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [selectedSellToken, setSelectedSellToken] = useState(null);
  const [selectedBuyToken, setSelectedBuyToken] = useState(null);
  const [isTokenMenuOpen, setIsTokenMenuOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [tokens, setTokens] = useState([]);
  const { wallet } = useWallet();
  const { toast } = useToast();
  const { connection } = useConnection();

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    if (selectedSellToken && selectedBuyToken) {
      fetchUsdPrices(selectedSellToken, selectedBuyToken);
    }
  }, [selectedSellToken, selectedBuyToken]);

  useEffect(() => {
    fetchQuoteResponse();
  }, [sellAmount, selectedSellToken, selectedBuyToken, slippage]);

  const handleSwap = async () => {
    if (
      !selectedSellToken ||
      !selectedBuyToken ||
      !wallet
    ) {
      toast({
        title: "Invalid Token/Wallet",
        description: "Please connect your wallet and select tokens to swap.",
      })
      return;
    }

    const sellTokenBalance = await checkTokenBalance(selectedSellToken);

    if (
      parseFloat(sellTokenBalance) <= 0 ||
      parseFloat(sellAmount) > parseFloat(sellTokenBalance)
    ) {
      toast({
        title: "Insufficient Balance",
        description: "Please check your balance and try again",
      });
      return;
    }

    try {
      // Fetch the quote response for the swap
      const quoteResponse = await fetchQuoteResponse();

      if (!quoteResponse) {
        toast({
          title: "Failed To Fetch A Quote",
          description: "Please try again or reload the page.",
        });
        return;
      }

      // Request the swap transaction from Jupiter API
      const data = await axios.post("https://quote-api.jup.ag/v6/swap", {
        quoteResponse,
        userPublicKey: wallet.adapter.publicKey.toString(),
        wrapAndUnwrapSol: true,
      });

      // Deserialize the swap transaction from base64
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign the transaction with the connected wallet
      const signedTransaction = await wallet.adapter.signTransaction(transaction);

      // Serialize the signed transaction
      const rawTransaction = signedTransaction.serialize();

      // Send the signed transaction to the Solana blockchain
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      // Confirm the transaction
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed"
      );

      toast({
        title: "Swap Successful",
        description: `Transaction successful: https://solscan.io/tx/${txid}`,
      })
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: "Error signing or sending the transaction",
      });
      console.error("Error signing or sending the transaction:", error);
    }
  };

  const fetchTokens = async () => {
    try {
      const response = await axios.get(
        "https://tokens.jup.ag/tokens?tags=verified"
      );
      console.log("Fetched tokens:", response.data);
      setTokens(response.data);
      setSelectedBuyToken(response.data[0]);
      setSelectedSellToken(response.data[1]);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  async function fetchUsdPrices(sellToken, buyToken) {
    const sellTokenPrice = await axios.get(
      `https://api.jup.ag/price/v2?ids=${sellToken.address}`
    );
    const buyTokenPrice = await axios.get(
      `https://api.jup.ag/price/v2?ids=${buyToken.address}`
    );
    setBuyTokenPrice(buyTokenPrice.data.data[buyToken.address].price);
    setSellTokenPrice(sellTokenPrice.data.data[sellToken.address].price);
  }

  const checkTokenBalance = async (sellToken) => {
    try {
      const tokenAccountAddress = await getAssociatedTokenAddress(
        new PublicKey(sellToken.address),
        wallet.adapter.publicKey
      );

      const tokenAccountInfo = await getAccount(
        connection,
        tokenAccountAddress
      );

      const balanceInTokens =
        Number(tokenAccountInfo.amount) / Math.pow(10, sellToken.decimals);

      return balanceInTokens;
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return 0;
    }
  };

  const handleCalculateOutAmts = (amount, token) => {
    // Special handling for USDC and USDT on Solana
    if (
      (token.symbol === "USDC" || token.symbol === "USDT") &&
      token.address.startsWith("EPj")
    ) {
      return amount / Math.pow(10, 6);
    }
    // For all other tokens, use the token's decimals
    return amount / Math.pow(10, token.decimals);
  };

  const fetchQuoteResponse = useCallback(async () => {
    if (!selectedSellToken || !selectedBuyToken || !sellAmount) return;

    const parsedSellAmount = parseFloat(sellAmount);
    const slippageBps = slippage * 100;
    const apiUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${
      selectedSellToken.address
    }&outputMint=${selectedBuyToken.address}&amount=${Math.floor(
      parsedSellAmount * Math.pow(10, selectedSellToken.decimals)
    )}&slippageBps=${slippageBps}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data) {
        console.log(response.data);
        const quoteData = response.data;
        setQuoteResponse(quoteData);
        console.log(quoteResponse);

        const outputAmount = handleCalculateOutAmts(
          quoteData.outAmount,
          selectedBuyToken
        );
        setBuyAmount(outputAmount.toFixed(6));
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  }, [selectedSellToken, selectedBuyToken, sellAmount, slippage]);


  const handleSellAmountChange = (value) => {
    setSellAmount(value);
  };

  const handleTokenSelect = (token) => {
    if (activeField === 'sell') {
      setSelectedSellToken(token);
    } else {
      setSelectedBuyToken(token);
    }
    setIsTokenMenuOpen(false);
  };

  return (
    <>
      <div className='flex'>
        <div className="w-1/2 max-w-md bg-black/30 backdrop-blur-lg rounded-3xl p-4 shadow-xl border border-white/10">
          <div className="flex items-center text-sm text-gray-400 ms-2">
            <span>Slippage: {slippage}%</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-1 p-0 hover:bg-transparent">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Adjust Slippage</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Slider
                    value={[slippage]}
                    onValueChange={([value]) => setSlippage(value)}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-center mt-2">{slippage}%</div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {/* Sell Section */}
          <div className="bg-black/40 rounded-2xl p-4 mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Sell</span>
              <button 
                onClick={() => {
                  setActiveField('sell');
                  setIsTokenMenuOpen(true);
                }}
                className="flex items-center gap-2 bg-black/40 hover:bg-black/60 rounded-full px-4 py-2 transition-colors"
              >
                {selectedSellToken ? (
                  <>
                    <img 
                      src={selectedSellToken.logoURI} 
                      alt={selectedSellToken.symbol} 
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-white">{selectedSellToken.symbol}</span>
                  </>
                ) : (
                  <span className="text-white">Select token</span>
                )}
                <span className="text-white">▼</span>
              </button>
            </div>
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => handleSellAmountChange(e.target.value)}
              className="w-full bg-transparent text-4xl text-white outline-none"
              placeholder="0"
            />
            <div className="text-gray-400 text-sm mt-1">
              Per Token: ${sellTokenPrice} USD
            </div>
          </div>

          {/* Swap Arrow */}
          {/* <div className="flex justify-center -my-2 relative z-10">
            <button className="bg-black/40 p-2 rounded-lg hover:bg-black/60 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 10L12 15L17 10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div> */}

          {/* Buy Section */}
          <div className="bg-black/40 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Buy</span>
              <button 
                onClick={() => {
                  setActiveField('buy');
                  setIsTokenMenuOpen(true);
                }}
                className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] rounded-full px-4 py-2 transition-colors"
              >
                {selectedBuyToken ? (
                  <>
                    <img 
                      src={selectedBuyToken.logoURI} 
                      alt={selectedBuyToken.symbol} 
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-white">{selectedBuyToken.symbol}</span>
                  </>
                ) : (
                  <span className="text-white">Select token</span>
                )}
                <span className="text-white">▼</span>
              </button>
            </div>
            <input
              type="number"
              value={buyAmount}
              readOnly
              className="w-full bg-transparent text-4xl text-white outline-none"
              placeholder="0"
            />
            <div className="text-gray-400 text-sm mt-1">
              Per Token: ${buyTokenPrice} USD
            </div>
          </div>
          {
            quoteResponse && (
              <p className='text-white text-center mb-2'>
              Exchange Rate: 1 {selectedSellToken?.symbol} ≈{" "}
                        {parseFloat(buyAmount / sellAmount).toFixed(6)}{" "}
                        {selectedBuyToken?.symbol}
              </p>
            )
          }
          <button onClick={handleSwap} className="w-full h-[48px] bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl py-4 text-lg flex justify-center items-center text-center font-semibold transition-colors">
            Swap Now
          </button>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
        <div className='w-1/2 ms-2'>
          {/* Market Data Panel */}
          {selectedBuyToken && (
            <MarketData token={selectedBuyToken} />
          )}
        </div>
      </div>

      <TokenMenu
        fetchedTokens={tokens}
        buyAmount={buyAmount}
        sellAmount={sellAmount}
        setBuyAmount={setBuyAmount}
        setSellAmount={setSellAmount}
        isOpen={isTokenMenuOpen}
        onClose={() => setIsTokenMenuOpen(false)}
        onSelect={handleTokenSelect}
      />
    </>
  );
}