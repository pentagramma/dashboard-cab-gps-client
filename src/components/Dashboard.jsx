import React, { useCallback, useMemo, } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = ({ rides, selectedMmiId, setSelectedTrip }) => {
  const navigate = useNavigate();

  const tripsForSelectedMmiId = useMemo(() => {
    return selectedMmiId ? rides.filter((ride) => ride.mmi_id === selectedMmiId) : rides;
  }, [selectedMmiId, rides]);

  const aggregateData = useCallback(
    (key, label) => {
      return tripsForSelectedMmiId.map((ride, index) => ({ index: index + 1, [label]: ride[key] }));
    },
    [tripsForSelectedMmiId]
  );

  const distanceData = useMemo(() => aggregateData('distance', 'km'), [aggregateData]);
  const movementDurationData = useMemo(() => aggregateData('movement_duration', 's'), [aggregateData]);
  const idleDurationData = useMemo(() => aggregateData('idle_duration', 's'), [aggregateData]);
  const stoppageDurationData = useMemo(() => aggregateData('stoppage_duration', 's'), [aggregateData]);
  const speedData = useMemo(() => aggregateData('average_speed', 'km/h'), [aggregateData]);

  const startStopLocationData = useMemo(() => {
    return tripsForSelectedMmiId.map((ride, index) => ({
      index: index + 1,
      startLocation: ride.drive_locations[0]
        ? `${ride.drive_locations[0].start_location.lat},${ride.drive_locations[0].start_location.long}`
        : '',
      stopLocation:
        ride.drive_locations.length > 0
          ? `${ride.drive_locations[ride.drive_locations.length - 1].end_location.lat},${ride.drive_locations[ride.drive_locations.length - 1].end_location.long}`
          : '',
    }));
  }, [tripsForSelectedMmiId]);

  const xAxisTicks = useMemo(() => Array.from({ length: 8 }, (_, i) => (i + 1) * 5), []);

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      const selectedTrip = tripsForSelectedMmiId[data.activePayload[0].payload.index - 1];
      setSelectedTrip(selectedTrip);
      navigate('/details');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-200 font-englebert">
      {/* Distance Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Distance</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distanceData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
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
            <BarChart data={movementDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
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
            <BarChart data={idleDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
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
            <BarChart data={stoppageDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" ticks={xAxisTicks} domain={[1, 40]} />
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
