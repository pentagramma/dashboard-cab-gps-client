import React, { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Filters = ({ trips, selectedMetric, setSelectedMetric }) => {
  const [sortOrder, setSortOrder] = useState('lowToHigh');
  const [sortedTrips, setSortedTrips] = useState([]);
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

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleMetricChange = (e) => {
    setSelectedMetric(e.target.value);
  };

  const handleNextClick = () => {
    // Navigate to details page for the next MMI ID based on current sorting
    const currentIndex = sortedTrips.findIndex(trip => trip.mmi_id === trips[0].mmi_id);
    const nextIndex = sortOrder === 'lowToHigh' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < sortedTrips.length) {
      navigate(`/details/${sortedTrips[nextIndex].mmi_id}`);
    }
  };

  const handlePrevClick = () => {
    // Navigate to details page for the previous MMI ID based on current sorting
    const currentIndex = sortedTrips.findIndex(trip => trip.mmi_id === trips[0].mmi_id);
    const prevIndex = sortOrder === 'lowToHigh' ? currentIndex - 1 : currentIndex + 1;

    if (prevIndex >= 0 && prevIndex < sortedTrips.length) {
      navigate(`/details/${sortedTrips[prevIndex].mmi_id}`);
    }
  };

  return (
    <div className='h-[40px] mt-2'>
      <div className='flex flex-row justify-around items-center mx-[100px]'>
        <button
          className='border border-purple-800 p-2 rounded-full hover:text-yellow-400 hover:bg-purple-800'
          onClick={handlePrevClick}
          disabled={sortedTrips.length === 0 || sortedTrips.findIndex(trip => trip.mmi_id === trips[0].mmi_id) === 0}
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
          disabled={sortedTrips.length === 0 || sortedTrips.findIndex(trip => trip.mmi_id === trips[0].mmi_id) === sortedTrips.length - 1}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default Filters;
