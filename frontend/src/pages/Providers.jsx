import { useEffect, useState } from 'react';
import { providersAPI } from '../services/api';
import { Building2, Plus, AlertCircle, Loader2 } from 'lucide-react';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await providersAPI.getAll();
      setProviders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payers:', error);
      setError('Failed to load payers');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await providersAPI.create(formData);
      setFormData({
        name: '',
      });
      fetchProviders();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create payer');
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <Building2 className="w-10 h-10 mr-3 text-purple-600" />
          Payers
        </h1>
        <p className="text-gray-600">Manage insurance companies and payers</p>
      </div>

      {/* Create Payer Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Plus className="w-6 h-6 mr-2 text-purple-600" />
          Create New Payer
        </h2>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              Payer Name (Insurance Company) *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g., Blue Cross Blue Shield, UnitedHealthcare, Aetna"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Payer
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Payers List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-purple-600" />
            Payers List
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {providers.length} payer{providers.length !== 1 ? 's' : ''}
          </p>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex items-center justify-center">
            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            Loading...
          </div>
        ) : providers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No payers found. Create your first payer above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {providers.map((provider) => (
                  <tr key={provider._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {provider.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono">
                        {provider._id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(provider.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Providers;
