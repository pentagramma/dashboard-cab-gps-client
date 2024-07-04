// src/components/MmiIdDropdown.js
import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const MmiIdDropdown = ({ rides, onChange }) => {
  const [selectedMmiId, setSelectedMmiId] = useState('');

  const handleMmiIdChange = (event) => {
    setSelectedMmiId(event.target.value);
    onChange(event.target.value);
  };

  return (
    <select
      id="mmiId"
      className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
      value={selectedMmiId}
      onChange={handleMmiIdChange}
    >
      <option value="">All</option>
      {rides.map((ride) => (
        <option key={ride._id} value={ride.mmi_id}>
          {ride.mmi_id}
        </option>
      ))}
    </select>
  );
};

export default MmiIdDropdown;
