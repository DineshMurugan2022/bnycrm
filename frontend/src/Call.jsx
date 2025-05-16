import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

function Call() {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutReason, setLogoutReason] = useState('');

  const inputRef = useRef(null);
  const navigate = useNavigate();

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

  const makeCall = async () => {
    if (!/^\+\d{10,15}$/.test(number)) {
      setLiveStatus('❌ Please enter a valid international phone number.');
      return;
    }

    setLoading(true);
    setLiveStatus('');

    try {
      const res = await axios.post('http://localhost:5000/api/call', {
        to: number,
      });
      console.log('✅ Call Success', res.data);
    } catch (err) {
      console.error('❌ Call Failed', err.response?.data || err);
      setLiveStatus('❌ Call failed.');
      setLoading(false);
    }
  };

  const hangUp = () => {
    socket.emit('hangUp', { to: number });
    setLiveStatus('📴 Call ended by user.');
    setLoading(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    console.log('Logging out with reason:', logoutReason);
    setNumber('');
    setLiveStatus('');
    setLoading(false);
    setLogoutReason('');
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
                  <input className="form-control" placeholder={placeholder} />
                </div>
              ))}
            </div>

            <hr />
            <h6>Followup</h6>
            <textarea className="form-control mb-2" placeholder="Notes"></textarea>
            <select className="form-select mb-3">
              <option value="">Select Disposition</option>
              {['RNR', 'callback', 'sale', 'not interested', 'follow ups', 'DND', 'appointment', 'sale done', 'wrong number', 'not reachable', 'already signed'].map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>

            <div className="text-end">
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </div>
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
              <button className="btn btn-danger m-1" onClick={backspace} disabled={loading}>⌫</button>
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
                {logoutReason && <p><strong>Reason:</strong> {logoutReason}</p>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Call;
