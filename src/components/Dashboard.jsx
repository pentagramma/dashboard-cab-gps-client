import React, { useMemo, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ rides }) => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState({
    movement_duration: 's',
    idle_duration: 's',
    stoppage_duration: 's',
  });

  // Calculate aggregated data across all rides
  const aggregateData = (key, label, conversion) => {
    return rides.map((ride, index) => ({
      index: index + 1,
      [label]: conversion ? (ride[key] / 60).toFixed(2) : ride[key],
    }));
  };

  const distanceData = useMemo(() => aggregateData('distance', 'km'), [rides]);
  const movementDurationData = useMemo(() => aggregateData('movement_duration', unit.movement_duration, unit.movement_duration === 'min'), [rides, unit]);
  const idleDurationData = useMemo(() => aggregateData('idle_duration', unit.idle_duration, unit.idle_duration === 'min'), [rides, unit]);
  const stoppageDurationData = useMemo(() => aggregateData('stoppage_duration', unit.stoppage_duration, unit.stoppage_duration === 'min'), [rides, unit]);
  const speedData = useMemo(() => aggregateData('average_speed', 'km/h'), [rides]);

  const toggleUnit = (key) => {
    setUnit((prevUnit) => ({
      ...prevUnit,
      [key]: prevUnit[key] === 's' ? 'min' : 's',
    }));
  };

  const getYAxisProps = (key) => {
    if (unit[key] === 'min') {
      return {
        domain: [0, 500],
        ticks: [...Array(11).keys()].map((val) => val * 50),
      };
    }
    return {};
  };

  const xAxisTicks = Array.from({ length: 8 }, (_, i) => (i + 1) * 5);

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      navigate('/details');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-200 font-englebert">
      {/* Distance Chart */}
      <div className="bg-white p-4 rounded-lg shadow flex-row">
        <div className='flex flex-row justify-between items-center'>
          <h2 className="text-lg font-semibold mb-4">Distance</h2>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distanceData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
              <YAxis {...getYAxisProps('distance')} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="km" stroke="#8884d2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movement Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className='flex flex-row justify-between items-center'>
          <h2 className="text-lg font-semibold mb-4">Movement Duration</h2>
          <button
            className='border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md'
            onClick={() => toggleUnit('movement_duration')}
          >
            {unit.movement_duration === 's' ? 'Seconds' : 'Minutes'}
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
              <YAxis {...getYAxisProps('movement_duration')} />
              <Tooltip />
              <Legend />
              <Bar dataKey={unit.movement_duration} fill="#FACA15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Speed Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Average Speed</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={speedData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="km/h" stroke="#E02424" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stoppage Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className='flex flex-row justify-between items-center'>
          <h2 className="text-lg font-semibold mb-4">Stoppage Duration</h2>
          <button
            className='border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md'
            onClick={() => toggleUnit('stoppage_duration')}
          >
            {unit.stoppage_duration === 's' ? 'Seconds' : 'Minutes'}
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stoppageDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={unit.stoppage_duration} fill="#1C64F2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Idle Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className='flex flex-row justify-between items-center'>
          <h2 className="text-lg font-semibold mb-4">Idle Duration</h2>
          <button
            className='border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md'
            onClick={() => toggleUnit('idle_duration')}
          >
            {unit.idle_duration === 's' ? 'Seconds' : 'Minutes'}
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={idleDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
              <YAxis {...getYAxisProps('idle_duration')} />
              <Tooltip />
              <Legend />
              <Bar dataKey={unit.idle_duration} fill="#31C48D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Start/Stop Location Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Start/Stop Location</h2>
        <div className="h-96">
          <LoadScript googleMapsApiKey="YOUR_API_KEY">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              zoom={10}
              center={{ lat: 0, lng: 0 }}
            >
              {/* Map markers and polylines logic here */}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
