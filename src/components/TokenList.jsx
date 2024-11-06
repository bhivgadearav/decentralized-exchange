import axios from 'axios';

export default function TokenList(
  { searchQuery, 
    onSelect, 
    fetchedTokens, 
    buyAmount, 
    sellAmount, 
    setBuyAmount, 
    setSellAmount }) {

  // async function fetchUsdPrices(token) {
  //   const tokenPrice = await axios.get(
  //     `https://api.jup.ag/price/v2?ids=${token.address}`
  //   );
  //   return tokenPrice.data.data[token.address].price
  // }
    

  return (
    <div className="p-4">
      <div className="text-sm font-medium text-gray-400 mb-2 px-2">Popular tokens</div>
      {fetchedTokens.map((token) => (
        <button
          key={token.address}
          onClick={() => onSelect(token)}
          className="flex items-center gap-3 w-full p-3 hover:bg-white text-white hover:text-black rounded-xl transition-colors"
        >
          <img
            src={token.logoURI || '/bitcoin.png'}
            alt={token.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="flex flex-col items-start">
            <span className="font-medium">{token.symbol}</span>
            <span className="text-sm">{token.name}</span>
          </div>
          {/* <div className="ml-auto text-right">
          <span className="font-medium">${fetchUsdPrices(token) || "..." } USD</span>
          </div> */}
        </button>
      ))}
    </div>
  );
}