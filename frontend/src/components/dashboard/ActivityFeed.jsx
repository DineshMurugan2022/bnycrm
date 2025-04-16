import React from 'react';
import { Card, ListGroup, Image, Badge } from 'react-bootstrap';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaStickyNote,
  FaClock,
  FaUserCircle
} from 'react-icons/fa';

const activities = [
  {
    id: '1',
    type: 'call',
    title: 'Call with John Doe',
    description: 'Discussed new proposal details',
    time: '2 hours ago',
    person: {
      name: 'John Doe',
      initials: 'JD',
    }
  },
  {
    id: '2',
    type: 'email',
    title: 'Email sent to Sarah',
    description: 'Sent project timeline documents',
    time: '3 hours ago',
    person: {
      name: 'Sarah Johnson',
      initials: 'SJ',
    }
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Product demo meeting',
    description: 'Scheduled for tomorrow at 3:00 PM',
    time: '5 hours ago',
  },
  {
    id: '4',
    type: 'task',
    title: 'Follow up with client',
    description: 'Send meeting notes and action items',
    time: 'Yesterday',
    completed: true,
  },
  {
    id: '5',
    type: 'note',
    title: 'New requirements',
    description: 'Added notes about feature requests',
    time: 'Yesterday',
  },
];

const getActivityIcon = (type) => {
  switch (type) {
    case 'call':
      return <FaPhoneAlt />;
    case 'email':
      return <FaEnvelope />;
    case 'meeting':
      return <FaCalendarAlt />;
    case 'task':
      return <FaCheckCircle />;
    case 'note':
      return <FaStickyNote />;
    default:
      return <FaClock />;
  }
};

const ActivityFeed = () => {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Recent Activity</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {activities.map((activity) => (
          <ListGroup.Item key={activity.id}>
            <div className="d-flex align-items-start gap-3">
              <div
                className="d-flex align-items-center justify-content-center bg-light rounded-circle"
                style={{ width: '36px', height: '36px' }}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <strong>{activity.title}</strong>
                  <small className="text-muted">{activity.time}</small>
                </div>
                <div className="text-muted small">{activity.description}</div>
                {activity.person && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <div style={{ fontSize: '20px' }}>
                      <FaUserCircle />
                    </div>
                    <span className="small">{activity.person.name}</span>
                  </div>
                )}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default ActivityFeed;
