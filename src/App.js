import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import DetailedDashboard from "./components/DetailedDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RIDES_DATA from "./General";
import DriverStats from "./components/DriverStats";
import LoadingSpinner from "./components/LoadingSpinner";
import { format } from "date-fns";

function App() {
  const [rides, setRides] = useState([]);
  const [selectedMmiId, setSelectedMmiId] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [startEndTime, setStartEndTime] = useState({
    startTime: null,
    endTime: null,
  });

  const [trips, setTrips] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("avgSpeed");
  const [loading, setLoading] = useState(true); // Loading state
  const dashboardRef = useRef(null);

  const scrollToDashboard = () => {
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatRidesData = (rides) => {
    return rides.map((ride) => {
      let recordDate;
      if (
        ride.record_date &&
        typeof ride.record_date === "object" &&
        "$numberLong" in ride.record_date
      ) {
        recordDate = parseInt(ride.record_date.$numberLong, 10);
      } else {
        // Fallback to assuming it's already a plain number
        recordDate = parseInt(ride.record_date, 10);
      }

      // Return the formatted ride object
      return {
        ...ride,
        record_date: recordDate, // Use the timestamp directly
      };
    });
  };

  const transformDataByDate = (rides) => {
    const dateGroups = rides.reduce((acc, ride) => {
      const date = ride.record_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(ride);
      return acc;
    }, {});

    return Object.keys(dateGroups).map((date) => ({
      record_date: date,
      trips: dateGroups[date].length,
    }));
  };

  // Example usage
  const formattedData = transformDataByDate(RIDES_DATA);

  // useEffect(() => {
  //   const fetchRides = async () => {
  //     setLoading(true);
  //     try {
  //       // Using the sample data for testing instead of an API call
  //       const formattedRides = formatRidesData(RIDES_DATA);
  //       setRides(formattedRides);
  //       setLoading(false); // Set loading to false when fetching ends
  //     } catch (error) {
  //       console.error("Error fetching rides data:", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchRides();
  // }, []);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get(
          "https://embifi-backend.onrender.com/api/rides"
        );
        setRides(response.data);
        setLoading(false); // Set loading to false when fetching ends
      } catch (error) {
        console.error("Error fetching rides data:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchRides();
  }, []);

  const resetState = () => {
    setSelectedMmiId(null);
    // Refetch or reset rides if needed
  };

  return (
    <Router>
      <Header scrollToDashboard={scrollToDashboard} />
      <Navbar
        selectedMmiId={selectedMmiId}
        ref={dashboardRef}
        rides={rides}
        startTime={startEndTime.startTime}
        endTime={startEndTime.endTime}
        setSelectedMmiId={setSelectedMmiId}
        resetState={resetState}
        handleMmiIdChange={(e) => setSelectedMmiId(e.target.value)}
      />
      {/* <Filters
        trips={trips}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        setSelectedTrip={setSelectedTrip}
      /> */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                selectedMmiId={selectedMmiId}
                setSelectedMmiId={setSelectedMmiId}
                rides={rides}
                setSelectedTrip={setSelectedTrip}
                setStartEndTime={setStartEndTime}
                formattedData={formattedData}
                data={RIDES_DATA}
              />
            }
          />

          <Route
            path="/details"
            element={<DetailedDashboard selectedTrip={selectedTrip} />}
          />
          <Route
            path="/driverstat/:mmiId"
            element={
              <DriverStats
                selectedMmiId={selectedMmiId}
                rides={rides}
                setSelectedTrip={setSelectedTrip}
                setStartEndTime={setStartEndTime}
                setSelectedMmiId={setSelectedMmiId}
              />
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
