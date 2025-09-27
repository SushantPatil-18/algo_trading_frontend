import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { settingsAPI } from '../services/api';
import { toast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Mail, Bell, Shield, User, Send } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    emailNotifications: user?.emailNotifications || false,
  });

  const handleEmailSettingsUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await settingsAPI.updateEmailSettings(emailSettings);
      updateUser(response.data.user);
      toast.success('Email settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTesting(true);

    try {
      await settingsAPI.testEmail();
      toast.success('Test email sent successfully! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send test email');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account preferences and notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <div className="card">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  className="input-field bg-gray-50"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="input-field bg-gray-50"
                  disabled
                />
              </div>
              
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-success-500 mr-2" />
                <span className="text-sm text-gray-600">
                  Account created on {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
            </div>
            
            <form onSubmit={handleEmailSettingsUpdate} className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={emailSettings.emailNotifications}
                    onChange={(e) => setEmailSettings(prev => ({
                      ...prev,
                      emailNotifications: e.target.checked
                    }))}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                    Enable email notifications
                  </label>
                  <p className="text-sm text-gray-500">
                    Receive notifications about bot status changes, trade executions, and daily summaries
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={isTesting}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    {isTesting ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Test Email
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn-primary"
                  >
                    {isUpdating ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Mail className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Email Status</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Notifications</span>
                <span className={`text-sm font-medium ${user?.emailNotifications ? 'text-success-600' : 'text-gray-400'}`}>
                  {user?.emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Verified</span>
                <span className={`text-sm font-medium ${user?.isEmailVerified ? 'text-success-600' : 'text-yellow-600'}`}>
                  {user?.isEmailVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Security Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Keep your exchange API keys secure</li>
                  <li>• Enable IP restrictions on exchanges</li>
                  <li>• Monitor your bots regularly</li>
                  <li>• Use testnet for strategy testing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Check our documentation or contact support for assistance.
            </p>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;