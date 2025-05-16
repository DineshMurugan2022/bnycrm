import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AddLeadDialog = ({ onClose }) => {
  const [formData, setFormData] = useState({
    file: null,
    campaignName: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div
        className="bg-white p-4 rounded shadow"
        style={{ width: "100%", maxWidth: "500px", position: "relative" }}
      >
        {/* Close Button */}
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={onClose}
        ></button>

        <h4 className="mb-4 text-center">Upload Leads</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Upload File</label>
            <input
              type="file"
              className="form-control"
              name="file"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Campaign Name</label>
            <select
              className="form-select"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Campaign 1">Campaign 1</option>
              <option value="Campaign 2">Campaign 2</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLeadDialog;
