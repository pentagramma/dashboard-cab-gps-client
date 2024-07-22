import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import FitBounds from "./FitBounds";
import GreenMarker from "../assets/blue-marker.png";
import RedMarker from "../assets/red-marker.png";
import { MdLocationPin } from "react-icons/md";

const DetailedDashboard = ({ selectedTrip }) => {
  const navigate = useNavigate();

  const [showMovementSeconds, setShowMovementSeconds] = useState(true);
  const [showIdleSeconds, setShowIdleSeconds] = useState(true);
  const [showStoppageSeconds, setShowStoppageSeconds] = useState(true);

  if (!selectedTrip) {
    return (
      <div className="w-full h-screen bg-gray-200 flex items-center justify-center font-ruda">
        No trip selected.
      </div>
    );
  }

  const convertToMinutes = (seconds) => {
    return (seconds / 60).toFixed(2); // Convert seconds to minutes
  };

  const startIcon = new L.Icon({
    iconUrl: GreenMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const stopIcon = new L.Icon({
    iconUrl: RedMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  const data = [
    { name: "Distance", value: selectedTrip.distance, unit: "km" },
    {
      name: "Movement Duration",
      value: showMovementSeconds
        ? selectedTrip.movement_duration
        : convertToMinutes(selectedTrip.movement_duration),
      unit: showMovementSeconds ? "s" : "min",
    },
    {
      name: "Idle Duration",
      value: showIdleSeconds
        ? selectedTrip.idle_duration
        : convertToMinutes(selectedTrip.idle_duration),
      unit: showIdleSeconds ? "s" : "min",
    },
    {
      name: "Stoppage Duration",
      value: showStoppageSeconds
        ? selectedTrip.stoppage_duration
        : convertToMinutes(selectedTrip.stoppage_duration),
      unit: showStoppageSeconds ? "s" : "min",
    },
    { name: "Average Speed", value: selectedTrip.average_speed, unit: "km/h" },
  ];

  const CustomTooltip = ({ payload, label, active }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-400 rounded shadow-lg">
          <p className="label">{`${label} : ${payload[0].value} ${payload[0].payload.unit}`}</p>
        </div>
      );
    }
    return null;
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const toggleMovementSeconds = () => {
    setShowMovementSeconds(!showMovementSeconds);
  };

  const toggleIdleSeconds = () => {
    setShowIdleSeconds(!showIdleSeconds);
  };

  const toggleStoppageSeconds = () => {
    setShowStoppageSeconds(!showStoppageSeconds);
  };

  const bounds = [
    [
      selectedTrip.drive_locations[0]?.start_location.lat || 0,
      selectedTrip.drive_locations[0]?.start_location.long || 0,
    ],
    [
      selectedTrip.drive_locations[0]?.end_location.lat || 0,
      selectedTrip.drive_locations[0]?.end_location.long || 0,
    ],
  ];

  console.log(bounds);

  return (
    <div className="w-full h-full bg-gray-200 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 font-englebert">
      <div className="col-span-1 lg:col-span-2 row-span-3 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Trip Map</h2>
        <div className="w-full h-96 lg:h-[94%]">
          <MapContainer
            bounds={bounds}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[
                selectedTrip.drive_locations[0]?.start_location.lat || 0,
                selectedTrip.drive_locations[0]?.start_location.long || 0,
              ]}
              icon={startIcon}
            />
            <Marker
              position={[
                selectedTrip.drive_locations[0]?.end_location.lat || 0,
                selectedTrip.drive_locations[0]?.end_location.long || 0,
              ]}
              icon={stopIcon}
            />
            <FitBounds bounds={bounds} />
          </MapContainer>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Distance</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[0]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#BF125D" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Average Speed</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[4]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Movement Duration</h2>
          <button
            className="border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md"
            onClick={toggleMovementSeconds}
          >
            {showMovementSeconds ? "Seconds" : "Minutes"}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[1]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Idle Duration</h2>
          <button
            className="border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md"
            onClick={toggleIdleSeconds}
          >
            {showIdleSeconds ? "Seconds" : "Minutes"}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[2]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#1C64F2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-semibold mb-4">Stoppage Duration</h2>
          <button
            className="border-purple-800 border p-1 mb-4 hover:bg-purple-800 hover:text-white rounded-md"
            onClick={toggleStoppageSeconds}
          >
            {showStoppageSeconds ? "Seconds" : "Minutes"}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[data[3]]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" fill="#FACA15" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DetailedDashboard;
