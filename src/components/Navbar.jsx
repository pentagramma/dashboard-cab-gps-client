import React from 'react';

const Navbar = ({ selectedMmiId, handleMmiIdChange, rides }) => {
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
   
      <input
        type="search"
        placeholder='Search for mmi id'
        className='pl-3 h-[40px] rounded-full text-black'
      />
    </div>
  );
};

export default Navbar;
