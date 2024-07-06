import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";
import { useLocation } from 'react-router-dom';

const Navbar = forwardRef(({ selectedMmiId, handleMmiIdChange, rides }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMmiIds, setFilteredMmiIds] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const location = useLocation(); // Get the current location

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
    setActiveIndex(-1);
  }, [searchQuery, rides]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMmiIdSelect = (mmiId) => {
    setSearchQuery(mmiId);
    handleMmiIdChange({ target: { value: mmiId } });
    setFilteredMmiIds([]);
    // Navigate to dashboard with the selected MMI ID
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
    inputRef.current.focus();
  };

  // Determine if the current path is the detailed dashboard path
  const isDetailedDashboard = location.pathname === '/details';

  return (
    <div ref={ref} className='w-full h-[70px] bg-purple-950 text-white flex items-center justify-between px-10 font-ruda'>
      <div>
        <label htmlFor="mmiId" className="font-semibold mr-2 text-yellow-400">Select MMI ID:</label>
        <select
          id="mmiId"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 text-black"
          value={selectedMmiId}
          onChange={(e) => {
            handleMmiIdChange(e);
          }}
          disabled={isDetailedDashboard} // Disable the dropdown if on the detailed dashboard
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
            className='pl-5 pr-10 h-[40px] rounded-full text-black no-clear-button w-full'
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            disabled={isDetailedDashboard} // Disable the search bar if on the detailed dashboard
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
});

export default Navbar;
