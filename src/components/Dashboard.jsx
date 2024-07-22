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
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import CustomTooltip from "./CustomTooltip";

const Dashboard = ({
  rides,
  setSelectedMmiId,
  selectedMmiId,
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

  const aggregateData = useCallback(
    (key, label, conversion) => {
      const data = tripsForSelectedMmiId.map((ride, index) => ({
        index: index + 1,
        [label]: conversion ? (ride[key] / 60).toFixed(2) : ride[key],
        record_date: ride.record_date,
      }));
      return data.sort(
        (a, b) => new Date(a.record_date) - new Date(b.record_date)
      );
    },
    [tripsForSelectedMmiId]
  );

  const calculateAverage = (data, key) => {
    const total = data.reduce((acc, item) => acc + parseFloat(item[key]), 0);
    return (total / data.length).toFixed(2);
  };

  const aggregateByDate = (data) => {
    const dateMap = data.reduce((acc, ride) => {
      const dateKey = new Date(ride.record_date).toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { totalDistance: 0, count: 0 };
      }
      acc[dateKey].totalDistance += parseFloat(ride.km);
      acc[dateKey].count += 1;
      return acc;
    }, {});

    return Object.entries(dateMap)
      .map(([date, { totalDistance, count }]) => ({
        record_date: date,
        averageDistance: (totalDistance / count).toFixed(2),
      }))
      .sort((a, b) => new Date(a.record_date) - new Date(b.record_date));
  };

  const distanceData = useMemo(
    () => aggregateData("distance", "km"),
    [aggregateData]
  );

  const distanceDataAggregated = useMemo(
    () => aggregateByDate(distanceData),
    [distanceData]
  );

  const movementDurationData = useMemo(
    () =>
      aggregateData(
        "movement_duration",
        unit.movement_duration,
        unit.movement_duration === "min"
      ),
    [aggregateData, unit]
  );
  const idleDurationData = useMemo(
    () =>
      aggregateData(
        "idle_duration",
        unit.idle_duration,
        unit.idle_duration === "min"
      ),
    [aggregateData, unit]
  );
  const stoppageDurationData = useMemo(
    () =>
      aggregateData(
        "stoppage_duration",
        unit.stoppage_duration,
        unit.stoppage_duration === "min"
      ),
    [aggregateData, unit]
  );
  const speedData = useMemo(
    () => aggregateData("average_speed", "km/h"),
    [aggregateData]
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
      navigate("/details", { state: { trip: selectedTrip } }); // Pass trip data as state
    }
  };

  const toggleUnit = (key) => {
    setUnit((prevUnit) => ({
      ...prevUnit,
      [key]: prevUnit[key] === "s" ? "min" : "s",
    }));
  };

  const getYAxisProps = (key) => {
    if (unit[key] === "min") {
      return {
        domain: [0, 500],
        ticks: [...Array(11).keys()].map((val) => val * 50),
      };
    }
    return {};
  };

  const tickFormatter = (dateStr) => {
    try {
      return format(new Date(dateStr), "MMM d");
    } catch (error) {
      console.error("Error formatting date:", dateStr, error);
      return "";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-200 font-englebert">
      {/* Distance Chart */}
      <div className="bg-white p-4 rounded-lg shadow flex-row">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Distance</h2>
          <span>{`Avg: ${calculateAverage(
            distanceDataAggregated,
            "averageDistance"
          )} km`}</span>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distanceDataAggregated} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="record_date"
                tickFormatter={tickFormatter}
                // tickCount={distanceDataAggregated.length}
                // interval={5}
              />
              <YAxis />
              <CustomTooltip />
              <Line
                type="monotone"
                dataKey="averageDistance"
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movement Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Movement Duration</h2>
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
              <XAxis dataKey="record_date" tickFormatter={tickFormatter} />
              <YAxis {...getYAxisProps("movement_duration")} />
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
          <h2 className="text-lg font-semibold mb-4">Speed</h2>
          <span>{`Avg: ${calculateAverage(speedData, "km/h")} km/h`}</span>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={speedData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="record_date" tickFormatter={tickFormatter} />
              <YAxis />
              <CustomTooltip />
              <Line type="monotone" dataKey="km/h" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Idle Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Idle Duration</h2>
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
              <XAxis dataKey="record_date" tickFormatter={tickFormatter} />
              <YAxis {...getYAxisProps("idle_duration")} />
              <CustomTooltip />
              <Legend />
              <Bar dataKey={unit.idle_duration} fill="#34A2EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stoppage Duration Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Stoppage Duration</h2>
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
              <XAxis dataKey="record_date" tickFormatter={tickFormatter} />
              <YAxis {...getYAxisProps("stoppage_duration")} />
              <CustomTooltip />
              <Legend />
              <Bar dataKey={unit.stoppage_duration} fill="#FF6961" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
