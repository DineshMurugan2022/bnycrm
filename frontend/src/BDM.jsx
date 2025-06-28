import React, { useState, useEffect } from 'react';
import api from './api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BDM() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState(initialEntry());
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = '/appointments';

  useEffect(() => {
    fetchAppointments();
  }, []);

  function initialEntry() {
    return {
      client: '',
      date: '',
      met: false,
      signed: false,
      contractValue: 0,
      clearancePending: false,
      follow: false,
    };
  }

  const fetchAppointments = async () => {
    try {
      const res = await api.get(API_URL);
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!newEntry.client || !newEntry.date) {
      alert('Client and date are required.');
      return;
    }

    if (isNaN(Date.parse(newEntry.date))) {
      alert('Please enter a valid date.');
      return;
    }

    setLoading(true);

    const payload = {
      ...newEntry,
      contractValue: Number(newEntry.contractValue),
    };

    console.log('Saving payload:', payload);

    try {
      if (editingId) {
        await api.put(`${API_URL}/${editingId}`, payload);
      } else {
        await api.post(API_URL, payload);
      }

      resetForm();
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error.response || error);
      let errorMessage = 'Could not save appointment. Please check your inputs.';

      if (error.response && error.response.data) {
        // Look for error message in common places
        if (typeof error.response.data.error === 'string') {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data.message === 'string') {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error && typeof error.response.data.error.message === 'string') {
           errorMessage = error.response.data.error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewEntry(initialEntry());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (entry) => {
    setNewEntry({
      client: entry.client,
      date: entry.date.split('T')[0],
      met: entry.met,
      signed: entry.signed,
      contractValue: entry.contractValue,
      clearancePending: entry.clearancePending,
      follow: entry.follow,
    });
    setEditingId(entry._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`${API}/${id}`, config);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error.response?.data || error.message);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'met') return a.met;
    if (filter === 'signed') return a.signed;
    if (filter === 'pending') return a.clearancePending;
    if (filter === 'follow') return a.follow;
    return true;
  });

  const stats = {
    total: appointments.length,
    met: appointments.filter((a) => a.met).length,
    notMet: appointments.filter((a) => !a.met).length,
    signed: appointments.filter((a) => a.signed).length,
    pending: appointments.filter((a) => a.clearancePending).length,
    sales: appointments
      .filter((a) => a.signed && !a.clearancePending)
      .reduce((sum, a) => sum + Number(a.contractValue), 0),
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>BDM Appointments</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add Appointment
        </button>
      </div>

      <div className="row mb-3">
        <StatCard title="Total" value={stats.total} bg="primary" />
        <StatCard title="Met" value={stats.met} bg="success" />
        <StatCard title="Not Met" value={stats.notMet} bg="danger" />
        <StatCard title="Signed" value={stats.signed} bg="info" />
        <StatCard title="Pending" value={stats.pending} bg="warning" />
        <StatCard title="Sales" value={`₹${stats.sales}`} bg="dark" />
      </div>

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
          <option value="follow">Follow</option>
        </select>
      </div>

      {showForm && (
        <AppointmentForm
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          handleAddOrUpdate={handleAddOrUpdate}
          editingId={editingId}
          loading={loading}
        />
      )}

      <AppointmentTable
        appointments={filteredAppointments}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

const StatCard = ({ title, value, bg }) => (
  <div className="col-md-2 mb-2">
    <div className={`card p-3 bg-${bg} text-white`}>
      <h6>{title}</h6>
      <h5>{value}</h5>
    </div>
  </div>
);

const AppointmentForm = ({ newEntry, setNewEntry, handleAddOrUpdate, editingId, loading }) => (
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
      <CheckboxField label="Met" value={newEntry.met} onChange={(v) => setNewEntry({ ...newEntry, met: v })} />
      <CheckboxField label="Signed" value={newEntry.signed} onChange={(v) => setNewEntry({ ...newEntry, signed: v })} />
      <div className="col-md-2">
        <input
          type="number"
          className="form-control"
          placeholder="Contract Value"
          value={newEntry.contractValue}
          onChange={(e) => setNewEntry({ ...newEntry, contractValue: e.target.value })}
        />
      </div>
      <CheckboxField label="Pending" value={newEntry.clearancePending} onChange={(v) => setNewEntry({ ...newEntry, clearancePending: v })} />
      <CheckboxField label="Follow" value={newEntry.follow} onChange={(v) => setNewEntry({ ...newEntry, follow: v })} />
      <div className="col-md-1">
        <button
          className="btn btn-success"
          onClick={handleAddOrUpdate}
          disabled={loading || !newEntry.client || !newEntry.date}
        >
          {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  </div>
);

const CheckboxField = ({ label, value, onChange }) => (
  <div className="col-md-1 d-flex align-items-center">
    <input
      type="checkbox"
      className="form-check-input me-1"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
    <label className="mb-0">{label}</label>
  </div>
);

const AppointmentTable = ({ appointments, handleEdit, handleDelete }) => (
  <table className="table table-bordered table-striped">
    <thead className="table-dark">
      <tr>
        <th>Client</th>
        <th>Date</th>
        <th>Met</th>
        <th>Signed</th>
        <th>Follow</th>
        <th>Value</th>
        <th>Pending</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {appointments.length > 0 ? (
        appointments.map((app) => (
          <tr key={app._id}>
            <td>{app.client}</td>
            <td>{new Date(app.date).toLocaleDateString()}</td>
            <td>{app.met ? '✅' : '❌'}</td>
            <td>{app.signed ? '✅' : '❌'}</td>
            <td>{app.follow ? '✅' : '❌'}</td>
            <td>₹{app.contractValue}</td>
            <td>{app.clearancePending ? '⏳' : '✔️'}</td>
            <td>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(app)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(app._id)}>Delete</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="text-center">No appointments found.</td>
        </tr>
      )}
    </tbody>
  </table>
);

export default BDM;
