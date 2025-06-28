import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useUser } from '../../user/UserContext';

const TeamMembersCard = () => {
  const navigate = useNavigate();
  const { users } = useUser();

  const handleAddMember = () => {
    navigate('/team');
  };

  // Get recently added team members (last 5, sorted by creation date)
  const getRecentlyAddedMembers = () => {
    if (!users || users.length === 0) return [];

    // Filter out admin users and sort by createdAt (newest first)
    const teamMembers = users
      .filter(user => user.userGroup !== 'admin')
      .sort((a, b) => {
        // Use _id timestamp if createdAt is not available (fallback for existing users)
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a._id.toString().substring(0, 8) * 1000);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b._id.toString().substring(0, 8) * 1000);
        return dateB - dateA;
      })
      .slice(0, 5); // Get only the 5 most recent

    return teamMembers.map(user => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : new Date(user._id.toString().substring(0, 8) * 1000);
      const isNew = (Date.now() - createdAt.getTime()) < (7 * 24 * 60 * 60 * 1000); // 7 days

      return {
        id: user.id || user._id,
        name: user.username,
        initials: user.username.substring(0, 2).toUpperCase(),
        role: user.userGroup === 'teamleader' ? 'Team Leader' : 
              user.userGroup === 'bdm' ? 'BDM' : 
              user.userGroup === 'user' ? 'Telecaller' : user.userGroup,
        status: user.loginStatus || 'active',
        avatarUrl: '',
        createdAt: createdAt,
        isNew: isNew
      };
    });
  };

  const recentMembers = getRecentlyAddedMembers();
  const totalTeamMembers = users ? users.filter(user => user.userGroup !== 'admin').length : 0;

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">Recently Added Team Members</h6>
          <small className="text-muted">{totalTeamMembers} total members</small>
        </div>
        <Button variant="outline-primary" size="sm" onClick={handleAddMember}>
          <UserPlus size={16} className="me-1" />
          Add Member
        </Button>
      </Card.Header>

      <Card.Body>
        {recentMembers.length > 0 ? (
          recentMembers.map((member) => (
            <div
              key={member.id}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-primary bg-primary bg-opacity-10 fw-bold position-relative"
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
                  {member.isNew && (
                    <Badge 
                      bg="success" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.6rem', transform: 'translate(-50%, -50%)' }}
                    >
                      NEW
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="d-flex align-items-center gap-2">
                    <p className="mb-0 fw-medium">{member.name}</p>
                    {member.isNew && (
                      <Badge bg="success" className="fs-6">New</Badge>
                    )}
                  </div>
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
          ))
        ) : (
          <div className="text-center text-muted py-3">
            <p className="mb-0">No team members found</p>
            <small>Add your first team member to get started</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TeamMembersCard;
