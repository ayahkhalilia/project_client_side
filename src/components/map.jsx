import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

const Map = () => {
  const [deliveryLocation, setDeliveryLocation] = useState([51.505, -0.09]); // Default location
  const [deliveryId, setDeliveryId] = useState(""); // ID of the delivery to track

  // Fetch delivery location from the back end
  const fetchDeliveryLocation = async () => {
    try {
      const response = await axios.get(`https://rebook-backend-ldmy.onrender.com/api/delivery/${deliveryId}`);
      setDeliveryLocation(response.data.location);
    } catch (error) {
      console.error("Error fetching delivery location:", error);
    }
  };

  // Poll the back end for updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (deliveryId) {
        fetchDeliveryLocation();
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [deliveryId]);

  return (
    <div>
      <h1>Delivery Tracking</h1>
      <input
        type="text"
        placeholder="Enter Delivery ID"
        value={deliveryId}
        onChange={(e) => setDeliveryId(e.target.value)}
      />
      <MapContainer center={deliveryLocation} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={deliveryLocation}>
          <Popup>Delivery Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;