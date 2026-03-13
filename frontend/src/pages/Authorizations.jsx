import { useEffect, useState } from 'react';
import { authorizationsAPI, patientsAPI, providersAPI } from '../services/api';
import { 
  FileCheck, Plus, Users, Calendar, Code, Filter, X, Eye, 
  Clock, CheckCircle, XCircle, Info, Phone, ExternalLink, 
  Loader2, AlertCircle, RefreshCw, Building2, Activity, FileText
} from 'lucide-react';

const Authorizations = () => {
  const [authorizations, setAuthorizations] = useState([]);
  const [filteredAuthorizations, setFilteredAuthorizations] = useState([]);
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patientId: '',
    cptCode: '',
    providerId: '',
    appointmentDate: '',
    priority: 'Routine',
    modality: '',
    orderingProvider: '',
    remarks: '',
  });
  const [filters, setFilters] = useState({
    status: '',
    payer: '',
    dateFrom: '',
    dateTo: '',
    patientId: '',
  });
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchProviders();
    fetchAuthorizations();
    
    // Poll for status updates every 3 seconds
    const interval = setInterval(() => {
      fetchAuthorizations();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [authorizations, filters]);

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await providersAPI.getAll();
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchAuthorizations = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.payer) params.payer = filters.payer;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.patientId) params.patientId = filters.patientId;

      const response = await authorizationsAPI.getAll(params);
      setAuthorizations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching authorizations:', error);
      setError('Failed to load authorizations');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...authorizations];

    if (filters.status) {
      filtered = filtered.filter((auth) => auth.status === filters.status);
    }
    if (filters.payer) {
      filtered = filtered.filter((auth) =>
        auth.payerName?.toLowerCase().includes(filters.payer.toLowerCase())
      );
    }
    if (filters.patientId) {
      filtered = filtered.filter((auth) => auth.patientId?._id === filters.patientId);
    }

    setFilteredAuthorizations(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await authorizationsAPI.create(formData);
      setFormData({
        patientId: '',
        cptCode: '',
        providerId: '',
        appointmentDate: '',
        priority: 'Routine',
        modality: '',
        orderingProvider: '',
        remarks: '',
      });
      // Force refresh by resetting loading and fetching
      setLoading(true);
      await fetchAuthorizations();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create authorization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      payer: '',
      dateFrom: '',
      dateTo: '',
      patientId: '',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { 
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock 
      },
      Approved: { 
        class: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle 
      },
      Denied: { 
        class: 'bg-red-100 text-red-800 border-red-200', 
        icon: XCircle 
      },
      'Not Required': { 
        class: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: Info 
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.class}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <FileCheck className="w-10 h-10 mr-3 text-purple-600" />
          Authorizations
        </h1>
        <p className="text-gray-600">Manage and track prior authorization requests</p>
      </div>

      {/* Create Authorization Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Plus className="w-6 h-6 mr-2 text-purple-600" />
          Create New Authorization
        </h2>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Patient *
            </label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} - {patient.memberId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Code className="w-4 h-4 mr-1" />
              CPT Code *
            </label>
            <select
              name="cptCode"
              value={formData.cptCode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Select CPT Code</option>
              <option value="70450">70450 - CT Head without contrast</option>
              <option value="70460">70460 - CT Head with contrast</option>
              <option value="70470">70470 - CT Neck</option>
              <option value="72141">72141 - MRI Brain without contrast</option>
              <option value="72146">72146 - MRI Brain with contrast</option>
              <option value="72156">72156 - MRI Cervical Spine without contrast</option>
              <option value="72157">72157 - MRI Cervical Spine with contrast</option>
              <option value="73721">73721 - MRI Lower Extremity</option>
              <option value="74150">74150 - CT Abdomen without contrast</option>
              <option value="74160">74160 - CT Abdomen with contrast</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select from common imaging procedures
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Provider
            </label>
            <select
              name="providerId"
              value={formData.providerId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Select a provider</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Appointment Date (Optional)
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900 cursor-pointer hover:border-purple-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="Routine">Routine</option>
              <option value="Urgent">Urgent</option>
              <option value="Stat">Stat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              Modality
            </label>
            <select
              name="modality"
              value={formData.modality}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">Select modality</option>
              <option value="CT">CT</option>
              <option value="MRI">MRI</option>
              <option value="X-ray">X-ray</option>
              <option value="Ultrasound">Ultrasound</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Ordering Provider
            </label>
            <input
              type="text"
              name="orderingProvider"
              value={formData.orderingProvider}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Dr. Smith, MD"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Remarks / Notes (Optional)
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Add any additional notes or remarks about this authorization request..."
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Authorization
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Filter className="w-6 h-6 mr-2 text-blue-600" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
              <option value="Not Required">Not Required</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payer
            </label>
            <input
              type="text"
              name="payer"
              value={filters.payer}
              onChange={handleFilterChange}
              placeholder="Search payer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              name="patientId"
              value={filters.patientId}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Patients</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 cursor-pointer hover:border-blue-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
            />
          </div>
        </div>
      </div>

      {/* Authorizations Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-purple-600" />
                Authorization Dashboard
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                Status updates automatically every 3 seconds • Showing {filteredAuthorizations.length} of {authorizations.length} authorizations
              </p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex items-center justify-center">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            Loading...
          </div>
        ) : filteredAuthorizations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileCheck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No authorizations found. {authorizations.length === 0 ? 'Create your first authorization above.' : 'Try adjusting your filters.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Procedure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payer / UM Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAuthorizations.map((auth) => (
                  <tr key={auth._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {auth.patientId?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {auth.patientId?.memberId || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {auth.cptCode}
                      </div>
                      <div className="text-xs text-gray-500">
                        {auth.procedureName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {auth.payerName}
                      </div>
                      {auth.umVendor && (
                        <div className="text-xs text-gray-500">
                          UM: {auth.umVendor}
                        </div>
                      )}
                      {auth.payerId?.portalLink && (
                        <a
                          href={auth.payerId.portalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Portal
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(auth.status)}
                    </td>
                    <td className="px-6 py-4">
                      {auth.callTimestamp ? (
                        <div className="text-sm text-gray-900">
                          <div>{formatDate(auth.callTimestamp)}</div>
                          {auth.callDuration > 0 && (
                            <div className="text-xs text-gray-500">
                              Duration: {auth.callDuration}s
                            </div>
                          )}
                      {auth.callRecordingLink && (
                        <a
                          href={auth.callRecordingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Recording
                        </a>
                      )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Pending call...</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(auth.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedAuth(auth)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Authorization Detail Modal */}
      {selectedAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FileCheck className="w-6 h-6 mr-2 text-purple-600" />
                  Authorization Details
                </h3>
                <button
                  onClick={() => setSelectedAuth(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient</label>
                  <p className="text-gray-900">{selectedAuth.patientId?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Member ID</label>
                  <p className="text-gray-900">{selectedAuth.patientId?.memberId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">CPT Code</label>
                  <p className="text-gray-900 font-mono">{selectedAuth.cptCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Procedure</label>
                  <p className="text-gray-900">{selectedAuth.procedureName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payer</label>
                  <p className="text-gray-900">{selectedAuth.payerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">UM Vendor</label>
                  <p className="text-gray-900">{selectedAuth.umVendor || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div>{getStatusBadge(selectedAuth.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <p className="text-gray-900">{selectedAuth.priority || 'Routine'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Modality</label>
                  <p className="text-gray-900">{selectedAuth.modality || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <p className="text-gray-900">{selectedAuth.providerId?.name || selectedAuth.orderingProvider || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IVR Phone</label>
                  <p className="text-gray-900">{selectedAuth.payerId?.ivrPhone || 'N/A'}</p>
                </div>
              </div>

              {selectedAuth.remarks && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    Remarks / Notes
                  </label>
                  <p className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                    {selectedAuth.remarks}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authorizations;
