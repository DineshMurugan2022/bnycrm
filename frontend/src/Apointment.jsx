import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from './api/axios';

const Apointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments');
        setAppointments(res.data);
      } catch (err) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const totalAppointments = appointments.length;
  const metCount = appointments.filter(a => a.met).length;
  const notMetCount = totalAppointments - metCount;
  const signedCount = appointments.filter(a => a.signed).length;
  const totalValue = appointments.reduce((acc, a) => acc + (a.contractValue || 0), 0);

  return (
    <div className="container my-4">
      <h2> Telecaller Appointment list</h2>
      <div className="row mb-3">
        <div className="col-md-3"><div className="card text-white bg-primary p-3">Total: {totalAppointments}</div></div>
        <div className="col-md-3"><div className="card text-white bg-success p-3">Met: {metCount}</div></div>
        <div className="col-md-3"><div className="card text-white bg-danger p-3">Not Met: {notMetCount}</div></div>
        <div className="col-md-3"><div className="card text-white bg-info p-3">Signed: {signedCount}</div></div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Client</th>
              <th>Date</th>
              <th>Met</th>
              <th>Signed</th>
              <th>Contract Value</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app._id || app.id}>
                <td>{app.client}</td>
                <td>{app.date ? new Date(app.date).toLocaleDateString() : ''}</td>
                <td>{app.met ? '✅' : '❌'}</td>
                <td>{app.signed ? '✅' : '❌'}</td>
                <td>Rs{app.contractValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="card mb-4 p-3">
        <h5>Total Contract Value: Rs{totalValue.toLocaleString()}</h5>
      </div>
    </div>
  );
};

export default Apointment;
