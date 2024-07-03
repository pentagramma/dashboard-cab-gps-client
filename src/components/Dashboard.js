import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [rides, setRides] = useState([]);
  const [selectedMmiId, setSelectedMmiId] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      const response = await axios.get('http://localhost:5000/api/rides');
      setRides(response.data);
    };
    fetchRides();
  }, []);

  // Data mappings for different charts
  const fareData = rides.map(ride => ({
    name: ride.mmi_id,
    fare: ride.fare,
  }));

  const distanceData = rides.map(ride => ({
    name: ride.mmi_id,
    distance: ride.distance,
  }));

  const movementDurationData = rides.map(ride => ({
    name: ride.mmi_id,
    movementDuration: ride.movement_duration,
  }));

  const idleDurationData = rides.map(ride => ({
    name: ride.mmi_id,
    idleDuration: ride.idle_duration,
  }));

  const stoppageDurationData = rides.map(ride => ({
    name: ride.mmi_id,
    stoppageDuration: ride.stoppage_duration,
  }));

  const speedData = rides.map(ride => ({
    name: ride.mmi_id,
    speed: ride.average_speed,
  }));

  const startStopLocationData = rides.map(ride => ({
    name: ride.mmi_id,
    startLocation: `${ride.drive_locations[0].start_location.lat},${ride.drive_locations[0].start_location.long}`,
    stopLocation: `${ride.drive_locations[ride.drive_locations.length - 1].end_location.lat},${ride.drive_locations[ride.drive_locations.length - 1].end_location.long}`,
  }));

  // Handle change in selected MMI ID
  const handleMmiIdChange = (event) => {
    setSelectedMmiId(event.target.value);
  };

  // Filter data based on selected MMI ID
  const filteredFareData = fareData.filter(data => data.name === selectedMmiId);
  const filteredDistanceData = distanceData.filter(data => data.name === selectedMmiId);
  const filteredMovementDurationData = movementDurationData.filter(data => data.name === selectedMmiId);
  const filteredIdleDurationData = idleDurationData.filter(data => data.name === selectedMmiId);
  const filteredStoppageDurationData = stoppageDurationData.filter(data => data.name === selectedMmiId);
  const filteredSpeedData = speedData.filter(data => data.name === selectedMmiId);
  const filteredStartStopLocationData = startStopLocationData.filter(data => data.name === selectedMmiId);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Dropdown for MMI IDs */}
      <div className="col-span-3 mb-4">
        <label htmlFor="mmiId" className="font-semibold">Select MMI ID:</label>
        <select
          id="mmiId"
          className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={selectedMmiId}
          onChange={handleMmiIdChange}
        >
          <option value="">All</option>
          {rides.map(ride => (
            <option key={ride.mmi_id} value={ride.mmi_id}>{ride.mmi_id}</option>
          ))}
        </select>
      </div>

      {/* Fare Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Fare</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredFareData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="fare"
              >
                {filteredFareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distance Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Distance</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredDistanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="distance" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movement Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Movement Duration</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredMovementDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="movementDuration" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Idle Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Idle Duration</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredIdleDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="idleDuration" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stoppage Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Stoppage Duration</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredStoppageDurationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stoppageDuration" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Speed Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Speed</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredSpeedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Start/Stop Location Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Start/Stop Location</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredStartStopLocationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="startLocation" stroke="#8884d8" />
              <Line type="monotone" dataKey="stopLocation" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
