import React, { useState } from 'react';
import { MoreHorizontal, Calendar, Filter } from 'lucide-react';
import AddLeadDialog from '../components/AddLeadDialog'; // Adjust the import path as necessary

const initialLeads = {
  'New': [
    { id: '1', name: 'Alex Johnson', initials: 'AJ', company: 'Johnson Enterprises', value: '₹12,500', stage: 'New', lastActivity: '2 days ago' },
    { id: '2', name: 'Maria Garcia', initials: 'MG', company: 'Bright Solutions', value: '₹8,750', stage: 'New', lastActivity: '3 days ago' },
  ],
  'Qualified': [
    { id: '3', name: 'Thomas Wright', initials: 'TW', company: 'Wright Industries', value: '₹24,000', stage: 'Qualified', lastActivity: '1 day ago' },
  ],
  'Proposal': [
    { id: '4', name: 'Emily Chen', initials: 'EC', company: 'Global Tech', value: '₹18,500', stage: 'Proposal', lastActivity: 'Today' },
    { id: '5', name: 'Daniel Smith', initials: 'DS', company: 'Smith & Co', value: '₹32,750', stage: 'Proposal', lastActivity: '4 days ago' },
  ],
  'Negotiation': [
    { id: '6', name: 'Sarah Miller', initials: 'SM', company: 'Miller Group', value: '₹45,000', stage: 'Negotiation', lastActivity: '2 days ago' },
  ],
  'Closed Won': [
    { id: '7', name: 'James Wilson', initials: 'JW', company: 'Wilson Solutions', value: '₹28,500', stage: 'Closed Won', lastActivity: '1 week ago' },
  ],
  'Closed Lost': [
    { id: '8', name: 'Robert Taylor', initials: 'RT', company: 'Taylor Technologies', value: '₹15,000', stage: 'Closed Lost', lastActivity: '2 weeks ago' },
  ],
};

const stageBadgeClasses = {
  'New': 'badge text-bg-primary',
  'Qualified': 'badge text-bg-info',
  'Proposal': 'badge text-bg-warning',
  'Negotiation': 'badge text-bg-secondary',
  'Closed Won': 'badge text-bg-success',
  'Closed Lost': 'badge text-bg-danger',
};

const LeadCard = ({ lead, onMoveClick }) => (
  <div className="card mb-3 shadow-sm">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center">
          <div className="bg-light text-primary fw-bold rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 36, height: 36 }}>
            {lead.initials}
          </div>
          <div>
            <h6 className="mb-0">{lead.name}</h6>
            <small className="text-muted">{lead.company}</small>
          </div>
        </div>
        <div className="dropdown">
          <button className="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
            <MoreHorizontal size={16} />
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><button className="dropdown-item">Edit</button></li>
            <li><button className="dropdown-item" onClick={() => onMoveClick(lead)}>Move Stage</button></li>
            <li><button className="dropdown-item text-danger">Delete</button></li>
          </ul>
        </div>
      </div>

      <div className="row text-muted small">
        <div className="col-6">{lead.value}</div>
        <div className="col-6 d-flex align-items-center">
          <Calendar size={14} className="me-1" />
          {lead.lastActivity}
        </div>
      </div>
    </div>
  </div>
);

const Leads = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const stages = Object.keys(leads);

  const handleAddLead = (newLead) => {
    setLeads(prev => ({
      ...prev,
      [newLead.stage]: [...prev[newLead.stage], newLead],
    }));
  };

  const moveLeadToStage = (leadId, currentStage, newStage) => {
    const leadToMove = leads[currentStage].find(l => l.id === leadId);
    if (!leadToMove) return;

    const updatedLeads = {
      ...leads,
      [currentStage]: leads[currentStage].filter(l => l.id !== leadId),
      [newStage]: [...leads[newStage], { ...leadToMove, stage: newStage }],
    };
    setLeads(updatedLeads);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center">
            <Filter size={16} className="me-1" />
            Filter
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowDialog(true)}>
            + Add Lead
          </button>
        </div>
      </div>

      <div className="row">
        {stages.map(stage => (
          <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4" key={stage}>
            <div className="mb-2">
              <span className={stageBadgeClasses[stage]}>{stage} ({leads[stage].length})</span>
            </div>
            {leads[stage].map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onMoveClick={(lead) => setSelectedLead(lead)}
              />
            ))}
          </div>
        ))}
      </div>

      <AddLeadDialog
        show={showDialog}
        onClose={() => setShowDialog(false)}
        onAddLead={handleAddLead}
      />
    </div>
  );
};

export default Leads;
