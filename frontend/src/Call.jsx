import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Web } from 'sip.js';
import api from './api/axios';
import { useUser } from './user/UserContext';

const socket = io('http://localhost:5000');

// SIP Configuration for Zoiper
const SIP_CONFIG = {
  server: 'wss://sip.zoiper.com:8089/ws',  // Zoiper's SIP server
  username: '2002dineshmurugan', // Your Zoiper username
  password: 'Dinesh@123', // Your Zoiper password
  domain: 'sip.zoiper.com'  // Changed to correct SIP domain
};

function Call() {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutReason, setLogoutReason] = useState('');
  const [sipUserAgent, setSipUserAgent] = useState(null);
  const [sipSession, setSipSession] = useState(null);
  const [joinApiKey, setJoinApiKey] = useState('');
  const [existingCallInfo, setExistingCallInfo] = useState(null);
  const [showCallInfoModal, setShowCallInfoModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [leadDetails, setLeadDetails] = useState({
    client: '',
    companyName: '',
    category: '',
    mobileNumber: '',
    alternateNumber: '',
    designation: '',
    landmark: '',
    address: '',
    pinNumber: '',
    notes: '',
    disposition: '',
  });
  const [saveStatus, setSaveStatus] = useState('');

  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { logout: userLogout } = useUser();

  // Initialize SIP.js
  useEffect(() => {
    const initializeSip = async () => {
      try {
        const userAgent = new Web.SimpleUser(SIP_CONFIG.server, {
          uri: `sip:${SIP_CONFIG.username}@${SIP_CONFIG.domain}`,
          authorizationUser: SIP_CONFIG.username,
          password: SIP_CONFIG.password,
          register: true, // Enable registration
          registerExpires: 300, // Registration expires in 5 minutes
          sessionDescriptionHandlerOptions: {
            constraints: {
              audio: true,
              video: false
            }
          }
        });

        await userAgent.connect();
        setSipUserAgent(userAgent);
        setLiveStatus('✅ SIP Connected to Zoiper');
      } catch (error) {
        console.error('SIP Connection Error:', error);
        setLiveStatus('❌ SIP Connection Failed');
      }
    };

    initializeSip();
    return () => {
      if (sipUserAgent) {
        sipUserAgent.disconnect();
      }
    };
  }, []);

  const makeCall = async () => {
    if (!/^\+\d{10,15}$/.test(number)) {
      setLiveStatus('❌ Please enter a valid international phone number.');
      return;
    }

    if (!sipUserAgent) {
      setLiveStatus('❌ SIP not connected');
      return;
    }

    setLoading(true);
    setLiveStatus('');

    try {
      // Format number for SIP
      const sipUri = `sip:${number}@${SIP_CONFIG.domain}`;
      
      // Make call using SIP.js
      const session = await sipUserAgent.call(sipUri);
      setSipSession(session);

      // Notify mobile via Join
      await sendToJoin('call', {
        number,
        action: 'start',
        timestamp: new Date().toISOString()
      });

      setLiveStatus('✅ Call initiated successfully.');
    } catch (err) {
      console.error('❌ Call Failed', err);
      setLiveStatus(`❌ Call failed: ${err.message}`);
      setLoading(false);
    }
  };

  const sendToJoin = async (action, data) => {
    if (!joinApiKey) {
      console.error('Join API key not set');
      return;
    }

    try {
      const response = await axios.post(
        `https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush?apikey=${joinApiKey}`,
        {
          deviceId: 'c8c5333957054f4c82b8eef2efb2b532',
          text: JSON.stringify({ action, data })
        }
      );
      console.log('Join notification sent:', response.data);
    } catch (error) {
      console.error('Join notification failed:', error);
    }
  };

  const hangUp = async () => {
    if (sipSession) {
      await sipSession.terminate();
      setSipSession(null);
    }
    
    // Notify mobile via Join
    await sendToJoin('call', {
      number,
      action: 'end',
      timestamp: new Date().toISOString()
    });

    setLiveStatus('📴 Call ended by user.');
    setLoading(false);
  };

  const appendDigit = (digit) => {
    if (!loading) setNumber((prev) => prev + digit);
  };

  const backspace = () => {
    if (!loading) setNumber((prev) => prev.slice(0, -1));
  };

  const handleInputChange = (e) => {
    let input = e.target.value;
    let sanitized = input.replace(/[^\d+]/g, '');
    if (sanitized.includes('+')) {
      sanitized = '+' + sanitized.replace(/\+/g, '');
    }
    setNumber(sanitized);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    console.log('Logging out with reason:', logoutReason);
    setNumber('');
    setLiveStatus('');
    setLoading(false);
    setLogoutReason('');
    userLogout();
    navigate('/login');
  };

  const handleNext = () => {
    navigate('/Livelocation');
  };

  useEffect(() => {
    socket.on('callStatus', (data) => {
      if (data.to === number) {
        setLiveStatus(`📞 Call Status: ${data.status}`);
      }
    });

    socket.on('callEnded', (data) => {
      if (data.to === number) {
        setLiveStatus('❌ Call has been ended.');
        setLoading(false);
      }
    });

    return () => {
      socket.off('callStatus');
      socket.off('callEnded');
    };
  }, [number]);

  // When phone number changes, check for existing call log
  useEffect(() => {
    const fetchCallLog = async () => {
      if (/^\\+\\d{10,15}$/.test(number)) {
        const res = await axios.get(`http://localhost:5000/api/calls?phone=${number}`);
        if (res.data && res.data.length > 0) {
          const log = res.data[0]; // Most recent
          setExistingCallInfo(log);
          setShowCallInfoModal(true);

          // Fetch company details (e.g., from appointments)
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const appRes = await axios.get('http://localhost:5000/api/appointments', config);
          const companyApps = appRes.data.filter(app => app.client === log.personName || app.companyName === log.companyName);
          setCompanyDetails(companyApps);
        } else {
          setExistingCallInfo(null);
          setShowCallInfoModal(false);
          setCompanyDetails(null);
        }
      }
    };
    fetchCallLog();
  }, [number]);

  // Save lead details to backend
  const handleSaveLead = async () => {
    try {
      const payload = {
        client: leadDetails.client,
        date: new Date().toISOString(),
        met: false,
        signed: false,
        contractValue: 0,
        // Add more fields as needed
      };
      await api.post('/appointments', payload);
      setSaveStatus('Lead saved successfully!');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setSaveStatus('Failed to save lead.');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const dialPadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#', '+'];

  return (
    <div className="container py-4">
      <div className="row gx-4">
        {/* Lead Details Panel */}
        <div className="col-md-8">
          <div className="p-4 bg-white shadow rounded">
            <h5 className="mb-3">Leads Details</h5>
            <h1>B&Y</h1>
            <div className="row g-2">
              {['Client Name', 'Company Name', 'Category', 'Mobile Number', 'Alternate Number', 'Designation', 'Landmark', 'Address', 'Pin Number'].map((placeholder, i) => (
                <div className="col-md-6" key={i}>
                  <input className="form-control" placeholder={placeholder} value={leadDetails[placeholder.replace(/ /g, '').replace('PinNumber', 'pinNumber').replace('ClientName', 'client').replace('CompanyName', 'companyName').replace('MobileNumber', 'mobileNumber').replace('AlternateNumber', 'alternateNumber').replace('Designation', 'designation').replace('Landmark', 'landmark').replace('Address', 'address').replace('Category', 'category')]} onChange={e => setLeadDetails({ ...leadDetails, [placeholder.replace(/ /g, '').replace('PinNumber', 'pinNumber').replace('ClientName', 'client').replace('CompanyName', 'companyName').replace('MobileNumber', 'mobileNumber').replace('AlternateNumber', 'alternateNumber').replace('Designation', 'designation').replace('Landmark', 'landmark').replace('Address', 'address').replace('Category', 'category')]: e.target.value })} />
                </div>
              ))}
            </div>
            <hr />
            <h6>Followup</h6>
            <textarea className="form-control mb-2" placeholder="Notes" value={leadDetails.notes} onChange={e => setLeadDetails({ ...leadDetails, notes: e.target.value })}></textarea>
            <select className="form-select mb-3" value={leadDetails.disposition} onChange={e => setLeadDetails({ ...leadDetails, disposition: e.target.value })}>
              <option value="">Select Disposition</option>
              {['RNR', 'callback', 'sale', 'not interested', 'follow ups', 'DND', 'appointment', 'sale done', 'wrong number', 'not reachable', 'already signed'].map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <div className="text-end">
              <button className="btn btn-primary me-2" onClick={handleNext}>
                Next
              </button>
              <button className="btn btn-success" onClick={handleSaveLead}>
                Save
              </button>
            </div>
            {saveStatus && <div className="alert alert-info mt-2">{saveStatus}</div>}
          </div>
        </div>

        {/* Dialer Panel */}
        <div className="col-md-4">
          <div className="p-4 bg-white shadow rounded text-center">
            <h5 className="mb-3">Manual Dialer</h5>
            <div className="mb-2 text-muted">00 : 00 : 00</div>

            <input
              ref={inputRef}
              type="text"
              className="form-control mb-3 text-center"
              value={number}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />

            <div className="d-flex flex-wrap justify-content-center mb-2">
              {dialPadButtons.map((digit, index) => (
                <button
                  key={index}
                  className="btn btn-outline-secondary m-1"
                  style={{ width: '60px' }}
                  onClick={() => appendDigit(digit)}
                  disabled={loading}
                >
                  {digit}
                </button>
              ))}
              <button className="btn btn-danger m-1" onClick={backspace} disabled={loading}>
                ⌫
              </button>
            </div>

            <div className="mb-2">
              <button
                className="btn btn-success me-2"
                onClick={makeCall}
                disabled={loading || !/^\+\d{10,15}$/.test(number)}
              >
                Call
              </button>
              <button className="btn btn-warning" onClick={hangUp} disabled={!loading}>
                Hang Up
              </button>
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Join API Key"
                value={joinApiKey}
                onChange={(e) => setJoinApiKey(e.target.value)}
              />
              <small className="text-muted">Enter your Join by joaoapps API key to enable mobile notifications</small>
            </div>

            <p className="text-muted">{liveStatus}</p>

            <hr />
            <div className="mb-2">
              {['Break', 'Lunch', 'Queries', 'Meeting'].map((reason) => (
                <button
                  key={reason}
                  className={`btn btn-sm me-1 mb-1 ${logoutReason === reason ? 'btn-primary' : 'btn-outline-dark'}`}
                  onClick={() => setLogoutReason(reason)}
                >
                  {reason}
                </button>
              ))}
            </div>

            <button className="btn btn-outline-danger mt-2" onClick={() => setShowLogoutModal(true)}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to logout?</p>
                {logoutReason && (
                  <p>
                    <strong>Reason:</strong> {logoutReason}
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup/Modal for existing call info */}
      {showCallInfoModal && existingCallInfo && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Returning Caller</h5>
                <button type="button" className="btn-close" onClick={() => setShowCallInfoModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {existingCallInfo.personName}</p>
                <p><strong>Company:</strong> {existingCallInfo.companyName}</p>
                {companyDetails && companyDetails.length > 0 && (
                  <div>
                    <h6>Company Details:</h6>
                    {companyDetails.map((app, idx) => (
                      <div key={idx} className="mb-2">
                        <div><strong>Contract Value:</strong> {app.contractValue}</div>
                        <div><strong>Date:</strong> {new Date(app.date).toLocaleDateString()}</div>
                        {/* Add more fields as needed */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Call;
