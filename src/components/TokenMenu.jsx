import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import TokenList from './TokenList';

export default function TokenMenu({ isOpen, onClose, onSelect, fetchedTokens, buyAmount, sellAmount, setBuyAmount, setSellAmount, }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tokensList, setTokensList] = useState([]);

  const filteredTokens = () => {
    return fetchedTokens.filter((token) => {
      return token.name.toLowerCase().includes(searchQuery.toLowerCase()) || token.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      filteredTokens();
      setTokensList(filteredTokens());
    }
    else {
      setTokensList(fetchedTokens);
    }
  }, [searchQuery, fetchedTokens]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-3xl w-full max-w-md overflow-hidden relative">
        {/* Header - Fixed */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Select a token</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          <TokenList 
            fetchedTokens={tokensList}
            searchQuery={searchQuery}
            onSelect={onSelect}
            buyAmount={buyAmount}
            sellAmount={sellAmount}
            setBuyAmount={setBuyAmount}
            setSellAmount={setSellAmount}
          />
        </div>
      </div>
    </div>
  );
}