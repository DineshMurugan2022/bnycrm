import React, { useState } from 'react';
import { Pencil, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from 'react-bootstrap';
import AddMemberDialog from '../components/AddMemberDialog'; // Import the AddMemberDialog

const Team = () => {
  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '(123) 456-7890', role: 'Sales Manager', status: 'active', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '(234) 567-8901', role: 'Sales Representative', status: 'active', avatar: 'JS' },
    { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', phone: '(345) 678-9012', role: 'Lead Generation', status: 'active', avatar: 'RJ' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', phone: '(456) 789-0123', role: 'Account Executive', status: 'inactive', avatar: 'ED' },
    { id: 5, name: 'Michael Wilson', email: 'michael.wilson@example.com', phone: '(567) 890-1234', role: 'Customer Success', status: 'active', avatar: 'MW' },
  ]);

  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);

  // Handle adding new member
  const handleAddMember = (newMemberData) => {
    const newMember = {
      ...newMemberData,
      id: members.length + 1, // Just a simple way to generate new id
      status: 'active',
      avatar: newMemberData.name.charAt(0), // Assuming avatar is the first letter of the name
    };
    setMembers([...members, newMember]);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Team Members</h2>
        <Button variant="primary" onClick={() => setShowAddMemberDialog(true)}>
          Add Member
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: 36, height: 36 }}
                    >
                      {member.avatar}
                    </div>
                    <span>{member.name}</span>
                  </div>
                </td>
                <td>
                  <div className="text-muted small">
                    <div>
                      <Mail size={14} className="me-1" /> {member.email}
                    </div>
                    <div>
                      <Phone size={14} className="me-1" /> {member.phone}
                    </div>
                  </div>
                </td>
                <td>{member.role}</td>
                <td>
                  <span className={`badge ${member.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {member.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-secondary me-2">
                    <Pencil size={16} />
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the AddMemberDialog component as a modal */}
      {showAddMemberDialog && (
        <AddMemberDialog
          onClose={() => setShowAddMemberDialog(false)}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
};

export default Team;
