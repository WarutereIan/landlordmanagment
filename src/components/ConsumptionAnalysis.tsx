import { useState } from 'react';
import { Download, TrendingUp, Clock, Droplet } from 'lucide-react';

interface ConsumptionData {
  date: string;
  totalUsage: number;
  peakUsage: number;
  averageUsage: number;
  readings: {
    time: string;
    value: number;
  }[];
}

const consumptionData: ConsumptionData[] = [
  {
    date: '2024-03-25',
    totalUsage: 1250,
    peakUsage: 150,
    averageUsage: 52,
    readings: [
      { time: '00:00', value: 50 },
      { time: '03:00', value: 45 },
      { time: '06:00', value: 40 },
      { time: '09:00', value: 120 },
      { time: '12:00', value: 150 },
      { time: '15:00', value: 100 },
      { time: '18:00', value: 80 },
      { time: '21:00', value: 60 },
    ],
  },
  // Add more days of data...
];

const ConsumptionAnalysis = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const currentData = consumptionData[0]; // Using the first data point for now

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            className="border rounded-md px-3 py-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'day' | 'week' | 'month')}
          >
            <option value="day">Last 24 hours</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{currentData?.totalUsage}L</p>
            </div>
            <div className="bg-blue-50 rounded-full p-3">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Usage</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{currentData?.peakUsage}L</p>
            </div>
            <div className="bg-red-50 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Usage</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{currentData?.averageUsage}L</p>
            </div>
            <div className="bg-green-50 rounded-full p-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Readings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Readings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage (L)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData?.readings.map((reading, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reading.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reading.value}L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reading.value > 100
                        ? 'bg-red-100 text-red-800'
                        : reading.value > 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {reading.value > 100 ? 'High' : reading.value > 50 ? 'Medium' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionAnalysis; 