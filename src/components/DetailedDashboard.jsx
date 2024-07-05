import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";


const DetailedDashboard = ({ selectedTrip }) => {
  const navigate = useNavigate();

  if (!selectedTrip) {
    return <div className="w-[100%] h-screen bg-gray-200">No trip selected.</div>;
  }

  const data = [
    { name: 'Distance', value: selectedTrip.distance },
    { name: 'Movement Duration', value: selectedTrip.movement_duration },
    { name: 'Idle Duration', value: selectedTrip.idle_duration },
    { name: 'Stoppage Duration', value: selectedTrip.stoppage_duration },
    { name: 'Average Speed', value: selectedTrip.average_speed }
  ];

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="w-[100%] h-[100%] bg-gray-200 p-4 grid grid-cols-3 gap-4 font-englebert">
      <button
        className='text-[20px] w-[90px] font-ruda font-bold border border-purple-950 hover:bg-purple-950 hover:text-white hover:scale-110 duration-300 text-center rounded-2xl pt-1 pr-1 flex items-center justify-center'
        onClick={handleBackClick}
      >
       <IoIosArrowBack /> BACK
      </button>
      <div className="col-span-2 row-span-3 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Trip Map</h2>
        <LoadScript googleMapsApiKey="AIzaSyCyaFfzx2egZfBNTFFXX3HRP-ypSBQhd28">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '94%' }}
            zoom={10}
            center={{
              lat: selectedTrip.drive_locations[0]?.start_location.lat || 0,
              lng: selectedTrip.drive_locations[0]?.start_location.long || 0
            }}
          >
            {selectedTrip.drive_locations.map((location, index) => (
              <React.Fragment key={index}>
                {location.start_location && (
                  <Marker
                    position={{
                      lat: location.start_location.lat,
                      lng: location.start_location.long
                    }}
                  />
                )}
                {location.end_location && (
                  <Marker
                    position={{
                      lat: location.end_location.lat,
                      lng: location.end_location.long
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Distance</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{ name: 'Distance', value: selectedTrip.distance }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Movement Duration</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{ name: 'Movement Duration', value: selectedTrip.movement_duration }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Idle Duration</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{ name: 'Idle Duration', value: selectedTrip.idle_duration }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Stoppage Duration</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{ name: 'Stoppage Duration', value: selectedTrip.stoppage_duration }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Average Speed</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{ name: 'Average Speed', value: selectedTrip.average_speed }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DetailedDashboard;
