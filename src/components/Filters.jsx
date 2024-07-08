import React, { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Filters = ({ trips, selectedMetric, setSelectedMetric, setSelectedTrip }) => {
  const [sortOrder, setSortOrder] = useState('lowToHigh');
  const [sortedTrips, setSortedTrips] = useState([]);
  const [filtersReady, setFiltersReady] = useState(false); // State to track if both filters are selected
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (trips.length > 0) {
      // Sort trips based on selected metric and sort order
      const sorted = [...trips].sort((a, b) => {
        const aVal = a[selectedMetric];
        const bVal = b[selectedMetric];

        if (sortOrder === 'lowToHigh') {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      });
      setSortedTrips(sorted);
    }
  }, [trips, selectedMetric, sortOrder]);

  useEffect(() => {
    // Check if both filters are selected
    if (sortOrder && selectedMetric) {
      setFiltersReady(true);
    } else {
      setFiltersReady(false);
    }
  }, [sortOrder, selectedMetric]);

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleMetricChange = (e) => {
    setSelectedMetric(e.target.value);
  };

  const handleTripChange = (index) => {
    setCurrentTripIndex(index);
    const selectedTrip = sortedTrips[index];
    setSelectedTrip(selectedTrip);
    navigate(`/details/${selectedTrip.mmi_id}`);
  };

  const handleNextClick = () => {
    // Navigate to next trip if both filters are selected
    if (filtersReady && sortedTrips.length > 0) {
      const nextIndex = (currentTripIndex + 1) % sortedTrips.length;
      handleTripChange(nextIndex);
    }
  };

  const handlePrevClick = () => {
    // Navigate to previous trip if both filters are selected
    if (filtersReady && sortedTrips.length > 0) {
      const prevIndex = (currentTripIndex - 1 + sortedTrips.length) % sortedTrips.length;
      handleTripChange(prevIndex);
    }
  };

  const handleSearchClick = () => {
    // Navigate to details page with the first trip if both filters are selected
    if (filtersReady && sortedTrips.length > 0) {
      handleTripChange(0);
    }
  };

  return (
    <div className='h-[40px] mt-2 font-ruda'>
      <div className='flex flex-row justify-around items-center mx-[100px]'>
        <button
          className='border border-purple-800 p-2 rounded-full hover:text-white hover:bg-purple-800'
          onClick={handlePrevClick}
          disabled={!filtersReady || sortedTrips.length === 0}
        >
          <IoIosArrowBack />
        </button>

        <select
          name="sortOrder"
          id="sortOrder"
          className='border rounded-md'
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>

        <select
          name="metric"
          id="metric"
          className='border rounded-md'
          value={selectedMetric}
          onChange={handleMetricChange}
        >
          <option value="avgSpeed">Average Speed</option>
          <option value="distance">Distance</option>
          <option value="movementDuration">Movement Duration</option>
        </select>
        <button
          className='p-1 border border-purple-800 rounded-md hover:bg-purple-800 hover:text-white'
          onClick={handleSearchClick}
        >
          Search
        </button>

        <button
          className='border border-purple-800 p-2 rounded-full hover:text-white hover:bg-purple-800'
          onClick={handleNextClick}
          disabled={!filtersReady || sortedTrips.length === 0}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default Filters;
