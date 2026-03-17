import { useEffect, useState } from 'react';
import { patientsAPI, authorizationsAPI, providersAPI } from '../services/api';
import { Users, Plus, UserPlus, Phone, Calendar, FileText, AlertCircle, Loader2, Building2, Eye, X, FileCheck, Clock, CheckCircle, XCircle, Info } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    providerId: '',
    memberId: '',
    medicalHistory: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientAuthorizations, setPatientAuthorizations] = useState([]);
  const [loadingAuths, setLoadingAuths] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchProviders();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to load patients');
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await patientsAPI.create(formData);
      setFormData({
        name: '',
        dob: '',
        providerId: '',
        memberId: '',
        medicalHistory: '',
      });
      fetchPatients();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create patient');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewAuthorizations = async (patient) => {
    setSelectedPatient(patient);
    setLoadingAuths(true);
    try {
      const response = await authorizationsAPI.getAll({ patientId: patient._id });
      setPatientAuthorizations(response.data);
    } catch (error) {
      console.error('Error fetching authorizations:', error);
    } finally {
      setLoadingAuths(false);
    }
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
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.class}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <Users className="w-10 h-10 mr-3 text-blue-600" />
          Patients
        </h1>
        <p className="text-gray-600">Manage patient records and demographics</p>
      </div>

      {/* Create Patient Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <UserPlus className="w-6 h-6 mr-2 text-blue-600" />
          Add New Patient
        </h2>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Date of Birth *
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 cursor-pointer hover:border-blue-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              Insurance Provider (Payer) *
            </label>
            <select
              name="providerId"
              value={formData.providerId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select insurance provider</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Member ID *
            </label>
            <input
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="ABC123456789"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Medical History (Optional)
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Previous conditions, allergies, etc."
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Patient
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            All Patients
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex items-center justify-center">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            Loading...
          </div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No patients found. Create your first patient above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Insurance Provider
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    UM Vendor
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Member ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {patient.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(patient.dob)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.providerId?.name || 'N/A'}</div>
                      {patient.payerId && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {patient.payerId.ivrPhone}
                        </div>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.payerId?.umVendor || 'N/A'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {patient.memberId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(patient.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewAuthorizations(patient)}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Auths
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Authorizations Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FileCheck className="w-6 h-6 mr-2 text-blue-600" />
                    Authorizations for {selectedPatient.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Member ID: {selectedPatient.memberId} • {selectedPatient.providerId?.name || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    setPatientAuthorizations([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {loadingAuths ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 mr-2 animate-spin text-blue-600" />
                  <span className="text-gray-600">Loading authorizations...</span>
                </div>
              ) : patientAuthorizations.length === 0 ? (
                <div className="text-center py-8">
                  <FileCheck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">No authorizations found for this patient.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientAuthorizations.map((auth) => (
                    <div
                      key={auth._id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-lg font-semibold text-gray-900">
                              {auth.cptCode}
                            </span>
                            {getStatusBadge(auth.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {auth.procedureName || 'Procedure'}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Payer:</span>{' '}
                              <span className="font-medium">{auth.payerName}</span>
                            </div>
                            {/* {auth.umVendor && (
                              <div>
                                <span className="text-gray-500">UM Vendor:</span>{' '}
                                <span className="font-medium">{auth.umVendor}</span>
                              </div>
                            )} */}
                            <div>
                              <span className="text-gray-500">Created:</span>{' '}
                              <span className="font-medium">{formatDate(auth.createdAt)}</span>
                            </div>
                            {auth.callTimestamp && (
                              <div>
                                <span className="text-gray-500">Call Date:</span>{' '}
                                <span className="font-medium">{formatDate(auth.callTimestamp)}</span>
                              </div>
                            )}
                          </div>
                          {auth.remarks && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Remarks:</p>
                              <p className="text-sm text-gray-700">{auth.remarks}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
