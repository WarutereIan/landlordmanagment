import { useState } from 'react';
import { Building2, Power, AlertTriangle } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  unit: string;
  status: 'active' | 'inactive';
  meterStatus: 'active' | 'inactive';
  lastReading: number;
  lastReadingTime: string;
  balance: number;
  alerts: {
    id: string;
    type: 'high_usage' | 'low_balance' | 'meter_issue';
    message: string;
    severity: 'high' | 'medium' | 'low';
    time: string;
  }[];
}

interface Property {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  totalCapacity: number;
  currentLevel: number;
  status: 'active' | 'inactive';
  tenants: Tenant[];
}

const dummyProperty: Property = {
  id: '1',
  name: 'Green Valley Apartments',
  address: '123 Valley Road, Nairobi',
  totalUnits: 12,
  occupiedUnits: 8,
  totalCapacity: 1000,
  currentLevel: 750,
  status: 'active',
  tenants: [
    {
      id: '1',
      name: 'John Doe',
      unit: 'A1',
      status: 'active',
      meterStatus: 'active',
      lastReading: 150,
      lastReadingTime: '2024-03-25 14:30',
      balance: 2500,
      alerts: [
        {
          id: '1',
          type: 'high_usage',
          message: 'Unusual water consumption detected',
          severity: 'high',
          time: '2 hours ago'
        }
      ]
    },
    {
      id: '2',
      name: 'Jane Smith',
      unit: 'A2',
      status: 'active',
      meterStatus: 'inactive',
      lastReading: 0,
      lastReadingTime: '2024-03-25 10:15',
      balance: 0,
      alerts: [
        {
          id: '2',
          type: 'meter_issue',
          message: 'Meter not transmitting data',
          severity: 'high',
          time: '5 hours ago'
        }
      ]
    },
    {
      id: '3',
      name: 'Mike Johnson',
      unit: 'B1',
      status: 'inactive',
      meterStatus: 'inactive',
      lastReading: 0,
      lastReadingTime: '2024-03-24 18:00',
      balance: 0,
      alerts: []
    }
  ]
};

const PropertyDetail = () => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleMeterToggle = (tenantId: string) => {
    // TODO: Implement meter toggle functionality
    console.log('Toggle meter for tenant:', tenantId);
  };

  return (
    <div className="space-y-6">
      {/* Property Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{dummyProperty.name}</h2>
              <p className="text-sm text-gray-500">{dummyProperty.address}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            dummyProperty.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {dummyProperty.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-600">Total Units</p>
            <p className="text-2xl font-semibold text-gray-900">{dummyProperty.totalUnits}</p>
            <p className="text-sm text-gray-500">{dummyProperty.occupiedUnits} occupied</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Water Capacity</p>
            <p className="text-2xl font-semibold text-gray-900">{dummyProperty.totalCapacity}L</p>
            <p className="text-sm text-gray-500">{dummyProperty.currentLevel}L current</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Meters</p>
            <p className="text-2xl font-semibold text-gray-900">
              {dummyProperty.tenants.filter(t => t.meterStatus === 'active').length}
            </p>
            <p className="text-sm text-gray-500">out of {dummyProperty.tenants.length}</p>
          </div>
        </div>
      </div>

      {/* Tenants List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenants</h3>
        <div className="space-y-4">
          {dummyProperty.tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedTenant(tenant)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{tenant.name}</h4>
                  <p className="text-sm text-gray-500">Unit {tenant.unit}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tenant.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tenant.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMeterToggle(tenant.id);
                    }}
                    className={`p-2 rounded-full ${
                      tenant.meterStatus === 'active'
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    <Power className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Last Reading</p>
                  <p className="font-medium">{tenant.lastReading}L</p>
                  <p className="text-xs text-gray-400">{tenant.lastReadingTime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Balance</p>
                  <p className="font-medium">KSh {tenant.balance}</p>
                </div>
              </div>
              {tenant.alerts.length > 0 && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>{tenant.alerts.length} active alerts</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tenant Detail Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Tenant Details</h3>
              <button
                onClick={() => setSelectedTenant(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{selectedTenant.name}</h4>
                <p className="text-sm text-gray-500">Unit {selectedTenant.unit}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedTenant.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Meter Status</p>
                  <p className="font-medium">{selectedTenant.meterStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Reading</p>
                  <p className="font-medium">{selectedTenant.lastReading}L</p>
                  <p className="text-xs text-gray-400">{selectedTenant.lastReadingTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="font-medium">KSh {selectedTenant.balance}</p>
                </div>
              </div>
              {selectedTenant.alerts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Active Alerts</h4>
                  <div className="space-y-2">
                    {selectedTenant.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg ${
                          alert.severity === 'high'
                            ? 'bg-red-50 text-red-800'
                            : alert.severity === 'medium'
                            ? 'bg-yellow-50 text-yellow-800'
                            : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          <p className="text-sm font-medium">{alert.message}</p>
                        </div>
                        <p className="text-xs mt-1">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail; 