import React from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../user/UserContext"; // adjust the path as needed

const AddUserForm = () => {
  const { addUser } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      userGroup: "user",
      phone: "",
      loginStatus: "active"
    }
  });

  const onSubmit = (data) => {
    addUser(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <div className="row mb-3">
        <div className="col-md-6 mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            {...register("username", { required: true, minLength: 3 })}
            placeholder="Enter username"
          />
          {errors.username && (
            <div className="invalid-feedback">Username must be at least 3 characters</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...register("password", { required: true, minLength: 6 })}
            placeholder="Enter password"
          />
          {errors.password && (
            <div className="invalid-feedback">Password must be at least 6 characters</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">User Group</label>
          <select
            className="form-select"
            {...register("userGroup", { required: true })}
          >
            <option value="admin">Admin</option>
            <option value="teamleader">Team Leader</option>
            <option value="bdm">BDM</option>
            <option value="user">Regular User</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            {...register("phone", { required: true, minLength: 7 })}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <div className="invalid-feedback">Phone number must be at least 7 digits</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Login Status</label>
          <select
            className="form-select"
            {...register("loginStatus", { required: true })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Add User
      </button>
    </form>
  );
};

export default AddUserForm;
