import React, { useState, useEffect, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";

const Navbar = ({ selectedMmiId, handleMmiIdChange, rides }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMmiIds, setFilteredMmiIds] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1); // Track active suggestion index

  const inputRef = useRef(null);

  useEffect(() => {
    if (searchQuery) {
      const filtered = rides
        .map(ride => ride.mmi_id)
        .filter((mmiId, index, self) => (
          mmiId.includes(searchQuery) && self.indexOf(mmiId) === index
        ));
      setFilteredMmiIds(filtered);
    } else {
      setFilteredMmiIds([]);
    }
    setActiveIndex(-1); // Reset active index when search query changes
  }, [searchQuery, rides]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMmiIdSelect = (mmiId) => {
    setSearchQuery(mmiId);
    handleMmiIdChange({ target: { value: mmiId } });
    setFilteredMmiIds([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (activeIndex !== -1 && filteredMmiIds.length > 0) {
        handleMmiIdSelect(filteredMmiIds[activeIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      setActiveIndex(prevIndex => (prevIndex < filteredMmiIds.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }
  };

  const handleSuggestionClick = (mmiId) => {
    handleMmiIdSelect(mmiId);
    inputRef.current.focus(); // Refocus the input after selecting suggestion
  };

  return (
    <div className='w-full h-[70px] bg-purple-950 text-white flex items-center justify-between px-10'>
      <div>
        <label htmlFor="mmiId" className="font-semibold mr-2 text-yellow-400">Select MMI ID:</label>
        <select
          id="mmiId"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 text-black"
          value={selectedMmiId}
          onChange={handleMmiIdChange}
        >
          <option value="">All</option>
          {rides.map((ride) => (
            <option key={ride._id} value={ride.mmi_id}>
              {ride.mmi_id}
            </option>
          ))}
        </select>
      </div>
      <div className="text-center flex-grow">
        {selectedMmiId && (
          <span className="text-xl font-semibold text-white">
            Showing stats for MMI ID: <span className='text-yellow-400'>{selectedMmiId}</span> 
          </span>
        )}
      </div>
      <div className="relative">
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="search"
            placeholder='Search for MMI ID'
            className='pl-3 pr-10 h-[40px] rounded-full text-black no-clear-button w-full'
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress} // Changed to onKeyDown to capture arrow keys
          />
          <IoIosSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:scale-125 duration-300 size-[20px]"
            onClick={() => handleMmiIdSelect(filteredMmiIds[0])}
          />
        </div>

        {searchQuery && filteredMmiIds.length > 0 && (
          <ul className="absolute left-0 mt-2 w-full text-black border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto bg-gray-100 z-50">
            {filteredMmiIds.map((mmiId, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer ${index === activeIndex ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`}
                onClick={() => handleSuggestionClick(mmiId)}
              >
                {mmiId}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
