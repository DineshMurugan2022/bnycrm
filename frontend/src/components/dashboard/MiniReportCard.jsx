import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const data = [
  { name: 'Jan', sales: 400 },
  { name: 'Feb', sales: 300 },
  { name: 'Mar', sales: 200 },
  { name: 'Apr', sales: 280 },
  { name: 'May', sales: 190 },
  { name: 'Jun', sales: 390 },
];

const MiniReportCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Sales Overview</h6>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={() => navigate('/reports')}
          className="d-flex align-items-center gap-1"
        >
          <ExternalLink size={16} />
          View Reports
        </Button>
      </Card.Header>
      <Card.Body style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#9b87f5" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default MiniReportCard;
