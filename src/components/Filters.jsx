import React, { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Filters = ({ trips, selectedMetric, setSelectedMetric }) => {
  const [sortOrder, setSortOrder] = useState('lowToHigh');
  const [sortedTrips, setSortedTrips] = useState([]);
  const [filtersReady, setFiltersReady] = useState(false); // State to track if both filters are selected
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

  const handleNextClick = () => {
    // Navigate to details page if both filters are selected
    if (filtersReady && sortedTrips.length > 0) {
      navigate(`/details/${sortedTrips[0].mmi_id}`);
    }
  };

  const handlePrevClick = () => {
    // Navigate to details page if both filters are selected
    if (filtersReady && sortedTrips.length > 0) {
      navigate(`/details/${sortedTrips[sortedTrips.length - 1].mmi_id}`);
    }
  };

  return (
    <div className='h-[40px] mt-2'>
      <div className='flex flex-row justify-around items-center mx-[100px]'>
        <button
          className='border border-purple-800 p-2 rounded-full hover:text-yellow-400 hover:bg-purple-800'
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
          className='border border-purple-800 p-2 rounded-full hover:text-yellow-400 hover:bg-purple-800'
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
