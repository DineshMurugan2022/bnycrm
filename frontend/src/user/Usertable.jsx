import React, { useState } from "react";
import { useUser } from "../user/UserContext"; // adjust the path if needed
import EditUserForm from "./EditUserForm"; // ✅ Correct
// create or convert separately
import { Modal, Button, Table, Badge } from "react-bootstrap";

const UserTable = ({ users }) => {
  const { deleteUser, currentUser } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      setShowDeleteModal(false);
    }
  };

  const getStatusVariant = (status) => {
    return status === "active" ? "success" : "secondary";
  };

  const getRoleVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "teamleader":
        return "primary";
      case "bdm":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded border p-3">
      {users.length > 0 ? (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>User Group</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>
                  <Badge bg={getRoleVariant(user.userGroup)}>{user.userGroup}</Badge>
                </td>
                <td>{user.phone}</td>
                <td>
                  <Badge bg={getStatusVariant(user.loginStatus)}>{user.loginStatus}</Badge>
                </td>
                <td className="text-end">
                  <Button
                    variant="outline-primary "
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(user)}
                  
                  >
                    <i className="bi bi-pencil">Edit</i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(user)}
                    disabled={user.id === currentUser?.id}
                  >
                    <i className="bi bi-trash"> Delete</i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center p-4 text-muted">No users found.</div>
      )}

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <EditUserForm user={selectedUser} onClose={() => setShowEditModal(false)} />
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedUser?.username}</strong>? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTable;
