import { useState, useEffect } from 'react';
import { Droplet, Plus, Edit, Trash2, Search, Filter, Users, Activity, Gauge, Wifi, WifiOff, Signal, Battery, AlertTriangle } from 'lucide-react';
import { metersApi, propertiesApi, tenantsApi } from '../services/api';
import type { Meter, Property, Tenant, CreateMeterData } from '../types';

const MeterManagement = () => {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedConnectivity, setSelectedConnectivity] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metersData, propertiesData, tenantsData] = await Promise.all([
        metersApi.getAll(),
        propertiesApi.getAll(),
        tenantsApi.getAll()
      ]);
      setMeters(metersData);
      setProperties(propertiesData);
      setTenants(tenantsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeter = async (meterId: string, meterNumber: string) => {
    if (confirm(`Are you sure you want to delete smart meter ${meterNumber}? This will also remove all historical data.`)) {
      try {
        await metersApi.delete(meterId);
        await loadData();
      } catch (err: any) {
        alert(`Error deleting smart meter: ${err.message}`);
      }
    }
  };

  const handleAssignMeter = async (meterId: string, tenantId: string) => {
    try {
      await metersApi.assignToTenant(meterId, tenantId);
      await loadData();
    } catch (err: any) {
      alert(`Error assigning smart meter: ${err.message}`);
    }
  };

  const handleUnassignMeter = async (meterId: string) => {
    try {
      await metersApi.unassignFromTenant(meterId);
      await loadData();
    } catch (err: any) {
      alert(`Error unassigning smart meter: ${err.message}`);
    }
  };

  // Simulate connectivity status based on meter status
  const getConnectivityStatus = (meter: Meter) => {
    return meter.status === 'active' ? 'connected' : 'disconnected';
  };

  // Simulate signal strength (random for demo)
  const getSignalStrength = (meter: Meter) => {
    if (meter.status !== 'active') return 0;
    return Math.floor(Math.random() * 5) + 1; // 1-5 bars
  };

  // Simulate battery level (random for demo)
  const getBatteryLevel = (meter: Meter) => {
    return Math.floor(Math.random() * 100);
  };

  const filteredMeters = meters.filter(meter => {
    const matchesSearch = meter.meter_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meter.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meter.property?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProperty = selectedProperty === 'all' || meter.property_id === selectedProperty;
    const matchesStatus = selectedStatus === 'all' || meter.status === selectedStatus;
    
    const connectivity = getConnectivityStatus(meter);
    const matchesConnectivity = selectedConnectivity === 'all' || selectedConnectivity === connectivity;
    
    return matchesSearch && matchesProperty && matchesStatus && matchesConnectivity;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading smart meters...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        Error loading smart meters: {error}
      </div>
    );
  }

  const meterStats = {
    total: meters.length,
    connected: meters.filter(m => m.status === 'active').length,
    disconnected: meters.filter(m => m.status !== 'active').length,
    available: meters.filter(m => m.status === 'available').length,
    maintenance: meters.filter(m => m.status === 'maintenance').length,
    assigned: meters.filter(m => m.tenant_id).length
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Meter Management</h1>
          <p className="text-gray-600">Monitor and manage IoT water meters with automated readings</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Smart Meter
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Droplet className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Meters</p>
              <p className="text-2xl font-bold text-gray-900">{meterStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Wifi className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Connected</p>
              <p className="text-2xl font-bold text-gray-900">{meterStats.connected}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <WifiOff className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Disconnected</p>
              <p className="text-2xl font-bold text-gray-900">{meterStats.disconnected}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{meterStats.assigned}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{meterStats.maintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by meter number, location, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Properties</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={selectedConnectivity}
              onChange={(e) => setSelectedConnectivity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Connectivity</option>
              <option value="connected">Connected</option>
              <option value="disconnected">Disconnected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Smart Meters List */}
      {filteredMeters.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {meters.length === 0 ? 'No smart meters yet' : 'No meters match your search'}
          </h3>
          <p className="text-gray-500 mb-4">
            {meters.length === 0 
              ? 'Add your first smart meter to start automated monitoring' 
              : 'Try adjusting your search criteria'
            }
          </p>
          {meters.length === 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Smart Meter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMeters.map((meter) => (
            <SmartMeterCard
              key={meter.id}
              meter={meter}
              tenants={tenants.filter(t => t.property_id === meter.property_id)}
              onEdit={() => setEditingMeter(meter)}
              onDelete={() => handleDeleteMeter(meter.id, meter.meter_number)}
              onAssign={handleAssignMeter}
              onUnassign={() => handleUnassignMeter(meter.id)}
              connectivity={getConnectivityStatus(meter)}
              signalStrength={getSignalStrength(meter)}
              batteryLevel={getBatteryLevel(meter)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateSmartMeterModal
          properties={properties}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}

      {editingMeter && (
        <EditSmartMeterModal
          meter={editingMeter}
          properties={properties}
          onClose={() => setEditingMeter(null)}
          onSuccess={() => {
            setEditingMeter(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

interface SmartMeterCardProps {
  meter: Meter;
  tenants: Tenant[];
  onEdit: () => void;
  onDelete: () => void;
  onAssign: (meterId: string, tenantId: string) => void;
  onUnassign: () => void;
  connectivity: string;
  signalStrength: number;
  batteryLevel: number;
}

const SmartMeterCard = ({ 
  meter, 
  tenants, 
  onEdit, 
  onDelete, 
  onAssign, 
  onUnassign, 
  connectivity,
  signalStrength,
  batteryLevel
}: SmartMeterCardProps) => {
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const assignedTenant = meter.tenant_id ? tenants.find(t => t.id === meter.tenant_id) : null;
  const availableTenants = tenants.filter(t => t.status === 'active');

  const renderSignalBars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(bar => (
          <div
            key={bar}
            className={`w-1 rounded-full ${
              bar <= signalStrength 
                ? 'bg-green-500' 
                : 'bg-gray-300'
            }`}
            style={{ height: `${bar * 3 + 6}px` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Droplet className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{meter.meter_number}</h3>
            <p className="text-sm text-gray-500">{meter.property?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {connectivity === 'connected' ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-600" />
          )}
          <span className={`px-2 py-1 text-xs rounded-full ${
            meter.status === 'active' 
              ? 'bg-green-100 text-green-800'
              : meter.status === 'available'
              ? 'bg-blue-100 text-blue-800'
              : meter.status === 'maintenance'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {meter.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="text-sm font-medium text-gray-900">{meter.location}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Assignment</p>
          <p className="text-sm font-medium text-gray-900">
            {assignedTenant ? `Unit ${assignedTenant.unit_number}` : 'Unassigned'}
          </p>
        </div>

        {meter.last_reading_value && (
          <div>
            <p className="text-sm text-gray-500">Current Reading</p>
            <p className="text-sm font-medium text-gray-900">
              {meter.last_reading_value} L
              {meter.last_reading_date && (
                <span className="text-gray-500 ml-2">
                  (Auto-updated {new Date(meter.last_reading_date).toLocaleDateString()})
                </span>
              )}
            </p>
          </div>
        )}

        {connectivity === 'connected' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Signal Strength</p>
              <div className="flex items-center space-x-2">
                {renderSignalBars()}
                <span className="text-xs text-gray-600">{signalStrength}/5</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Battery Level</p>
              <div className="flex items-center space-x-2">
                <Battery className={`h-4 w-4 ${
                  batteryLevel > 50 ? 'text-green-600' : 
                  batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <span className="text-sm font-medium text-gray-900">{batteryLevel}%</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500">Installation Date</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(meter.installation_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <button
            onClick={() => setShowAssignMenu(!showAssignMenu)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
          >
            <Users className="h-4 w-4 inline mr-1" />
            {assignedTenant ? 'Reassign' : 'Assign'}
          </button>
          
          {showAssignMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]">
              {assignedTenant && (
                <button
                  onClick={() => {
                    onUnassign();
                    setShowAssignMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Unassign from Unit {assignedTenant.unit_number}
                </button>
              )}
              {availableTenants.length > 0 && (
                <div className={assignedTenant ? "border-t" : ""}>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Assign to Tenant
                  </div>
                  {availableTenants.map(tenant => (
                    <button
                      key={tenant.id}
                      onClick={() => {
                        onAssign(meter.id, tenant.id);
                        setShowAssignMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Unit {tenant.unit_number}
                    </button>
                  ))}
                </div>
              )}
              {availableTenants.length === 0 && !assignedTenant && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No available tenants
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onEdit}
          className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
        >
          <Edit className="h-4 w-4" />
        </button>
        
        <button
          onClick={onDelete}
          className="bg-gray-100 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface CreateSmartMeterModalProps {
  properties: Property[];
  onClose: () => void;
  onSuccess: () => void;
}

const CreateSmartMeterModal = ({ properties, onClose, onSuccess }: CreateSmartMeterModalProps) => {
  const [formData, setFormData] = useState<CreateMeterData>({
    property_id: '',
    meter_number: '',
    meter_type: 'water',
    location: '',
    installation_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await metersApi.create(formData);
      onSuccess();
    } catch (err: any) {
      alert(`Error creating smart meter: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Smart Meter</h2>
        <p className="text-sm text-gray-600 mb-4">
          Smart meters automatically report readings and can be monitored remotely.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
              required
              value={formData.property_id}
              onChange={(e) => setFormData(prev => ({ ...prev, property_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Property</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meter Number / Device ID</label>
            <input
              type="text"
              required
              value={formData.meter_number}
              onChange={(e) => setFormData(prev => ({ ...prev, meter_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. SM001, IoT-WM-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meter Type</label>
            <select
              value={formData.meter_type}
              onChange={(e) => setFormData(prev => ({ ...prev, meter_type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="water">Smart Water Meter</option>
              <option value="electricity">Smart Electricity Meter</option>
              <option value="gas">Smart Gas Meter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Installation Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Unit A101 - Kitchen, Main Water Line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Installation Date</label>
            <input
              type="date"
              required
              value={formData.installation_date}
              onChange={(e) => setFormData(prev => ({ ...prev, installation_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Installing...' : 'Install Smart Meter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditSmartMeterModalProps {
  meter: Meter;
  properties: Property[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditSmartMeterModal = ({ meter, properties, onClose, onSuccess }: EditSmartMeterModalProps) => {
  const [formData, setFormData] = useState({
    property_id: meter.property_id,
    meter_number: meter.meter_number,
    meter_type: meter.meter_type,
    location: meter.location,
    installation_date: meter.installation_date,
    status: meter.status
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await metersApi.update(meter.id, formData);
      onSuccess();
    } catch (err: any) {
      alert(`Error updating smart meter: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Smart Meter</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
            <select
              required
              value={formData.property_id}
              onChange={(e) => setFormData(prev => ({ ...prev, property_id: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meter Number / Device ID</label>
            <input
              type="text"
              required
              value={formData.meter_number}
              onChange={(e) => setFormData(prev => ({ ...prev, meter_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meter Type</label>
            <select
              value={formData.meter_type}
              onChange={(e) => setFormData(prev => ({ ...prev, meter_type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="water">Smart Water Meter</option>
              <option value="electricity">Smart Electricity Meter</option>
              <option value="gas">Smart Gas Meter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Installation Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Installation Date</label>
            <input
              type="date"
              required
              value={formData.installation_date}
              onChange={(e) => setFormData(prev => ({ ...prev, installation_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active (Connected)</option>
              <option value="available">Available (Ready to Deploy)</option>
              <option value="maintenance">Maintenance Required</option>
              <option value="inactive">Inactive (Disconnected)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Smart Meter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeterManagement; 