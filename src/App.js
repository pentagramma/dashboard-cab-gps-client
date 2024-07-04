import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Header from './components/Header';

function App() {
  const [rides, setRides] = useState([]);
  const [selectedMmiId, setSelectedMmiId] = useState('');

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
    <div className="App">
      <Header />
      <Navbar selectedMmiId={selectedMmiId} handleMmiIdChange={handleMmiIdChange} rides={rides} />
      <Dashboard selectedMmiId={selectedMmiId} rides={rides} />
    </div>
  );
}

export default App;
