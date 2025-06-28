import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TeamMembersCard from '../components/dashboard/TeamMembersCard';
import MiniReportCard from '../components/dashboard/MiniReportCard';
import { Users, Target, ClipboardList, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../user/UserContext';

const Index = () => {
  // State for BDM contacts and revenue
  const [bdmStats, setBdmStats] = useState({
    currentMonth: 0,
    previousMonth: 0,
    trend: 'up',
  });
  const [revenue, setRevenue] = useState(0);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState(0);
  const [revenueTrend, setRevenueTrend] = useState('up');
  const [totalContracts, setTotalContracts] = useState(0);
  const { users } = useUser();
  const activeUsers = users.filter(user => user.loginStatus === 'active').length;
  const totalUsers = users.length;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get('http://localhost:5000/api/appointments', config);
        const appointments = res.data;
        setTotalContracts(appointments.length);
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;
        let currentMonthCount = 0;
        let previousMonthCount = 0;
        let currentMonthRevenue = 0;
        let prevMonthRevenue = 0;
        appointments.forEach(app => {
          if (!app.date) return;
          const d = new Date(app.date);
          if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
            currentMonthCount++;
            if (app.signed && !app.clearancePending) {
              currentMonthRevenue += Number(app.contractValue) || 0;
            }
          }
          if (d.getMonth() === prevMonth && d.getFullYear() === prevYear) {
            previousMonthCount++;
            if (app.signed && !app.clearancePending) {
              prevMonthRevenue += Number(app.contractValue) || 0;
            }
          }
        });
        setBdmStats({
          currentMonth: currentMonthCount,
          previousMonth: previousMonthCount,
          trend: currentMonthCount >= previousMonthCount ? 'up' : 'down',
        });
        setRevenue(currentMonthRevenue);
        setPreviousMonthRevenue(prevMonthRevenue);
        setRevenueTrend(currentMonthRevenue >= prevMonthRevenue ? 'up' : 'down');
      } catch (err) {
        setBdmStats({ currentMonth: 0, previousMonth: 0, trend: 'up' });
        setRevenue(0);
        setPreviousMonthRevenue(0);
        setRevenueTrend('up');
        setTotalContracts(0);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="d-flex flex-column vh-100">
      <Header title="Dashboard" />

      <main className="flex-grow-1 overflow-auto p-4">
        <div className="row g-4">
          {/* Contracts StatCard */}
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              title="Contracts "
              value={bdmStats.currentMonth}
              icon={bdmStats.trend === 'up' ? <ArrowUpRight size={24} color="green" /> : <ArrowDownRight size={24} color="red" />}
              change={{
                value: Math.abs(bdmStats.currentMonth - bdmStats.previousMonth),
                trend: bdmStats.trend,
              }}
              subtitle={`Total: ${totalContracts}`}
            />
          </div>
          {/* Revenue StatCard */}
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              title="Revenue (BDM)"
              value={`₹${revenue.toLocaleString()}`}
              icon={revenueTrend === 'up' ? <ArrowUpRight size={24} color="green" /> : <ArrowDownRight size={24} color="red" />}
              change={{
                value: Math.abs(revenue - previousMonthRevenue),
                trend: revenueTrend,
              }}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <StatCard
              title="Active Users"
              value={activeUsers}
              icon={<Users size={24} />}
              subtitle={`Total: ${totalUsers}`}
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
