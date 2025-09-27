import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { botsAPI, dashboardAPI } from '../services/api';
import { toast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  Edit3, 
  Trash2,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle
} from 'lucide-react';

const BotDetails = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (botId) {
      fetchBotDetails();
      fetchBotAnalytics();
    }
  }, [botId]);

  const fetchBotDetails = async () => {
    try {
      const response = await botsAPI.getBotDetails(botId);
      setBot(response.data.bot);
    } catch (error) {
      toast.error('Failed to load bot details');
      console.error('Bot details error:', error);
    }
  };

  const fetchBotAnalytics = async () => {
    try {
      const response = await dashboardAPI.getBotAnalytics(botId);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBotAction = async (action) => {
    setActionLoading(true);
    
    try {
      let response;
      switch (action) {
        case 'start':
          response = await botsAPI.startBot(botId);
          break;
        case 'stop':
          response = await botsAPI.stopBot(botId);
          break;
        case 'pause':
          response = await botsAPI.pauseBot(botId);
          break;
        case 'resume':
          response = await botsAPI.resumeBot(botId);
          break;
        default:
          throw new Error('Invalid action');
      }

      toast.success(response.data.message);
      fetchBotDetails(); // Refresh bot details
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} bot`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!window.confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      return;
    }

    try {
      await botsAPI.deleteBot(botId);
      toast.success('Bot deleted successfully');
      navigate('/bots');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete bot');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bot not found</h3>
        <button onClick={() => navigate('/bots')} className="btn-primary">
          Back to Bots
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      running: 'text-success-600 bg-success-100',
      paused: 'text-yellow-600 bg-yellow-100',
      stopped: 'text-gray-600 bg-gray-100',
      error: 'text-danger-600 bg-danger-100',
    };
    return colors[status] || colors.stopped;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/bots')}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
            <p className="text-gray-600">{bot.symbol} • {bot.strategyId?.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Action buttons */}
          {bot.status === 'stopped' && (
            <button
              onClick={() => handleBotAction('start')}
              disabled={actionLoading}
              className="btn-success"
            >
              {actionLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              Start
            </button>
          )}
          
          {bot.status === 'running' && (
            <>
              <button
                onClick={() => handleBotAction('pause')}
                disabled={actionLoading}
                className="btn-secondary"
              >
                {actionLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                Pause
              </button>
              <button
                onClick={() => handleBotAction('stop')}
                disabled={actionLoading}
                className="btn-secondary"
              >
                {actionLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Square className="w-4 h-4 mr-2" />}
                Stop
              </button>
            </>
          )}
          
          {bot.status === 'paused' && (
            <>
              <button
                onClick={() => handleBotAction('resume')}
                disabled={actionLoading}
                className="btn-success"
              >
                {actionLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Resume
              </button>
              <button
                onClick={() => handleBotAction('stop')}
                disabled={actionLoading}
                className="btn-secondary"
              >
                {actionLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Square className="w-4 h-4 mr-2" />}
                Stop
              </button>
            </>
          )}
          
          {bot.status === 'error' && (
            <button
              onClick={() => handleBotAction('start')}
              disabled={actionLoading}
              className="btn-success"
            >
              {actionLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              Restart
            </button>
          )}

          <button className="btn-secondary">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </button>
          
          <button 
            onClick={handleDeleteBot}
            className="btn-danger"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Status and Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(bot.status)}`}>
                {bot.status}
              </span>
            </div>
          </div>
          {bot.errorMessage && (
            <p className="text-sm text-danger-600 mt-2">{bot.errorMessage}</p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 text-success-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className={`text-lg font-semibold ${bot.performance.totalPnl >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                ${bot.performance.totalPnl >= 0 ? '+' : ''}{bot.performance.totalPnl.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Activity className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Trades</p>
              <p className="text-lg font-semibold text-gray-900">{bot.performance.totalTrades}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {bot.performance.totalTrades > 0 
                  ? ((bot.performance.winningTrades / bot.performance.totalTrades) * 100).toFixed(1)
                  : 0
                }%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Strategy</span>
              <span className="text-sm font-medium text-gray-900">{bot.strategyId?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Symbol</span>
              <span className="text-sm font-medium text-gray-900">{bot.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Exchange</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {bot.exchangeAccountId?.exchange} - {bot.exchangeAccountId?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Allocation</span>
              <span className="text-sm font-medium text-gray-900">
                {bot.allocation.amount} {bot.allocation.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Risk Level</span>
              <span className="text-sm font-medium text-yellow-600 capitalize">
                {bot.strategyId?.riskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Details */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Winning Trades</span>
              <span className="text-sm font-medium text-success-600">{bot.performance.winningTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Losing Trades</span>
              <span className="text-sm font-medium text-danger-600">{bot.performance.losingTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Max Drawdown</span>
              <span className="text-sm font-medium text-gray-900">
                {(bot.performance.maxDrawdown * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Execution</span>
              <span className="text-sm font-medium text-gray-900">
                {bot.lastExecution 
                  ? new Date(bot.lastExecution).toLocaleString()
                  : 'Never'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Created</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(bot.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Strategy Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(bot.settings).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BotDetails;