import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { strategiesAPI, botsAPI } from '../services/api';
import { toast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Square, 
  AlertTriangle, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Bots = () => {
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await strategiesAPI.getTradingBots();
      setBots(response.data.bots);
    } catch (error) {
      toast.error('Failed to load bots');
      console.error('Bots error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBotAction = async (botId, action) => {
    setActionLoading(prev => ({ ...prev, [botId]: true }));
    
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
      fetchBots(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} bot`);
    } finally {
      setActionLoading(prev => ({ ...prev, [botId]: false }));
    }
  };

  const getBotStatusColor = (status) => {
    const colors = {
      running: 'text-success-600 bg-success-100',
      paused: 'text-yellow-600 bg-yellow-100',
      stopped: 'text-gray-600 bg-gray-100',
      error: 'text-danger-600 bg-danger-100',
    };
    return colors[status] || colors.stopped;
  };

  const BotStatusIcon = ({ status }) => {
    const icons = {
      running: <Play className="w-4 h-4" />,
      paused: <Pause className="w-4 h-4" />,
      stopped: <Square className="w-4 h-4" />,
      error: <AlertTriangle className="w-4 h-4" />,
    };
    return icons[status] || icons.stopped;
  };

  const BotActionButtons = ({ bot }) => {
    const isLoading = actionLoading[bot._id];
    
    return (
      <div className="flex items-center space-x-2">
        {bot.status === 'stopped' && (
          <button
            onClick={() => handleBotAction(bot._id, 'start')}
            disabled={isLoading}
            className="text-success-600 hover:text-success-700 p-1"
            title="Start Bot"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <Play className="w-4 h-4" />}
          </button>
        )}
        
        {bot.status === 'running' && (
          <>
            <button
              onClick={() => handleBotAction(bot._id, 'pause')}
              disabled={isLoading}
              className="text-yellow-600 hover:text-yellow-700 p-1"
              title="Pause Bot"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleBotAction(bot._id, 'stop')}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-700 p-1"
              title="Stop Bot"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <Square className="w-4 h-4" />}
            </button>
          </>
        )}
        
        {bot.status === 'paused' && (
          <>
            <button
              onClick={() => handleBotAction(bot._id, 'resume')}
              disabled={isLoading}
              className="text-success-600 hover:text-success-700 p-1"
              title="Resume Bot"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleBotAction(bot._id, 'stop')}
              disabled={isLoading}
              className="text-gray-600 hover:text-gray-700 p-1"
              title="Stop Bot"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : <Square className="w-4 h-4" />}
            </button>
          </>
        )}
        
        {bot.status === 'error' && (
          <button
            onClick={() => handleBotAction(bot._id, 'start')}
            disabled={isLoading}
            className="text-success-600 hover:text-success-700 p-1"
            title="Restart Bot"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <Play className="w-4 h-4" />}
          </button>
        )}
        
        <Link
          to={`/bots/${bot._id}`}
          className="text-gray-600 hover:text-gray-700 p-1"
          title="View Details"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Link>
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
        <h1 className="text-3xl font-bold text-gray-900">Trading Bots</h1>
        <Link to="/bots/create" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Bot
        </Link>
      </div>

      {/* Bots List */}
      {bots.length > 0 ? (
        <div className="card p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bot Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Strategy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exchange
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bots.map((bot) => (
                  <tr key={bot._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BotStatusIcon status={bot.status} />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{bot.name}</div>
                          <div className="text-sm text-gray-500">{bot.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bot.strategyId?.name}</div>
                      <div className="text-sm text-gray-500 capitalize">
                        {bot.strategyId?.category?.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{bot.exchangeAccountId?.exchange}</div>
                      <div className="text-sm text-gray-500">{bot.exchangeAccountId?.label}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBotStatusColor(bot.status)}`}>
                        {bot.status}
                      </span>
                      {bot.errorMessage && (
                        <div className="text-xs text-danger-600 mt-1" title={bot.errorMessage}>
                          Error occurred
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">
                          <span className={`font-medium ${bot.performance.totalPnl >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            ${bot.performance.totalPnl >= 0 ? '+' : ''}{bot.performance.totalPnl.toFixed(2)}
                          </span>
                        </div>
                        {bot.performance.totalPnl >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-success-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-danger-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {bot.performance.totalTrades} trades
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bot.allocation.amount} {bot.allocation.currency}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last: {bot.lastExecution ? new Date(bot.lastExecution).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <BotActionButtons bot={bot} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bots yet</h3>
          <p className="text-gray-500 mb-4">Create your first trading bot to get started</p>
          <Link to="/bots/create" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Bot
          </Link>
        </div>
      )}
    </div>
  );
};

export default Bots;