import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authorizationsAPI, patientsAPI } from '../services/api';
import { Users, FileCheck, Clock, CheckCircle, XCircle, Info, Plus, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAuthorizations: 0,
    pending: 0,
    approved: 0,
    denied: 0,
    notRequired: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const [patientsRes, authsRes] = await Promise.all([
        patientsAPI.getAll(),
        authorizationsAPI.getAll(),
      ]);

      const patients = patientsRes.data;
      const authorizations = authsRes.data;

      const statusCounts = authorizations.reduce(
        (acc, auth) => {
          const key = auth.status.toLowerCase().replace(/\s+/g, '');
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        { pending: 0, approved: 0, denied: 0, notrequired: 0 }
      );

      setStats({
        totalPatients: patients.length,
        totalAuthorizations: authorizations.length,
        pending: statusCounts.pending || 0,
        approved: statusCounts.approved || 0,
        denied: statusCounts.denied || 0,
        notRequired: statusCounts.notrequired || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <Activity className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your prior authorization system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          color="blue"
          link="/patients"
        />
        <StatCard
          title="Total Authorizations"
          value={stats.totalAuthorizations}
          icon={FileCheck}
          color="purple"
          link="/authorizations"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="yellow"
          link="/authorizations"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="green"
          link="/authorizations"
        />
        <StatCard
          title="Denied"
          value={stats.denied}
          icon={XCircle}
          color="red"
          link="/authorizations"
        />
        <StatCard
          title="Not Required"
          value={stats.notRequired}
          icon={Info}
          color="gray"
          link="/authorizations"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-600" />
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/patients"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Patient
          </Link>
          <Link
            to="/authorizations"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
          >
            <FileCheck className="w-5 h-5 mr-2" />
            Create Authorization
          </Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, link }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 border-blue-200 bg-blue-50',
    purple: 'from-purple-500 to-purple-600 border-purple-200 bg-purple-50',
    yellow: 'from-yellow-500 to-yellow-600 border-yellow-200 bg-yellow-50',
    green: 'from-green-500 to-green-600 border-green-200 bg-green-50',
    red: 'from-red-500 to-red-600 border-red-200 bg-red-50',
    gray: 'from-gray-500 to-gray-600 border-gray-200 bg-gray-50',
  };

  return (
    <Link to={link}>
      <div className={`${colorClasses[color]} border rounded-2xl p-6 hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-4xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;
