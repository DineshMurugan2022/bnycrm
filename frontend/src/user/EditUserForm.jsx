import React, { useState } from "react";
import { useUser } from "../user/UserContext"; // Adjust the path if needed

const EditUserForm = ({ user, onClose }) => {
  const { updateUser } = useUser();

  const [formData, setFormData] = useState({
    username: user.username || "",
    password: "",
    userGroup: user.userGroup || "user",
    phone: user.phone || "",
    loginStatus: user.loginStatus || "active",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!/^\d{7,}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be at least 7 digits";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedData = {
      username: formData.username,
      userGroup: formData.userGroup,
      phone: formData.phone,
      loginStatus: formData.loginStatus,
    };

    if (formData.password) {
      updatedData.password = formData.password;
    }

    updateUser(user.id, updatedData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          name="username"
          className="form-control"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <div className="text-danger">{errors.username}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Password (leave empty to keep current)</label>
        <input
          type="password"
          name="password"
          className="form-control"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">User Group</label>
        <select
          name="userGroup"
          className="form-select"
          value={formData.userGroup}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="teamleader">Team Leader</option>
          <option value="bdm">BDM</option>
          <option value="user">Regular User</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          name="phone"
          className="form-control"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <div className="text-danger">{errors.phone}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Login Status</label>
        <select
          name="loginStatus"
          className="form-select"
          value={formData.loginStatus}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          💾 Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
