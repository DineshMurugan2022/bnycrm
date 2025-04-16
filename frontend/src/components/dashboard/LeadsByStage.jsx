import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Card from 'react-bootstrap/Card';

const data = [
  { stage: 'New', value: 45, color: '#9b87f5' },
  { stage: 'Qualified', value: 32, color: '#7e69ab' },
  { stage: 'Proposal', value: 24, color: '#6e59a5' },
  { stage: 'Negotiation', value: 18, color: '#504785' },
  { stage: 'Closed Won', value: 12, color: '#4BB543' },
  { stage: 'Closed Lost', value: 8, color: '#FF3333' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { stage, value } = payload[0].payload;
    return (
      <div className="border rounded p-2 bg-white shadow-sm">
        <p className="fw-semibold mb-1">{stage}</p>
        <p className="text-muted small">{value} leads</p>
      </div>
    );
  }
  return null;
};

const LeadsByStage = () => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header>
        <Card.Title as="h6">Leads by Stage</Card.Title>
      </Card.Header>
      <Card.Body>
        <div style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeadsByStage;
