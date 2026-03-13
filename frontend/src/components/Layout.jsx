import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileCheck, Shield, Building2 } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">Prior Auth</h1>
                <p className="text-xs text-blue-100">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/dashboard') || isActive('/')
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 mr-3 ${isActive('/dashboard') || isActive('/') ? '' : 'text-gray-400'}`} />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <Link
              to="/patients"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/patients')
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <Users className={`w-5 h-5 mr-3 ${isActive('/patients') ? '' : 'text-gray-400'}`} />
              <span className="font-medium">Patients</span>
            </Link>
            
            <Link
              to="/authorizations"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/authorizations')
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <FileCheck className={`w-5 h-5 mr-3 ${isActive('/authorizations') ? '' : 'text-gray-400'}`} />
              <span className="font-medium">Authorizations</span>
            </Link>
            
            <Link
              to="/providers"
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive('/providers')
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <Building2 className={`w-5 h-5 mr-3 ${isActive('/providers') ? '' : 'text-gray-400'}`} />
              <span className="font-medium">Payers</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p className="font-medium text-gray-700">Admin Access</p>
              <p className="mt-1">Imaging Center System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
