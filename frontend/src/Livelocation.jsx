import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const initialBDMs = [
  {
    name: "Dinesh M",
    lat: 13.0827,
    lng: 80.2707,
    met: 5,
    notMet: 2,
    status: "On Appointment",
    phone: "+919843240703",
    address: ""
  },
  {
    name: "Vijay K",
    lat: 13.0674,
    lng: 80.2376,
    met: 3,
    notMet: 4,
    status: "Travelling",
    phone: "+919843240703",
    address: ""
  },
  {
    name: "J. Kishore",
    lat: 13.0450,
    lng: 80.2083,
    met: 2,
    notMet: 5,
    status: "Waiting for Appointment",
    phone: "+919843240703",
    address: ""
  }
];

const TWILIO_API_URL = "http://localhost:5000/send-sms";

const BDMList = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [bdms, setBdms] = useState(initialBDMs);
  const [loading, setLoading] = useState(true);
  const [appointmentStatus, setAppointmentStatus] = useState('');

  // Fetch address using OpenStreetMap Nominatim API
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || "Address not found";
    } catch (error) {
      console.error('Error fetching address:', error);
      return "Error fetching address";
    }
  };

  // Initialize map and add markers
  const initMap = (bdmData) => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([13.0827, 80.2707], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance.current);

    bdmData.forEach((bdm) => {
      const marker = L.marker([bdm.lat, bdm.lng], { icon: customIcon }).addTo(mapInstance.current);
      marker.bindPopup(`
        <div style="text-align: center;">
          <strong>${bdm.name}</strong><br/>
          📍 ${bdm.address}<br/>
          ✅ Met: ${bdm.met}<br/>
          ❌ Not Met: ${bdm.notMet}<br/>
          📞 ${bdm.phone}<br/>
          🚀 Status: <b>${bdm.status}</b>
        </div>
      `);
    });
  };

  // Send appointment SMS
  const handleAddAppointment = async (bdm) => {
    try {
      const response = await fetch(TWILIO_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: bdm.phone,
          message: `Appointment scheduled with ${bdm.name}. Please be on time!`
        })
      });

      if (response.ok) {
        setAppointmentStatus('✅ Appointment message sent successfully!');
      } else {
        setAppointmentStatus('❌ Failed to send appointment message.');
      }
    } catch (error) {
      console.error('Error sending appointment message:', error);
      setAppointmentStatus('❌ Error occurred while sending message.');
    }
  };

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAllAddresses = async () => {
      setLoading(true);
      const updatedBdms = await Promise.all(
        initialBDMs.map(async (bdm) => {
          const address = await fetchAddress(bdm.lat, bdm.lng);
          return { ...bdm, address };
        })
      );
      setBdms(updatedBdms);
      initMap(updatedBdms);
      setLoading(false);
    };

    fetchAllAddresses();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">📍 BDM Live Tracking Dashboard </h3>

      {loading && (
        <div className="alert alert-info text-center">
          ⏳ Fetching live locations and addresses...
        </div>
      )}

      <div className="card">
        <div className="card-body p-0" style={{ height: '500px' }}>
          <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      <h5 className="mt-4">📋 BDM Status List</h5>
      <div className="row">
        {bdms.map((bdm, index) => (
          <div className="col-md-6 col-sm-12 mt-3" key={index}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>{bdm.name}</h5>
                <p>📍 Location: {bdm.address || "Loading address..."}</p>
                <p>✅ Clients Met: {bdm.met}</p>
                <p>❌ Clients Not Met: {bdm.notMet}</p>
                <p>📞 Phone: {bdm.phone}</p>
                <p>🚀 Status: <strong>{bdm.status}</strong></p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddAppointment(bdm)}
                >
                  Add Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {appointmentStatus && (
        <div className="alert alert-info mt-4 text-center" role="alert">
          {appointmentStatus}
        </div>
      )}
    </div>
  );
};

export default BDMList;
