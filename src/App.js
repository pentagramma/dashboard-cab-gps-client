import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import DetailedDashboard from "./components/DetailedDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DriverStats from "./components/DriverStats";
import LoadingSpinner from "./components/LoadingSpinner";

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

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get("http://localhost:8080/api/rides");
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
