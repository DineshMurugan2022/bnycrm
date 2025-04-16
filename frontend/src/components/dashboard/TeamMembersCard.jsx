import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

const teamMembers = [
  {
    id: '1',
    name: 'John Doe',
    initials: 'JD',
    role: 'Sales Manager',
    status: 'active',
    avatarUrl: '',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    initials: 'SJ',
    role: 'Sales Representative',
    status: 'active',
    avatarUrl: '',
  },
  {
    id: '3',
    name: 'Robert Wilson',
    initials: 'RW',
    role: 'Marketing Specialist',
    status: 'inactive',
    avatarUrl: '',
  },
];

const TeamMembersCard = () => {
  const navigate = useNavigate();

  const handleAddMember = () => {
    navigate('/team');
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Team Members</h6>
        <Button variant="outline-primary" size="sm" onClick={handleAddMember}>
          <UserPlus size={16} className="me-1" />
          Add Member
        </Button>
      </Card.Header>

      <Card.Body>
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-primary bg-primary bg-opacity-10 fw-bold"
                style={{ width: 40, height: 40 }}
              >
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="rounded-circle"
                    style={{ width: 40, height: 40, objectFit: 'cover' }}
                  />
                ) : (
                  member.initials
                )}
              </div>

              <div>
                <p className="mb-0 fw-medium">{member.name}</p>
                <small className="text-muted">{member.role}</small>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <span
                className={classNames('rounded-circle', {
                  'bg-success': member.status === 'active',
                  'bg-secondary': member.status !== 'active',
                })}
                style={{ width: 8, height: 8 }}
              />
              <small className="ms-2 text-muted">
                {member.status === 'active' ? 'Online' : 'Offline'}
              </small>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default TeamMembersCard;
