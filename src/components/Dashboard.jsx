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
    movement_duration: "min",
    idle_duration: "min",
    stoppage_duration: "min",
  });

  const normalizeRidesData = (rides) => {
    return rides.map((ride) => ({
      ...ride,
      start_time:
        typeof ride.start_time === "object"
          ? ride.start_time.$numberLong
          : ride.start_time,
      end_time:
        typeof ride.end_time === "object"
          ? ride.end_time.$numberLong
          : ride.end_time,
    }));
  };

  const normalizedRides = useMemo(() => normalizeRidesData(rides), [rides]);

  const tripsForSelectedMmiId = useMemo(() => {
    return selectedMmiId
      ? normalizedRides.filter((ride) => ride.mmi_id === selectedMmiId)
      : normalizedRides;
  }, [selectedMmiId, normalizedRides]);

  const aggregateData = useCallback(
    (key, label, conversion) => {
      const dateMap = tripsForSelectedMmiId.reduce((acc, ride) => {
        const dateKey = new Date(ride.record_date).toISOString().split("T")[0];
        if (!acc[dateKey]) {
          acc[dateKey] = { total: 0, count: 0 };
        }
        acc[dateKey].total += conversion ? ride[key] / 60 : ride[key];
        acc[dateKey].count += 1;
        return acc;
      }, {});

      return Object.entries(dateMap)
        .map(([date, { total, count }], index) => ({
          record_date: date,
          [label]: (total / count).toFixed(2),
          index: index, // Ensure index is set correctly
        }))
        .sort((a, b) => new Date(a.record_date) - new Date(b.record_date));
    },
    [tripsForSelectedMmiId]
  );

  const calculateAverage = (data, key) => {
    const total = data.reduce((acc, item) => acc + parseFloat(item[key]), 0);
    return (total / data.length).toFixed(2);
  };

  const distanceData = useMemo(
    () => aggregateData("distance", "km"),
    [aggregateData]
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
    console.log("Chart clicked data:", data);
    if (data && data.activePayload && data.activePayload.length > 0) {
      const index = data.activePayload[0].payload.index;
      console.log("Calculated index:", index);
      console.log("Trips for selected MMI ID:", tripsForSelectedMmiId);
      console.log(
        "Length of tripsForSelectedMmiId:",
        tripsForSelectedMmiId.length
      );

      if (index >= 0 && index < tripsForSelectedMmiId.length) {
        const selectedTrip = tripsForSelectedMmiId[index];
        console.log("Selected trip:", selectedTrip);

        if (selectedTrip) {
          setSelectedTrip(selectedTrip);
          setStartEndTime({
            startTime: selectedTrip.start_time,
            endTime: selectedTrip.end_time,
          });
          setSelectedMmiId(selectedTrip.mmi_id);
          navigate("/details", { state: { trip: selectedTrip } });
        } else {
          console.error("Selected trip is undefined at index:", index);
        }
      } else {
        console.error("Invalid index:", index);
      }
    } else {
      console.error("Invalid data or data.activePayload:", data);
    }
  };

  const toggleUnit = (key) => {
    setUnit((prevUnit) => ({
      ...prevUnit,
      [key]: prevUnit[key] === "min" ? "s" : "min",
    }));
  };

  const getYAxisProps = (key) => {
    if (unit[key] === "s") {
      return {
        domain: [0, 18000],
        ticks: [...Array(181).keys()].map((val) => val * 100),
      };
    }

    if (unit[key] === "min") {
      return {
        domain: [0, 500],
        ticks: [...Array(51).keys()].map((val) => val * 10),
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
          <span>{`Avg: ${calculateAverage(distanceData, "km")} km`}</span>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distanceData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="record_date" tickFormatter={tickFormatter} />
              <YAxis />
              <CustomTooltip />
              <Legend />
              <Bar dataKey="km" fill="#8884d8" />
            </BarChart>
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
            {unit.movement_duration === "min" ? "Minutes" : "Seconds"}
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movementDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="record_date" tickFormatter={tickFormatter} />
              <YAxis
                {...getYAxisProps(
                  "movement_duration",
                  unit.movement_duration === "s" ? [0, 18000] : [0, 500]
                )}
              />
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
            {unit.idle_duration === "min" ? "Minutes" : "Seconds"}
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
            {unit.stoppage_duration === "min" ? "Minutes" : "Seconds"}
          </button>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stoppageDurationData} onClick={handleChartClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="record_date" tickFormatter={tickFormatter} />
              <YAxis
                {...getYAxisProps(
                  "stoppage_duration",
                  unit.stoppage_duration === "s" ? [0, 5000] : null
                )}
              />
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
