import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  openPrice: number;
  currentPrice: number;
  profit: number;
  volume: number;
  openTime: string;
  stopLoss: number;
  takeProfit: number;
}

interface ActiveTradesProps {
  trades: Trade[];
  onCloseTrade: (tradeId: string) => void;
  onModifyTrade: (tradeId: string, stopLoss: number, takeProfit: number) => void;
}

const ActiveTrades: React.FC<ActiveTradesProps> = ({ trades, onCloseTrade, onModifyTrade }) => {
  const [editingTrade, setEditingTrade] = React.useState<string | null>(null);
  const [newStopLoss, setNewStopLoss] = React.useState<number>(0);
  const [newTakeProfit, setNewTakeProfit] = React.useState<number>(0);

  const handleEditClick = (trade: Trade) => {
    setEditingTrade(trade.id);
    setNewStopLoss(trade.stopLoss);
    setNewTakeProfit(trade.takeProfit);
  };

  const handleSaveEdit = (tradeId: string) => {
    onModifyTrade(tradeId, newStopLoss, newTakeProfit);
    setEditingTrade(null);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Active Trades</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Open Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stop Loss
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Take Profit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {trade.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trade.type === 'buy'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {trade.type === 'buy' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trade.volume.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trade.openPrice.toFixed(5)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trade.currentPrice.toFixed(5)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingTrade === trade.id ? (
                    <input
                      type="number"
                      value={newStopLoss}
                      onChange={(e) => setNewStopLoss(parseFloat(e.target.value))}
                      className="w-24 rounded border-gray-300"
                      step="0.00001"
                    />
                  ) : (
                    trade.stopLoss.toFixed(5)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingTrade === trade.id ? (
                    <input
                      type="number"
                      value={newTakeProfit}
                      onChange={(e) => setNewTakeProfit(parseFloat(e.target.value))}
                      className="w-24 rounded border-gray-300"
                      step="0.00001"
                    />
                  ) : (
                    trade.takeProfit.toFixed(5)
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`${
                      trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    } font-medium`}
                  >
                    ${trade.profit.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {editingTrade === trade.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(trade.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTrade(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(trade)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onCloseTrade(trade.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Close
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTrades;
