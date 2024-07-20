import React, { useCallback, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  GoogleMap,
  Marker,
  Polyline,
  LoadScript,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "./CustomTooltip";

const DriverStat = ({
  rides,
  selectedMmiId,
  setSelectedMmiId,
  setSelectedTrip,
  setStartEndTime,
}) => {
  const navigate = useNavigate();
  const [unit, setUnit] = useState({
    movement_duration: "s",
    idle_duration: "s",
    stoppage_duration: "s",
  });

  const tripsForSelectedMmiId = useMemo(() => {
    return selectedMmiId
      ? rides.filter((ride) => ride.mmi_id === selectedMmiId)
      : rides;
  }, [selectedMmiId, rides]);

  const formatDate = (date) => {
    // Format date as needed; e.g., 'YYYY-MM-DD'
    return new Date(date).toLocaleDateString();
  };

  const aggregateDataByDate = (key, label, conversion) => {
    const groupedData = tripsForSelectedMmiId.reduce((acc, ride) => {
      const date = formatDate(ride.record_date); // Change to record_date
      if (!acc[date]) {
        acc[date] = { [label]: 0, count: 0 };
      }
      acc[date][label] += conversion ? ride[key] / 60 : ride[key];
      acc[date].count += 1;
      return acc;
    }, {});

    return Object.keys(groupedData).map((date) => ({
      date,
      [label]: (groupedData[date][label] / groupedData[date].count).toFixed(2),
    }));
  };

  const calculateAverage = (data, key) => {
    const total = data.reduce((acc, curr) => acc + parseFloat(curr[key]), 0);
    return (total / data.length).toFixed(2);
  };

  const distanceData = useMemo(
    () => aggregateDataByDate("distance", "km"),
    [aggregateDataByDate]
  );
  const movementDurationData = useMemo(
    () =>
      aggregateDataByDate(
        "movement_duration",
        unit.movement_duration,
        unit.movement_duration === "min"
      ),
    [aggregateDataByDate, unit]
  );
  const idleDurationData = useMemo(
    () =>
      aggregateDataByDate(
        "idle_duration",
        unit.idle_duration,
        unit.idle_duration === "min"
      ),
    [aggregateDataByDate, unit]
  );
  const stoppageDurationData = useMemo(
    () =>
      aggregateDataByDate(
        "stoppage_duration",
        unit.stoppage_duration,
        unit.stoppage_duration === "min"
      ),
    [aggregateDataByDate, unit]
  );
  const speedData = useMemo(
    () => aggregateDataByDate("average_speed", "km/h"),
    [aggregateDataByDate]
  );

  const startStopLocationData = useMemo(() => {
    return tripsForSelectedMmiId.map((ride, index) => ({
      index: index + 1,
      startLocation: ride.drive_locations[0]
        ? `${ride.drive_locations[0].start_location.lat},${ride.drive_locations[0].start_location.long}`
        : null,
      stopLocation:
        ride.drive_locations.length > 0
          ? `${
              ride.drive_locations[ride.drive_locations.length - 1].end_location
                .lat
            },${
              ride.drive_locations[ride.drive_locations.length - 1].end_location
                .long
            }`
          : null,
    }));
  }, [tripsForSelectedMmiId]);

  const xAxisTicks = useMemo(
    () => Array.from({ length: 8 }, (_, i) => (i + 1) * 5),
    []
  );

  const handleChartClick = (data) => {
    if (data && data.activePayload) {
      const selectedTrip =
        tripsForSelectedMmiId[data.activePayload[0].payload.index - 1];
      setSelectedTrip(selectedTrip);
      setStartEndTime({
        startTime: selectedTrip.start_time,
        endTime: selectedTrip.end_time,
      });
      setSelectedMmiId(selectedTrip.mmi_id);
      navigate("/details");
    }
  };

  const validLocations = startStopLocationData.filter(
    (data) => data.startLocation || data.stopLocation
  );
  const initialCenter =
    validLocations.length > 0
      ? {
          lat: parseFloat(validLocations[0].startLocation.split(",")[0]),
          lng: parseFloat(validLocations[0].startLocation.split(",")[1]),
        }
      : { lat: 0, lng: 0 };

  const toggleUnit = (key) => {
    setUnit((prevUnit) => ({
      ...prevUnit,
      [key]: prevUnit[key] === "s" ? "min" : "s",
    }));
  };

  const getYAxisProps = (key) => {
    if (unit[key] === "min") {
      return {
        domain: [0, 600],
        ticks: [...Array(11).keys()].map((val) => val * 50),
      };
    } else {
      return {
        domain: [0, 50000],
        ticks: [...Array(11).keys()].map((val) => val * 50),
      };
    }
    return {};
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-200 font-englebert">
      {/* Distance Chart */}
      <div className="bg-white p-4 rounded-lg shadow flex-row">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Distance</h2>
          <div className="text-sm">
            Avg: {calculateAverage(distanceData, "km")} km
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distanceData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ angle: -45, textAnchor: "end" }}
                domain={[0, "auto"]}
              />
              <YAxis domain={[0, "auto"]} />
              <CustomTooltip />
              <Legend />
              <Line type="monotone" dataKey="km" stroke="#8884d2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movement Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Movement Duration</h2>
          <div className="text-sm">
            Avg:{" "}
            {calculateAverage(movementDurationData, unit.movement_duration)}{" "}
            {unit.movement_duration}
          </div>
          <button
            className="border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md"
            onClick={() => toggleUnit("movement_duration")}
          >
            {unit.movement_duration === "s" ? "Seconds" : "Minutes"}
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ angle: -45, textAnchor: "end" }} />
              <YAxis domain={[0, "auto"]} />
              <CustomTooltip />
              <Legend />
              <Bar dataKey={unit.movement_duration} fill="#FACA15" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Speed Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Average Speed</h2>
          <div className="text-sm">
            Avg: {calculateAverage(speedData, "km/h")} km/h
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={speedData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ angle: -45, textAnchor: "end" }} />
              <YAxis domain={[0, "auto"]} />
              <CustomTooltip />
              <Legend />
              <Line type="monotone" dataKey="km/h" stroke="#E02424" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stoppage Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Stoppage Duration</h2>
          <div className="text-sm">
            Avg:{" "}
            {calculateAverage(stoppageDurationData, unit.stoppage_duration)}{" "}
            {unit.stoppage_duration}
          </div>
          <button
            className="border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md"
            onClick={() => toggleUnit("stoppage_duration")}
          >
            {unit.stoppage_duration === "s" ? "Seconds" : "Minutes"}
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stoppageDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ angle: -45, textAnchor: "end" }} />
              <YAxis domain={[0, "auto"]} />
              <CustomTooltip />
              <Legend />
              <Bar dataKey={unit.stoppage_duration} fill="#1C64F2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Idle Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Idle Duration</h2>
          <div className="text-sm">
            Avg: {calculateAverage(idleDurationData, unit.idle_duration)}{" "}
            {unit.idle_duration}
          </div>
          <button
            className="border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md"
            onClick={() => toggleUnit("idle_duration")}
          >
            {unit.idle_duration === "s" ? "Seconds" : "Minutes"}
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={idleDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ angle: -45, textAnchor: "end" }} />
              <YAxis {...getYAxisProps("idle_duration")} />
              <CustomTooltip />
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
          <LoadScript googleMapsApiKey="AIzaSyCyaFfzx2egZfBNTFFXX3HRP-ypSBQhd28">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              zoom={10}
              center={initialCenter}
            >
              {validLocations.map((data, index) => (
                <React.Fragment key={index}>
                  {data.startLocation && (
                    <Marker
                      position={{
                        lat: parseFloat(data.startLocation.split(",")[0]),
                        lng: parseFloat(data.startLocation.split(",")[1]),
                      }}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                      }}
                    />
                  )}
                  {data.stopLocation && (
                    <Marker
                      position={{
                        lat: parseFloat(data.stopLocation.split(",")[0]),
                        lng: parseFloat(data.stopLocation.split(",")[1]),
                      }}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      }}
                    />
                  )}
                  {data.startLocation && data.stopLocation && (
                    <Polyline
                      path={[
                        {
                          lat: parseFloat(data.startLocation.split(",")[0]),
                          lng: parseFloat(data.startLocation.split(",")[1]),
                        },
                        {
                          lat: parseFloat(data.stopLocation.split(",")[0]),
                          lng: parseFloat(data.stopLocation.split(",")[1]),
                        },
                      ]}
                      options={{ strokeColor: "#FF0000", strokeWeight: 2 }}
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

export default DriverStat;
