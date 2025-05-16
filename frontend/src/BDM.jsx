import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BDM() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    client: '',
    date: '',
    met: false,
    signed: false,
    contractValue: 0,
    clearancePending: false,
  });
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);

  const API = 'http://localhost:5000/appointments'; // your backend API

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(API);
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      const payload = { ...newEntry, contractValue: Number(newEntry.contractValue) };
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
      } else {
        await axios.post(API, payload);
      }
      setNewEntry({
        client: '',
        date: '',
        met: false,
        signed: false,
        contractValue: 0,
        clearancePending: false,
      });
      setEditingId(null);
      setShowForm(false);
      fetchAppointments(); // Refresh data
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleEdit = (entry) => {
    setNewEntry(entry);
    setEditingId(entry._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'met') return a.met;
    if (filter === 'signed') return a.signed;
    if (filter === 'pending') return a.clearancePending;
    return true;
  });

  const totalAppointments = appointments.length;
  const metCount = appointments.filter((a) => a.met).length;
  const notMetCount = totalAppointments - metCount;
  const signedCount = appointments.filter((a) => a.signed).length;
  const clearancePendingCount = appointments.filter((a) => a.clearancePending).length;
  const totalSales = appointments
    .filter((a) => a.signed && !a.clearancePending)
    .reduce((sum, a) => sum + Number(a.contractValue), 0);

  return (
    <div className="container my-4">
      {/* Header and Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>BDM Appointments</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingId(null);
            setNewEntry({
              client: '',
              date: '',
              met: false,
              signed: false,
              contractValue: 0,
              clearancePending: false,
            });
            setShowForm(true);
          }}
        >
          Add Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-3">
        <div className="col-md-2">
          <div className="card p-3 bg-primary text-white">
            <h6>Total</h6>
            <h5>{totalAppointments}</h5>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 bg-success text-white">
            <h6>Met</h6>
            <h5>{metCount}</h5>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 bg-danger text-white">
            <h6>Not Met</h6>
            <h5>{notMetCount}</h5>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 bg-info text-white">
            <h6>Signed</h6>
            <h5>{signedCount}</h5>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 bg-warning">
            <h6>Pending</h6>
            <h5>{clearancePendingCount}</h5>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 bg-dark text-white">
            <h6>Sales</h6>
            <h5>₹{totalSales}</h5>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-3">
        <label className="form-label me-2">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-select w-auto d-inline"
        >
          <option value="all">All</option>
          <option value="met">Met</option>
          <option value="signed">Signed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-3 mb-3">
          <h5>{editingId ? 'Edit' : 'Add'} Appointment</h5>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Client Name"
                value={newEntry.client}
                onChange={(e) => setNewEntry({ ...newEntry, client: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={newEntry.date}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-1"
                checked={newEntry.met}
                onChange={(e) => setNewEntry({ ...newEntry, met: e.target.checked })}
              />
              <label className="mb-0">Met</label>
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-1"
                checked={newEntry.signed}
                onChange={(e) => setNewEntry({ ...newEntry, signed: e.target.checked })}
              />
              <label className="mb-0">Signed</label>
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Contract Value"
                value={newEntry.contractValue}
                onChange={(e) => setNewEntry({ ...newEntry, contractValue: e.target.value })}
              />
            </div>
            <div className="col-md-1 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-1"
                checked={newEntry.clearancePending}
                onChange={(e) => setNewEntry({ ...newEntry, clearancePending: e.target.checked })}
              />
              <label className="mb-0">Pending</label>
            </div>
            <div className="col-md-1">
              <button
                className="btn btn-success"
                onClick={handleAddOrUpdate}
                disabled={!newEntry.client || !newEntry.date}
              >
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Client</th>
            <th>Date</th>
            <th>Met</th>
            <th>Signed</th>
            <th>Value</th>
            <th>Pending</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((app) => (
            <tr key={app._id}>
              <td>{app.client}</td>
              <td>{new Date(app.date).toLocaleDateString()}</td>
              <td>{app.met ? '✅' : '❌'}</td>
              <td>{app.signed ? '✅' : '❌'}</td>
              <td>₹{app.contractValue}</td>
              <td>{app.clearancePending ? '⏳' : '✔️'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(app)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(app._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filteredAppointments.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BDM;
