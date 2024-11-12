import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Search className="w-4 h-4 text-gray-500" />
      <input
        type="text"
        placeholder="Search keywords or phrases..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow border rounded px-2 py-1"
      />
      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
        Search
      </button>
    </div>
  );
};

export default SearchBar;