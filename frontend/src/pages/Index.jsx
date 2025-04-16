import React from 'react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import LeadsByStage from '../components/dashboard/LeadsByStage';
import TeamMembersCard from '../components/dashboard/TeamMembersCard';
import MiniReportCard from '../components/dashboard/MiniReportCard';
import { Users, Target, ClipboardList, DollarSign } from 'lucide-react';

const Index = () => {
  return (
    <div className="d-flex flex-column vh-100">
      <Header title="Dashboard" />

      <main className="flex-grow-1 overflow-auto p-4">
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              title="Total Contacts"
              value="1,234"
              icon={<Users size={24} />}
              change={{ value: 12, trend: 'up' }}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              title="Active Leads"
              value="86"
              icon={<Target size={24} />}
              change={{ value: 8, trend: 'up' }}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              title="Tasks Due"
              value="24"
              icon={<ClipboardList size={24} />}
              change={{ value: 5, trend: 'down' }}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              title="Revenue (MTD)"
              value="$38,200"
              icon={<DollarSign size={24} />}
              change={{ value: 18, trend: 'up' }}
            />
          </div>
        </div>

        <div className="row g-4 mt-3">
          <div className="col-md-6">
            <LeadsByStage />
          </div>
          <div className="col-md-6">
            <MiniReportCard />
          </div>
        </div>

        <div className="row g-4 mt-3">
          <div className="col-md-4">
            <TeamMembersCard />
          </div>
          <div className="col-md-8">
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
