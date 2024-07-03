import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { GoogleMap, Marker, Polyline, LoadScript } from '@react-google-maps/api';

const Dashboard = () => {
  const [rides, setRides] = useState([]);
  const [selectedMmiId, setSelectedMmiId] = useState('');
  const [selectedTripId, setSelectedTripId] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rides');
        setRides(response.data);
      } catch (error) {
        console.error('Error fetching rides data:', error);
      }
    };
    fetchRides();
  }, []);

  const tripsForSelectedMmiId = selectedMmiId ? rides.filter((ride) => ride.mmi_id === selectedMmiId) : rides;

  const handleMmiIdChange = useCallback((event) => {
    setSelectedMmiId(event.target.value);
    setSelectedTripId('');
  }, []);

  const handleTripIdChange = useCallback((event) => {
    setSelectedTripId(event.target.value);
  }, []);

  const aggregateData = useCallback(
    (key, label) => {
      return tripsForSelectedMmiId.map((ride, index) => ({ index: index + 1, [label]: ride[key] }));
    },
    [tripsForSelectedMmiId]
  );

  const distanceData = aggregateData('distance', 'km');
  const movementDurationData = aggregateData('movement_duration', 's');
  const idleDurationData = aggregateData('idle_duration', 's');
  const stoppageDurationData = aggregateData('stoppage_duration', 's');
  const speedData = aggregateData('average_speed', 'km/h');

  const startStopLocationData = tripsForSelectedMmiId.map((ride, index) => ({
    index: index + 1,
    startLocation: ride.drive_locations[0]
      ? `${ride.drive_locations[0].start_location.lat},${ride.drive_locations[0].start_location.long}`
      : '',
    stopLocation:
      ride.drive_locations.length > 0
        ? `${ride.drive_locations[ride.drive_locations.length - 1].end_location.lat},${ride.drive_locations[ride.drive_locations.length - 1].end_location.long}`
        : '',
  }));

  const xAxisTicks = Array.from({ length: 8 }, (_, i) => (i + 1) * 5);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Dropdown for MMI IDs */}
      <div className="col-span-3 mb-4">
        <label htmlFor="mmiId" className="font-semibold">
          Select MMI ID:
        </label>
        <select
          id="mmiId"
          className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
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

      {/* Distance Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Distance</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="km" stroke="#8884d2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movement Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Movement Duration</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="s" fill="#FACA15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Idle Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Idle Duration</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={idleDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="s" fill="#31C48D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stoppage Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Stoppage Duration</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stoppageDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="s" fill="#1C64F2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Speed Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Speed</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={speedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="km/h" stroke="#E02424" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Start/Stop Location Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Start/Stop Location</h2>
        <div className="h-96">
          <LoadScript googleMapsApiKey="AIzaSyCyaFfzx2egZfBNTFFXX3HRP-ypSBQhd28">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              zoom={10}
              center={{ lat: 0, lng: 0 }}
            >
              {startStopLocationData.map((data, index) => (
                <React.Fragment key={index}>
                  {data.startLocation && (
                    <Marker
                      position={{
                        lat: parseFloat(data.startLocation.split(',')[0]),
                        lng: parseFloat(data.startLocation.split(',')[1]),
                      }}
                    />
                  )}
                  {data.stopLocation && (
                    <Marker
                      position={{
                        lat: parseFloat(data.stopLocation.split(',')[0]),
                        lng: parseFloat(data.stopLocation.split(',')[1]),
                      }}
                    />
                  )}
                  {data.startLocation && data.stopLocation && (
                    <Polyline
                      path={[
                        {
                          lat: parseFloat(data.startLocation.split(',')[0]),
                          lng: parseFloat(data.startLocation.split(',')[1]),
                        },
                        {
                          lat: parseFloat(data.stopLocation.split(',')[0]),
                          lng: parseFloat(data.stopLocation.split(',')[1]),
                        },
                      ]}
                      options={{ strokeColor: '#FF0000', strokeWeight: 2 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
