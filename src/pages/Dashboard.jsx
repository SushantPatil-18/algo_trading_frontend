import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { toast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  BarChart3,
  Play,
  Pause,
  Square,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data.dashboard);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
        <button 
          onClick={fetchDashboardData}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { bots, trades, exchangeAccounts, recentBots } = dashboardData;

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
      primary: 'bg-primary-50 text-primary-600',
      success: 'bg-success-50 text-success-600',
      danger: 'bg-danger-50 text-danger-600',
      warning: 'bg-yellow-50 text-yellow-600',
    };

    return (
      <div className="card">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-1">
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
                )}
                <span className={`text-sm ${trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const BotStatusIcon = ({ status }) => {
    const icons = {
      running: <Play className="w-4 h-4 text-success-600" />,
      paused: <Pause className="w-4 h-4 text-yellow-600" />,
      stopped: <Square className="w-4 h-4 text-gray-600" />,
      error: <AlertTriangle className="w-4 h-4 text-danger-600" />,
    };
    return icons[status] || icons.stopped;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/bots/create"
          className="btn-primary"
        >
          Create New Bot
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bots"
          value={bots.total}
          icon={Bot}
          color="primary"
        />
        <StatCard
          title="Running Bots"
          value={bots.running}
          icon={Activity}
          color="success"
        />
        <StatCard
          title="Total Trades"
          value={trades.total}
          icon={BarChart3}
          color="primary"
        />
        <StatCard
          title="Total P&L"
          value={`$${trades.totalPnl >= 0 ? '+' : ''}${trades.totalPnl.toFixed(2)}`}
          icon={DollarSign}
          color={trades.totalPnl >= 0 ? 'success' : 'danger'}
        />
      </div>

      {/* Bot Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bot Status */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bot Status Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Running</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{bots.running}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Paused</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{bots.paused}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Stopped</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{bots.stopped}</span>
            </div>
          </div>
        </div>

        {/* Trading Summary */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Trading</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trades Today</span>
              <span className="text-sm font-medium text-gray-900">{trades.today}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Exchange Accounts</span>
              <span className="text-sm font-medium text-gray-900">{exchangeAccounts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total P&L</span>
              <span className={`text-sm font-medium ${trades.totalPnl >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                ${trades.totalPnl >= 0 ? '+' : ''}{trades.totalPnl.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bots */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Bots</h3>
          <Link to="/bots" className="text-sm text-primary-600 hover:text-primary-500">
            View all
          </Link>
        </div>
        
        {recentBots.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Strategy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P&L
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Execution
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBots.map((bot) => (
                  <tr key={bot._id}>
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
                      <div className="text-sm text-gray-500 capitalize">{bot.strategyId?.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`status-${bot.status}`}>
                        {bot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={bot.performance.totalPnl >= 0 ? 'text-success-600' : 'text-danger-600'}>
                        ${bot.performance.totalPnl >= 0 ? '+' : ''}{bot.performance.totalPnl.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bot.lastExecution ? new Date(bot.lastExecution).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bots yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first trading bot</p>
            <Link to="/bots/create" className="btn-primary">
              Create Bot
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;