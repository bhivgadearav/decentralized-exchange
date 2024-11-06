import { useEffect, useState } from 'react';

export default function MarketData({ token }) {

    const [fetchedMarketData, setFetchedMarketData] = useState(Object);
    const [isLoading, setIsLoading] = useState(true);
  const marketData = {
    volume24h: '$245.8M',
    marketCap: '$2.8B',
    priceChange: '+2.45%',
    high24h: (2 * 1.05).toFixed(2),
    low24h: (2 * 0.95).toFixed(2),
  };

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted
    setIsLoading(true); // Set loading state to true
    const fetchMarketData = async () => {
      const options = {
        method: 'GET',
        headers: { 'Authorization': 'bbf1d6d5-9edc-454d-ab8d-a191910065a9' },
      };
      try {
        const response = await fetch(`https://api.mobula.io/api/1/market/data?asset=${token.address}`, options);
        const data = await response.json();
        if (isMounted) {
          setFetchedMarketData(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false); // Update the loading state
        }
      }
    };

    fetchMarketData();

    return () => {
      isMounted = false; // Cleanup function to set the mounted flag to false
    };
  }, [token]);

  if (isLoading) {
    return (
      <div className="bg-black/30 h-[550px] backdrop-blur-lg rounded-3xl p-6 border border-white/10 w-80">
        <div class="flex pt-60 justify-center min-h-screen">
          <div class="w-16 h-16 border-8 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!fetchedMarketData.data) {
    return <div className="flex items-center bg-black/30 h-[550px] backdrop-blur-lg rounded-3xl p-6 border border-white/10 w-80">
        <h3 className="text-xl font-bold text-white">No market data available for {token.name} or it hasn't been added to the API being used here.</h3>
    </div>;
  }
  return (
    <>
        <div className="bg-black/30 h-[550px] overflow-y-scroll scrollbar-none backdrop-blur-lg rounded-3xl p-6 border border-white/10 w-80">
            <div className="flex items-center gap-3 mb-4">
                <img src={token.logoURI} alt={token.name} className="w-10 h-10 rounded-full" />
                <div>
                <h3 className="text-xl font-bold text-white">{token.name}</h3>
                <p className="text-gray-400">{token.symbol}</p>
                
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-white">${fetchedMarketData.data?.price.toFixed(2)}</span>
                <span className="text-green-400 font-medium">Last 24H: {fetchedMarketData.data?.price_change_24h.toFixed(2)}%</span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Name</span>
                    <span className="text-white">{fetchedMarketData.data?.name}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Symbol</span>
                    <span className="text-white">{fetchedMarketData.data?.symbol}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white">${fetchedMarketData.data?.market_cap.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Market Cap (Diluted)</span>
                    <span className="text-white">${fetchedMarketData.data?.market_cap_diluted.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Liquidity</span>
                    <span className="text-white">${fetchedMarketData.data?.liquidity.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white">${fetchedMarketData.data?.price.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Off-Chain Volume</span>
                    <span className="text-white">${fetchedMarketData.data?.off_chain_volume.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-white">{fetchedMarketData.data?.volume.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Volume Change (24h)</span>
                    <span className="text-white">{fetchedMarketData.data?.volume_change_24h.toFixed(2)}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Volume (7d)</span>
                    <span className="text-white">{fetchedMarketData.data?.volume_7d.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price Change (24h)</span>
                    <span className="text-white">{fetchedMarketData.data?.price_change_24h.toFixed(2)}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price Change (1h)</span>
                    <span className="text-white">{fetchedMarketData.data?.price_change_1h.toFixed(2)}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price Change (7d)</span>
                    <span className="text-white">{fetchedMarketData.data?.price_change_7d.toFixed(2)}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price Change (1m)</span>
                    <span className="text-white">{fetchedMarketData.data?.price_change_1m.toFixed(2)}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price Change (1y)</span>
                    <span className="text-white">{fetchedMarketData.data?.price_change_1y.toFixed(2)}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">All-Time High</span>
                    <span className="text-white">${fetchedMarketData.data?.ath.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">All-Time Low</span>
                    <span className="text-white">${fetchedMarketData.data?.atl.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Rank</span>
                    <span className="text-white">{fetchedMarketData.data?.rank}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Supply</span>
                    <span className="text-white">{fetchedMarketData.data?.total_supply}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Circulating Supply</span>
                    <span className="text-white">{fetchedMarketData.data?.circulating_supply}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Decimals</span>
                    <span className="text-white">{fetchedMarketData.data?.decimals}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price Native</span>
                    <span className="text-white">${fetchedMarketData.data?.priceNative.toFixed(2)}</span>
                </div>
                </div>
            </div>
    </>
  );
}