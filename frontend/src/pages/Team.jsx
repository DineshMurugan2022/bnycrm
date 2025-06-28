import React, { useState } from "react";
import { useUser } from "../user/UserContext";
import { Card, Tabs, Tab, Button } from "react-bootstrap";
import UserTable from "../user/Usertable";
import AddUserForm from "../user/AddUserForm";
import EditUserForm from "../user/EditUserForm";

const Team = () => {
  const { users, refreshUsers } = useUser(); // include a refresh if you update users after add/edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all-users");

  // Filter users based on their roles
  const teamLeaders = users.filter(user => user.userGroup === "teamleader");
  const bdms = users.filter(user => user.userGroup === "bdm");
  const telecallers = users.filter(user => user.userGroup === "user");

  // Handle edit user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setActiveTab("edit-user");
  };

  const handleAddUserClick = () => {
    setActiveTab("add-user");
  };

  const handleUserAdded = () => {
    refreshUsers?.();         // Refresh users if needed
    setActiveTab("all-users");
  };

  const handleUserUpdated = () => {
    refreshUsers?.();         // Refresh after edit
    setActiveTab("all-users");
    setSelectedUser(null);
  };

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-5 fw-bold">Users Dashboard</h1>
          <p className="text-muted">Manage users, assign roles, and control login access.</p>
        </div>
        <Button variant="primary" onClick={handleAddUserClick}>
          ➕ Add New User
        </Button>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted small">Total Users</Card.Title>
              <h4 className="fw-bold">{users.length}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted small">Team Leaders</Card.Title>
              <h4 className="fw-bold">{teamLeaders.length}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted small">BDMs</Card.Title>
              <h4 className="fw-bold">{bdms.length}</h4>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted small">Telecallers</Card.Title>
              <h4 className="fw-bold">{telecallers.length}</h4>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="user-tabs" className="mb-3">
        <Tab eventKey="all-users" title="All Users">
          <Card className="shadow-sm">
            <Card.Body>
              <UserTable users={users} onEdit={handleEdit} />
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="team-leaders" title="Team Leaders">
          <Card className="shadow-sm">
            <Card.Body>
              <UserTable users={teamLeaders} onEdit={handleEdit} />
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="bdms" title="BDMs">
          <Card className="shadow-sm">
            <Card.Body>
              <UserTable users={bdms} onEdit={handleEdit} />
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="telecallers" title="Telecallers">
          <Card className="shadow-sm">
            <Card.Body>
              <UserTable users={telecallers} onEdit={handleEdit} />
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="add-user" title="Add New User">
          <Card className="shadow-sm">
            <Card.Body>
              <AddUserForm onUserAdded={handleUserAdded} />
            </Card.Body>
          </Card>
        </Tab>

        {selectedUser && (
          <Tab eventKey="edit-user" title={`Edit: ${selectedUser.username}`}>
            <Card className="shadow-sm">
              <Card.Body>
                <EditUserForm user={selectedUser} onUserUpdated={handleUserUpdated} />
              </Card.Body>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

export default Team;
