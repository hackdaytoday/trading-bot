import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  timestamp: string;
  price: number;
  ma20: number;
  ma50: number;
  volume: number;
}

interface TradingChartProps {
  data: ChartData[];
  symbol: string;
  timeframe: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ data, symbol, timeframe }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{symbol}</h3>
          <p className="text-sm text-gray-500">Timeframe: {timeframe}</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50">
            1H
          </button>
          <button className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50">
            4H
          </button>
          <button className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50">
            1D
          </button>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [value.toFixed(5)]}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              dot={false}
              name="Price"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ma20"
              stroke="#10b981"
              dot={false}
              name="MA20"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="ma50"
              stroke="#f59e0b"
              dot={false}
              name="MA50"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="volume"
              stroke="#6b7280"
              dot={false}
              name="Volume"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Open</p>
          <p className="font-medium">{data[0]?.price.toFixed(5)}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">High</p>
          <p className="font-medium">
            {Math.max(...data.map((d) => d.price)).toFixed(5)}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Low</p>
          <p className="font-medium">
            {Math.min(...data.map((d) => d.price)).toFixed(5)}
          </p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-500">Close</p>
          <p className="font-medium">
            {data[data.length - 1]?.price.toFixed(5)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
