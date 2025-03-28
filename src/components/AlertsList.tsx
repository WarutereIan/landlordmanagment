import { useState } from 'react';
import { AlertTriangle, Building2, User } from 'lucide-react';

interface Alert {
  id: string;
  property: string;
  propertyId: string;
  tenant: string;
  tenantId: string;
  type: 'High Usage' | 'Low Balance' | 'Maintenance';
  message: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  details: {
    currentValue: number;
    threshold: number;
    unit: string;
  };
}

const alerts: Alert[] = [
  {
    id: '1',
    property: 'Sunset Heights',
    propertyId: '2',
    tenant: 'Jane Smith',
    tenantId: '2',
    type: 'High Usage',
    message: 'Unusual water consumption detected in Unit 4B',
    severity: 'high',
    time: '2 hours ago',
    details: {
      currentValue: 150,
      threshold: 100,
      unit: 'L'
    }
  },
  {
    id: '2',
    property: 'Green Valley',
    propertyId: '1',
    tenant: 'John Doe',
    tenantId: '1',
    type: 'Low Balance',
    message: 'Multiple tenants approaching minimum balance',
    severity: 'medium',
    time: '5 hours ago',
    details: {
      currentValue: 500,
      threshold: 1000,
      unit: 'KSh'
    }
  },
  {
    id: '3',
    property: 'Blue Ridge',
    propertyId: '3',
    tenant: 'Mike Johnson',
    tenantId: '3',
    type: 'Maintenance',
    message: 'Scheduled meter maintenance required',
    severity: 'low',
    time: '1 day ago',
    details: {
      currentValue: 0,
      threshold: 0,
      unit: ''
    }
  },
];

const AlertsList = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  return (
    <>
      <div className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="py-4 flex items-start space-x-4 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedAlert(alert)}
          >
            <div className={`p-2 rounded-full ${
              alert.severity === 'high' 
                ? 'bg-red-100'
                : alert.severity === 'medium'
                ? 'bg-yellow-100'
                : 'bg-blue-100'
            }`}>
              <AlertTriangle className={`h-5 w-5 ${
                alert.severity === 'high'
                  ? 'text-red-600'
                  : alert.severity === 'medium'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{alert.type}</h3>
                <span className="text-sm text-gray-500">{alert.time}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  {alert.property}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {alert.tenant}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className={`h-6 w-6 mr-2 ${
                  selectedAlert.severity === 'high'
                    ? 'text-red-600'
                    : selectedAlert.severity === 'medium'
                    ? 'text-yellow-600'
                    : 'text-blue-600'
                }`} />
                <h3 className="text-xl font-semibold text-gray-900">{selectedAlert.type}</h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Location</h4>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-1" />
                    {selectedAlert.property}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {selectedAlert.tenant}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">Details</h4>
                <p className="mt-1 text-sm text-gray-600">{selectedAlert.message}</p>
                {selectedAlert.details.unit && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Current Value:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedAlert.details.currentValue} {selectedAlert.details.unit}
                    </span>
                    <span className="text-sm text-gray-500">Threshold:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedAlert.details.threshold} {selectedAlert.details.unit}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">Time</h4>
                <p className="mt-1 text-sm text-gray-600">{selectedAlert.time}</p>
              </div>

              <div className="pt-4 border-t">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  View Property Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertsList;