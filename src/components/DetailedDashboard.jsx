import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import GoogleMapReact from 'google-map-react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

const DetailedDashboard = ({ selectedTrip }) => {
  const navigate = useNavigate();

  const [showMovementSeconds, setShowMovementSeconds] = useState(true);
  const [showIdleSeconds, setShowIdleSeconds] = useState(true);
  const [showStoppageSeconds, setShowStoppageSeconds] = useState(true);

  if (!selectedTrip) {
    return <div className="w-full h-screen bg-gray-200 flex items-center justify-center font-ruda">No trip selected.</div>;
  }

  const convertToMinutes = (seconds) => {
    return (seconds / 60).toFixed(2); // Convert seconds to minutes
  };

  const markerPosition = {
    lat: -3.745,
    lng: -38.523
  };

  const data = [
    { name: 'Distance', value: selectedTrip.distance, unit: 'km' },
    { name: 'Movement Duration', value: showMovementSeconds ? selectedTrip.movement_duration : convertToMinutes(selectedTrip.movement_duration), unit: showMovementSeconds ? 's' : 'min' },
    { name: 'Idle Duration', value: showIdleSeconds ? selectedTrip.idle_duration : convertToMinutes(selectedTrip.idle_duration), unit: showIdleSeconds ? 's' : 'min' },
    { name: 'Stoppage Duration', value: showStoppageSeconds ? selectedTrip.stoppage_duration : convertToMinutes(selectedTrip.stoppage_duration), unit: showStoppageSeconds ? 's' : 'min' },
    { name: 'Average Speed', value: selectedTrip.average_speed, unit: 'km/h' }
  ];

  const CustomTooltip = ({ payload, label, active }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-400 rounded shadow-lg">
          <p className="label">{`${label} : ${payload[0].value} ${payload[0].payload.unit}`}</p>
        </div>
      );
    }
    return null;
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const toggleMovementSeconds = () => {
    setShowMovementSeconds(!showMovementSeconds);
  };

  const toggleIdleSeconds = () => {
    setShowIdleSeconds(!showIdleSeconds);
  };

  const toggleStoppageSeconds = () => {
    setShowStoppageSeconds(!showStoppageSeconds);
  };

  return (
    <div className="w-full h-full bg-gray-200 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 font-englebert">
      
      <div className="col-span-1 lg:col-span-2 row-span-3 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Trip Map</h2>
        <div className="w-full h-96 lg:h-[94%]">
          <LoadScript googleMapsApiKey="AIzaSyBE3J5p9S6xy006V8yVE_6Fw49nExSlSxs">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              zoom={10}
              center={{
                lat: 
                // selectedTrip.drive_locations[0]?.start_location.lat || 0,
                -3.745,

                 lng: 
                //  selectedTrip.drive_locations[0]?.start_location.long || 0 
                -38.523
              }}
              
            >
              {selectedTrip.drive_locations.map((location, index) => (
  <React.Fragment key={index}>
    {location.start_location && (
      <Marker
        position={
          // lat: location.start_location.lat,
          // lng: location.start_location.long
          markerPosition
        }
        icon={{
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        }}
      />
    )}
      {/* {location.end_location && (
      // <Marker
      //   position={{
      //     lat: location.end_location.lat,
      //     lng: location.end_location.long
      //   }}
      //   icon={{
      //     url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      //   }}
      // />

//    )} */}
  </React.Fragment>
))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Distance</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[0]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#BF125D" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Average Speed</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[4]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className='flex flex-row justify-between items-center'>
          <h2 className="text-lg font-semibold mb-4">Movement Duration</h2>
          <button
            className='border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md'
            onClick={toggleMovementSeconds}
          >
            {showMovementSeconds ? 'Seconds' : 'Minutes'}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[1]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className='flex flex-row justify-between items-center'>
          <h2 className="text-lg font-semibold mb-4">Idle Duration</h2>
          <button
            className='border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md'
            onClick={toggleIdleSeconds}
          >
            {showIdleSeconds ? 'Seconds' : 'Minutes'}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[2]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#1C64F2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className='flex flex-row justify-between items-center'>
          <h2 className="text-lg font-semibold mb-4">Stoppage Duration</h2>
          <button
            className='border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md'
            onClick={toggleStoppageSeconds}
          >
            {showStoppageSeconds ? 'Seconds' : 'Minutes'}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[3]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#FACA15" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};

export default DetailedDashboard;
