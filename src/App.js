import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Header from './components/Header';
import DetailedDashboard from './components/DetailedDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [rides, setRides] = useState([]);
  const [selectedMmiId, setSelectedMmiId] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);

  const dashboardRef = useRef(null);

  const scrollToDashboard = () => {
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  const handleMmiIdChange = (event) => {
    setSelectedMmiId(event.target.value);
  };

  return (
    <Router>
      <Header scrollToDashboard={scrollToDashboard}/>
      <Navbar selectedMmiId={selectedMmiId} ref={dashboardRef} handleMmiIdChange={handleMmiIdChange} rides={rides} />
      <Routes>
        <Route path="/" element={<Dashboard  selectedMmiId={selectedMmiId} rides={rides} setSelectedTrip={setSelectedTrip} />} />
        <Route path="/details" element={<DetailedDashboard selectedTrip={selectedTrip} />} />
      </Routes>
    </Router>
  );
}

export default App;
