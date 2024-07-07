import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import DetailedDashboard from "./components/DetailedDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Filters from "./components/Filters";
import DriverStats from "./components/DriverStats";

function App() {
  const [rides, setRides] = useState([]);
  const [selectedMmiId, setSelectedMmiId] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [startEndTime, setStartEndTime] = useState({
    startTime: null,
    endTime: null,
  });
  const [trips, setTrips] = useState([]); // Example state holding trips data
  const [selectedMetric, setSelectedMetric] = useState("avgSpeed");
  const dashboardRef = useRef(null);

  const scrollToDashboard = () => {
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rides");
        setRides(response.data);
      } catch (error) {
        console.error("Error fetching rides data:", error);
      }
    };
    fetchRides();
  }, []);

  const handleMmiIdChange = (event) => {
    setSelectedMmiId(event.target.value);
  };

  return (
    <Router>
      <Header scrollToDashboard={scrollToDashboard} />
      <Navbar
        selectedMmiId={selectedMmiId}
        ref={dashboardRef}
        handleMmiIdChange={handleMmiIdChange}
        rides={rides}
        startTime={startEndTime.startTime}
        endTime={startEndTime.endTime}
      />
      <Filters
        trips={trips}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              selectedMmiId={selectedMmiId}
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
          element={<DriverStats selectedMmiId={selectedMmiId} rides={rides} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
