import React, { useState } from 'react';
import { format } from 'date-fns';
import Header from '../components/layout/Header'; // adjust the path as needed
import AddEventDialog from '../components/AddEventDialog'; // adjust the path as needed

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [events] = useState([
    { id: 1, title: 'Client Meeting', date: new Date(2025, 3, 15), time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Follow up with Lead', date: new Date(2025, 3, 16), time: '2:00 PM', type: 'task' },
    { id: 3, title: 'Product Demo', date: new Date(2025, 3, 18), time: '11:30 AM', type: 'demo' },
    { id: 4, title: 'Team Sync', date: new Date(2025, 3, 19), time: '9:00 AM', type: 'meeting' },
    { id: 5, title: 'Contract Review', date: new Date(2025, 3, 22), time: '3:00 PM', type: 'task' },
  ]);

  const filteredEvents = date
    ? events.filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
      )
    : [];

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  return (
    <div className="d-flex flex-column h-100">
      <Header title="Calendar" />

      <main className="flex-grow-1 overflow-auto p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5">
            {date ? format(date, 'MMMM yyyy') : 'Calendar'}
          </h2>
          <AddEventDialog />
        </div>

        <div className="row g-4">
          {/* Date Picker */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Select Date</h5>
              </div>
              <div className="card-body">
                <input
                  type="date"
                  className="form-control"
                  value={date.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>

          {/* Events Display */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  {date ? `Events for ${format(date, 'MMMM d, yyyy')}` : 'Select a date to view events'}
                </h5>
              </div>
              <div className="card-body">
                {filteredEvents.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="d-flex align-items-center border p-3 rounded">
                        <div
                          className="me-3 rounded"
                          style={{
                            width: '8px',
                            height: '48px',
                            backgroundColor:
                              event.type === 'meeting'
                                ? '#0d6efd'
                                : event.type === 'task'
                                ? '#198754'
                                : '#fd7e14',
                          }}
                        ></div>
                        <div>
                          <h6 className="mb-1">{event.title}</h6>
                          <small className="text-muted">{event.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-4">
                    No events scheduled for this date
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
