import React from 'react';
import Header from '../components/layout/Header'; // Adjust paths as needed
import AddContactDialog from '../components/AddContactDialog';
import { Search, Filter, MoreHorizontal, Mail, Phone } from 'lucide-react';

const contacts = [
  {
    id: '1',
    name: 'John Doe',
    initials: 'JD',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Inc',
    title: 'Marketing Director',
    tags: ['Customer', 'VIP'],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    initials: 'SJ',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    company: 'Tech Solutions',
    title: 'CEO',
    tags: ['Lead', 'Decision Maker'],
  },
  {
    id: '3',
    name: 'Michael Smith',
    initials: 'MS',
    email: 'msmith@example.com',
    phone: '(555) 456-7890',
    company: 'Global Services',
    title: 'Procurement Manager',
    tags: ['Prospect'],
  },
  {
    id: '4',
    name: 'Jessica Williams',
    initials: 'JW',
    email: 'jessica.w@example.com',
    phone: '(555) 789-0123',
    company: 'Design Studio',
    title: 'Creative Director',
    tags: ['Lead'],
  },
  {
    id: '5',
    name: 'David Brown',
    initials: 'DB',
    email: 'david.brown@example.com',
    phone: '(555) 234-5678',
    company: 'Brown Enterprises',
    title: 'Owner',
    tags: ['Customer'],
  },
];

const Contacts = () => {
  return (
    <div className="d-flex flex-column h-100">
      <Header title="Contacts" />

      <main className="flex-grow-1 overflow-auto p-4">
        {/* Top controls */}
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div className="position-relative w-100" style={{ maxWidth: '300px' }}>
            <Search className="position-absolute" style={{ top: '10px', left: '10px', width: '16px', height: '16px', color: '#6c757d' }} />
            <input
              type="search"
              className="form-control ps-5"
              placeholder="Search contacts..."
            />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm d-flex align-items-center">
              <Filter size={16} className="me-1" />
              Filter
            </button>
            <AddContactDialog />
          </div>
        </div>

        {/* Contact List Table */}
        <div className="table-responsive border rounded">
          <table className="table table-hover mb-0">
            <thead className="table-light text-muted small">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Company</th>
                <th scope="col" className="d-none d-md-table-cell">Email</th>
                <th scope="col" className="d-none d-md-table-cell">Phone</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                      <small>{contact.initials}</small>
                    </div>
                    <div>
                      <div className="fw-semibold">{contact.name}</div>
                      <div className="text-muted small">{contact.title}</div>
                    </div>
                  </td>
                  <td>{contact.company}</td>
                  <td className="d-none d-md-table-cell">
                    <Mail size={14} className="me-1 text-muted" />
                    {contact.email}
                  </td>
                  <td className="d-none d-md-table-cell">
                    <Phone size={14} className="me-1 text-muted" />
                    {contact.phone}
                  </td>
                  <td className="text-end">
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-light"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item">View</button></li>
                        <li><button className="dropdown-item">Edit</button></li>
                        <li><button className="dropdown-item text-danger">Delete</button></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
