import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Table, ButtonGroup } from "react-bootstrap";
import LeadForm from "./LeadForm";
import api from '../api/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LeadFormView } from './LeadForm';

const Lead = () => {
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLead, setEditLead] = useState(null);
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleShow = () => setShowForm(true);
  const handleClose = () => {
    setShowForm(false);
    setEditLead(null);
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      alert('Failed to fetch leads: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      alert('Failed to delete lead: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (lead) => {
    setEditLead(lead);
    setShowForm(true);
  };

  const pdfRef = React.useRef();
  const [pdfLead, setPdfLead] = useState(null);

  const handleDownload = async (lead) => {
    setPdfLead(lead);
    setDownloading(true);
    setTimeout(async () => {
      const input = pdfRef.current;
      if (!input) { setDownloading(false); setPdfLead(null); return; }
      await new Promise(res => setTimeout(res, 200)); // ensure DOM is painted
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${lead.companyName || 'lead'}-full-form.pdf`);
      setPdfLead(null);
      setDownloading(false);
    }, 300);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="container mt-5 p-4 border rounded shadow-sm bg-light position-relative">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Lead Creation</h4>
        <Button variant="primary" onClick={handleShow}>
          Upload The Form
        </Button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Company Name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      <Modal show={showForm} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{editLead ? 'Edit Lead' : 'Create New Lead'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LeadForm onFormSubmit={handleClose} onLeadSaved={fetchLeads} lead={editLead} />
        </Modal.Body>
      </Modal>

      <h5 className="mt-4">Saved Leads</h5>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Phone Number</th>
              <th>Website</th>
              <th>SEO</th>
              <th>Total Amount</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads
              .filter(lead =>
                lead.companyName && lead.companyName.toLowerCase().includes(search.toLowerCase())
              )
              .map(lead => (
                <tr key={lead._id}>
                  <td>{lead.companyName}</td>
                  <td>{lead.contactPerson}</td>
                  <td>{lead.contactNo}</td>
                  <td>{lead.websiteSubscription}</td>
                  <td>{lead.seo}</td>
                  <td>{lead.actualAmount}</td>
                  <td>{lead.amountReceived}</td>
                  <td>{lead.balanceAmount}</td>
                  <td>
                    <ButtonGroup>
                      <Button size="sm" variant="success" onClick={() => handleDownload(lead)}>Download</Button>
                      <Button size="sm" variant="warning" onClick={() => handleEdit(lead)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(lead._id)}>Delete</Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {/* Hidden full form for PDF generation */}
      {pdfLead && (
        <div style={{ position: 'fixed', left: '-999px', top: 0, zIndex: -2 }}>
          <LeadFormView ref={pdfRef} formData={pdfLead} />
        </div>
      )}
      {downloading && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(255,255,255,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="alert alert-info">Generating PDF, please wait...</div>
        </div>
      )}
    </div>
  );
};

export default Lead;
