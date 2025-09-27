import { useState, useEffect } from 'react';
import { exchangeAPI } from '../services/api';
import { toast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Plus, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  TestTube,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [testingConnection, setTestingConnection] = useState({});
  const [deletingAccount, setDeletingAccount] = useState({});

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const response = await exchangeAPI.getExchangeAccounts();
      setExchanges(response.data.account);
    } catch (error) {
      toast.error('Failed to load exchange accounts');
      console.error('Exchanges error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (accountId) => {
    setTestingConnection(prev => ({ ...prev, [accountId]: true }));
    
    try {
      const response = await exchangeAPI.testAccountConnection(accountId);
      if (response.data.success) {
        toast.success('Connection test successful!');
        fetchExchanges(); // Refresh to update last verified timestamp
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Connection test failed');
    } finally {
      setTestingConnection(prev => ({ ...prev, [accountId]: false }));
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm('Are you sure you want to delete this exchange account?')) {
      return;
    }

    setDeletingAccount(prev => ({ ...prev, [accountId]: true }));
    
    try {
      await exchangeAPI.deleteExchangeAccount(accountId);
      toast.success('Exchange account deleted successfully');
      fetchExchanges();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeletingAccount(prev => ({ ...prev, [accountId]: false }));
    }
  };

  const AddExchangeForm = () => {
    const [formData, setFormData] = useState({
      exchange: 'binance',
      label: '',
      apiKey: '',
      apiSecret: '',
      testnet: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [showApiSecret, setShowApiSecret] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const response = await exchangeAPI.addExchangeAccount(formData);
        toast.success('Exchange account added successfully!');
        setShowAddForm(false);
        fetchExchanges();
        setFormData({
          exchange: 'binance',
          label: '',
          apiKey: '',
          apiSecret: '',
          testnet: false
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to add exchange account');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Exchange Account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exchange
              </label>
              <select
                name="exchange"
                value={formData.exchange}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="binance">Binance</option>
                <option value="delta">Delta Exchange</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Label
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Main Account"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                className="input-field pr-10"
                placeholder="Enter your API key"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Secret
            </label>
            <div className="relative">
              <input
                type={showApiSecret ? 'text' : 'password'}
                name="apiSecret"
                value={formData.apiSecret}
                onChange={handleChange}
                className="input-field pr-10"
                placeholder="Enter your API secret"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowApiSecret(!showApiSecret)}
              >
                {showApiSecret ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="testnet"
              id="testnet"
              checked={formData.testnet}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="testnet" className="ml-2 text-sm text-gray-700">
              Use testnet/sandbox environment
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                'Add Account'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Exchange Accounts</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Exchange
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && <AddExchangeForm />}

      {/* Exchange List */}
      {exchanges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchanges.map((account) => (
            <div key={account._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{account.label}</h3>
                    <p className="text-sm text-gray-500 capitalize">{account.exchange}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {account.testnet && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Testnet
                    </span>
                  )}
                  {account.isActive ? (
                    <CheckCircle className="w-5 h-5 text-success-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-danger-500" />
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {account.permissions?.spot && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Spot Trading
                    </span>
                  )}
                  {account.permissions?.future && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Futures
                    </span>
                  )}
                  {account.permissions?.margin && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Margin
                    </span>
                  )}
                </div>
              </div>

              {/* Last Verified */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Last verified: {account.lastVerified 
                    ? new Date(account.lastVerified).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleTestConnection(account._id)}
                  disabled={testingConnection[account._id]}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  {testingConnection[account._id] ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Test Connection
                </button>
                
                <button
                  onClick={() => handleDeleteAccount(account._id)}
                  disabled={deletingAccount[account._id]}
                  className="flex items-center text-sm text-danger-600 hover:text-danger-700"
                >
                  {deletingAccount[account._id] ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exchange accounts</h3>
          <p className="text-gray-500 mb-4">Add your first exchange account to start trading</p>
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Exchange Account
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Security Notice</h4>
            <p className="text-sm text-blue-700">
              Your API keys are encrypted and stored securely. We recommend using API keys with limited permissions 
              (spot trading only) and enabling IP restrictions on your exchange account for added security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchanges;