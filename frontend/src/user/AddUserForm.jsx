import React from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../user/UserContext";

const AddUserForm = () => {
  const { addUser } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      userGroup: "user",
      phone: "",
      loginStatus: "active",
      longitude: "",
      latitude: ""
    }
  });

  const selectedUserGroup = watch("userGroup");

  const onSubmit = async (data) => {
    try {
      await addUser(data);
      alert("User added successfully.");
      reset();
    } catch (error) {
      alert("Failed to add user: " + error.message);
      console.error("Add user failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <div className="row mb-3">
        {/* Username */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Minimum 3 characters" }
            })}
            placeholder="Enter username"
            disabled={isSubmitting}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username.message}</div>
          )}
        </div>

        {/* Password */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" }
            })}
            placeholder="Enter password"
            disabled={isSubmitting}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        {/* User Group */}
        <div className="col-md-6 mb-3">
          <label className="form-label">User Group</label>
          <select
            className="form-select"
            {...register("userGroup", { required: "User group is required" })}
            disabled={isSubmitting}
          >
            <option value="admin">Admin</option>
            <option value="teamleader">Team Leader</option>
            <option value="bdm">BDM</option>
            <option value="user">Telecallers</option>
          </select>
        </div>

        {/* Phone */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            {...register("phone", {
              required: "Phone number is required",
              minLength: { value: 7, message: "Minimum 7 digits" }
            })}
            placeholder="Enter phone number"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone.message}</div>
          )}
        </div>

        {/* Login Status */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Login Status</label>
          <select
            className="form-select"
            {...register("loginStatus", {
              required: "Login status is required"
            })}
            disabled={isSubmitting}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Conditional Longitude and Latitude for BDM */}
        {selectedUserGroup === "bdm" && (
          <>
            <div className="col-md-6 mb-3">
              <label className="form-label">Longitude</label>
              <input
                type="text"
                className={`form-control ${errors.longitude ? "is-invalid" : ""}`}
                {...register("longitude", {
                  required: "Longitude is required for BDM"
                })}
                placeholder="Enter longitude"
                disabled={isSubmitting}
              />
              {errors.longitude && (
                <div className="invalid-feedback">{errors.longitude.message}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Latitude</label>
              <input
                type="text"
                className={`form-control ${errors.latitude ? "is-invalid" : ""}`}
                {...register("latitude", {
                  required: "Latitude is required for BDM"
                })}
                placeholder="Enter latitude"
                disabled={isSubmitting}
              />
              {errors.latitude && (
                <div className="invalid-feedback">{errors.latitude.message}</div>
              )}
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add User"}
      </button>
    </form>
  );
};

export default AddUserForm;
