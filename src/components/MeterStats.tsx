import { Droplet, Activity, Battery } from 'lucide-react';

interface Tank {
  id: string;
  name: string;
  capacity: number;
  currentLevel: number;
  status: 'active' | 'inactive';
}

interface Meter {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  lastReading: number;
  lastReadingTime: string;
}

const tanks: Tank[] = [
  {
    id: '1',
    name: 'Main Tank',
    capacity: 1000,
    currentLevel: 750,
    status: 'active',
  },
  {
    id: '2',
    name: 'Backup Tank',
    capacity: 500,
    currentLevel: 200,
    status: 'active',
  },
  {
    id: '3',
    name: 'Emergency Tank',
    capacity: 200,
    currentLevel: 0,
    status: 'inactive',
  },
];

const meters: Meter[] = [
  {
    id: '1',
    name: 'Main Meter',
    status: 'active',
    lastReading: 1250,
    lastReadingTime: '2024-03-25 14:30',
  },
  {
    id: '2',
    name: 'Secondary Meter',
    status: 'active',
    lastReading: 850,
    lastReadingTime: '2024-03-25 14:30',
  },
  {
    id: '3',
    name: 'Backup Meter',
    status: 'inactive',
    lastReading: 0,
    lastReadingTime: '2024-03-25 10:15',
  },
];

const MeterStats = () => {
  const totalCapacity = tanks.reduce((sum, tank) => sum + tank.capacity, 0);
  const totalCurrentLevel = tanks.reduce((sum, tank) => sum + tank.currentLevel, 0);
  const overallCapacityPercentage = (totalCurrentLevel / totalCapacity) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{totalCapacity}L</p>
            </div>
            <div className="bg-blue-50 rounded-full p-3">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Level</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{totalCurrentLevel}L</p>
            </div>
            <div className="bg-green-50 rounded-full p-3">
              <Battery className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Capacity</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{overallCapacityPercentage.toFixed(1)}%</p>
            </div>
            <div className="bg-yellow-50 rounded-full p-3">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tanks Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tanks Status</h2>
        <div className="space-y-4">
          {tanks.map((tank) => (
            <div key={tank.id} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{tank.name}</h3>
                <p className="text-sm text-gray-500">Capacity: {tank.capacity}L</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(tank.currentLevel / tank.capacity) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {((tank.currentLevel / tank.capacity) * 100).toFixed(1)}%
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  tank.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tank.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meters Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Meters Status</h2>
        <div className="space-y-4">
          {meters.map((meter) => (
            <div key={meter.id} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{meter.name}</h3>
                <p className="text-sm text-gray-500">Last Reading: {meter.lastReading}L</p>
                <p className="text-xs text-gray-400">{meter.lastReadingTime}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                meter.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {meter.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeterStats; 