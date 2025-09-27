import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { strategiesAPI, exchangeAPI } from '../services/api';
import { toast } from '../components/ui/Toaster';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft, Bot, TrendingUp, Shield, DollarSign } from 'lucide-react';

const CreateBot = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [strategies, setStrategies] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    exchangeAccountId: '',
    strategyId: '',
    symbol: 'BTC/USDT',
    allocation: {
      amount: 100,
      currency: 'USDT'
    },
    settings: {}
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [strategiesResponse, exchangesResponse] = await Promise.all([
        strategiesAPI.getStrategies(),
        exchangeAPI.getExchangeAccounts()
      ]);
      
      setStrategies(strategiesResponse.data.strategies);
      setExchanges(exchangesResponse.data.account);
    } catch (error) {
      toast.error('Failed to load initial data');
      console.error('Create bot error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStrategyChange = async (strategyId) => {
    if (!strategyId) {
      setSelectedStrategy(null);
      return;
    }

    try {
      const response = await strategiesAPI.getStrategy(strategyId);
      setSelectedStrategy(response.data.strategy);
      
      // Initialize settings with default values
      const defaultSettings = {};
      response.data.strategy.parameters.forEach(param => {
        defaultSettings[param.name] = param.defaultValue;
      });
      
      setFormData(prev => ({
        ...prev,
        strategyId,
        settings: defaultSettings
      }));
    } catch (error) {
      toast.error('Failed to load strategy details');
    }
  };

  const handleSettingChange = (paramName, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [paramName]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await strategiesAPI.createTradingBot(formData);
      toast.success('Trading bot created successfully!');
      navigate('/bots');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create bot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    const colors = {
      low: 'text-success-600 bg-success-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-danger-600 bg-danger-100'
    };
    return colors[riskLevel] || colors.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      trend_following: TrendingUp,
      mean_reversion: TrendingUp,
      grid: Bot,
      scalping: TrendingUp,
      arbitrage: DollarSign
    };
    return icons[category] || Bot;
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
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/bots')}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create Trading Bot</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., BTC SMA Bot"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trading Symbol
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  className="input-field"
                  placeholder="e.g., BTC/USDT"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exchange Account
                </label>
                <select
                  value={formData.exchangeAccountId}
                  onChange={(e) => setFormData(prev => ({ ...prev, exchangeAccountId: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select exchange account</option>
                  {exchanges.map(exchange => (
                    <option key={exchange._id} value={exchange._id}>
                      {exchange.exchange.toUpperCase()} - {exchange.label}
                      {exchange.testnet && ' (Testnet)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allocation Amount
                  </label>
                  <input
                    type="number"
                    value={formData.allocation.amount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      allocation: { ...prev.allocation, amount: parseFloat(e.target.value) }
                    }))}
                    className="input-field"
                    min="10"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.allocation.currency}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      allocation: { ...prev.allocation, currency: e.target.value }
                    }))}
                    className="input-field"
                  >
                    <option value="USDT">USDT</option>
                    <option value="USD">USD</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Selection */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Strategy</h3>
            
            <div className="space-y-3">
              {strategies.map(strategy => {
                const IconComponent = getCategoryIcon(strategy.category);
                return (
                  <div
                    key={strategy._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.strategyId === strategy._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleStrategyChange(strategy._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <IconComponent className="w-5 h-5 text-primary-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">{strategy.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{strategy.description}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(strategy.riskLevel)}`}>
                              <Shield className="w-3 h-3 mr-1" />
                              {strategy.riskLevel} risk
                            </span>
                            <span className="text-xs text-gray-500">
                              Min: ${strategy.minBalance}
                            </span>
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="strategy"
                        value={strategy._id}
                        checked={formData.strategyId === strategy._id}
                        onChange={() => handleStrategyChange(strategy._id)}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Strategy Parameters */}
        {selectedStrategy && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Strategy Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedStrategy.parameters.map(param => (
                <div key={param.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {param.description}
                    {param.required && <span className="text-danger-500 ml-1">*</span>}
                  </label>
                  
                  {param.type === 'select' ? (
                    <select
                      value={formData.settings[param.name] || param.defaultValue}
                      onChange={(e) => handleSettingChange(param.name, e.target.value)}
                      className="input-field"
                      required={param.required}
                    >
                      {param.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : param.type === 'number' ? (
                    <input
                      type="number"
                      value={formData.settings[param.name] || param.defaultValue}
                      onChange={(e) => handleSettingChange(param.name, parseFloat(e.target.value) || 0)}
                      className="input-field"
                      min={param.min}
                      max={param.max}
                      step="0.01"
                      required={param.required}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.settings[param.name] || param.defaultValue}
                      onChange={(e) => handleSettingChange(param.name, e.target.value)}
                      className="input-field"
                      required={param.required}
                    />
                  )}
                  
                  {(param.min !== undefined || param.max !== undefined) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Range: {param.min} - {param.max}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/bots')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedStrategy}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              'Create Bot'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBot;