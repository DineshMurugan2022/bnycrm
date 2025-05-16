import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AddLeadDialog from "../components/AddLeadDialog";
import { Button } from "react-bootstrap"; // Bootstrap button

const Lead = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    dispositionName: "",
    cdrDisposition: "",
    uploadDateFrom: "",
    uploadDateTo: "",
  });

  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false); // <-- You missed this state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDialogClose = () => {
    setShowAddMemberDialog(false);
  };

  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light position-relative">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Lead Creation</h4>
        <Button variant="primary" onClick={() => setShowAddMemberDialog(true)}>
          Upload Leads
        </Button>
      </div>

      {/* FORM CONTENT */}
      <div className="row mb-3">
        <div className="col-md-6">
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

        <div className="col-md-6">
          <label className="form-label">Disposition Name</label>
          <select
            className="form-select"
            name="dispositionName"
            value={formData.dispositionName}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="RNR">RNR</option>
            <option value="callback">Callback</option>
            <option value="sale">Sale</option>
            <option value="not interested">Not Interested</option>
            <option value="follow ups">Follow Up's</option>
            <option value="DND">DND</option>
            <option value="appointment">Appointment</option>
            <option value="sale done">Sale Done</option>
            <option value="wrong number">Wrong Number</option>
            <option value="not reachable">Not Reachable</option>
            <option value="already signed">Already Signed</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Cdr Dispositions</label>
        <select
          className="form-select"
          name="cdrDisposition"
          value={formData.cdrDisposition}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Answered">Answered</option>
          <option value="No answer">No answer</option>
          <option value="MOH">MOH</option>
          <option value="BUSY">BUSY</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Date</label>
        <div className="d-flex gap-2">
          <input
            type="date"
            className="form-control"
            name="uploadDateFrom"
            value={formData.uploadDateFrom}
            onChange={handleChange}
          />
          <span className="align-self-center">-</span>
          <input
            type="date"
            className="form-control"
            name="uploadDateTo"
            value={formData.uploadDateTo}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Show Modal */}
      {showAddMemberDialog && (
        <AddLeadDialog onClose={handleDialogClose} />
      )}
    </div>
  );
};

export default Lead;
