import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Droplet, Plus, Edit, Trash2, Wifi, WifiOff, Battery, Signal } from 'lucide-react';
import { propertiesApi, tenantsApi, metersApi } from '../services/api';
import type { Property, Tenant, Meter, CreateMeterData } from '../types';

interface PropertyDetailProps {
  propertyId: string;
  onBack: () => void;
}

const PropertyDetail = ({ propertyId, onBack }: PropertyDetailProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tenants' | 'meters'>('tenants');

  useEffect(() => {
    loadPropertyData();
  }, [propertyId]);

  const loadPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [propertyData, tenantsData, metersData] = await Promise.all([
        propertiesApi.getById(propertyId),
        tenantsApi.getByPropertyId(propertyId),
        metersApi.getByPropertyId(propertyId)
      ]);

      setProperty(propertyData);
      setTenants(tenantsData);
      setMeters(metersData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading property details...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        Error loading property: {error || 'Property not found'}
      </div>
    );
  }

  const activeTenants = tenants.filter(t => t.status === 'active');
  const activeMeters = meters.filter(m => m.status === 'active');
  const availableMeters = meters.filter(m => m.status === 'available');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <p className="text-gray-600">{property.address}</p>
        </div>
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{activeTenants.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Droplet className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Meters</p>
              <p className="text-2xl font-bold text-gray-900">{activeMeters.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Droplet className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Available Meters</p>
              <p className="text-2xl font-bold text-gray-900">{availableMeters.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {property.total_units > 0 ? Math.round((activeTenants.length / property.total_units) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tenants'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tenants ({tenants.length})
          </button>
          <button
            onClick={() => setActiveTab('meters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'meters'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Meters ({meters.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tenants' ? (
        <TenantsTab 
          propertyId={propertyId} 
          tenants={tenants} 
          onDataChange={loadPropertyData}
        />
      ) : (
        <MetersTab 
          propertyId={propertyId} 
          meters={meters} 
          tenants={tenants}
          onDataChange={loadPropertyData}
        />
      )}
    </div>
  );
};

interface TenantsTabProps {
  propertyId: string;
  tenants: Tenant[];
  onDataChange: () => void;
}

const TenantsTab = ({ propertyId, tenants, onDataChange }: TenantsTabProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Tenants</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </button>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tenants yet</h3>
          <p className="text-gray-500 mb-4">Add tenants to start managing this property</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="py-4 px-6">
              <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">Unit {tenant.unit_number}</h4>
                    <p className="text-sm text-gray-500">
                      Lease: {new Date(tenant.lease_start_date).toLocaleDateString()} - {new Date(tenant.lease_end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rent: KSh {tenant.monthly_rent.toLocaleString()}
                    </p>
                </div>
                  <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tenant.status === 'active'
                      ? 'bg-green-100 text-green-800'
                        : tenant.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tenant.status}
                  </span>
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
                </div>
              )}
            </div>
  );
};

interface MetersTabProps {
  propertyId: string;
  meters: Meter[];
  tenants: Tenant[];
  onDataChange: () => void;
}

const MetersTab = ({ propertyId, meters, tenants, onDataChange }: MetersTabProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null);
  const [showAssignMenu, setShowAssignMenu] = useState<string | null>(null);

  const handleDeleteMeter = async (meterId: string, meterNumber: string) => {
    if (confirm(`Are you sure you want to delete smart meter ${meterNumber}? This will also remove all historical data.`)) {
      try {
        await metersApi.delete(meterId);
        onDataChange();
      } catch (err: any) {
        alert(`Error deleting smart meter: ${err.message}`);
      }
    }
  };

  const handleAssignMeter = async (meterId: string, tenantId: string) => {
    try {
      await metersApi.assignToTenant(meterId, tenantId);
      setShowAssignMenu(null);
      onDataChange();
    } catch (err: any) {
      alert(`Error assigning smart meter: ${err.message}`);
    }
  };

  const handleUnassignMeter = async (meterId: string) => {
    try {
      await metersApi.unassignFromTenant(meterId);
      setShowAssignMenu(null);
      onDataChange();
    } catch (err: any) {
      alert(`Error unassigning smart meter: ${err.message}`);
    }
  };

  // Simulate smart meter features
  const getConnectivityStatus = (meter: Meter) => {
    return meter.status === 'active' ? 'connected' : 'disconnected';
  };

  const getSignalStrength = (meter: Meter) => {
    if (meter.status !== 'active') return 0;
    return Math.floor(Math.random() * 5) + 1;
  };

  const getBatteryLevel = (meter: Meter) => {
    return Math.floor(Math.random() * 100);
  };

  const availableTenants = tenants.filter(t => t.status === 'active');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Smart Water Meters</h3>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Smart Meter
        </button>
      </div>

      {meters.length === 0 ? (
        <div className="text-center py-8">
          <Droplet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No smart meters yet</h3>
          <p className="text-gray-500 mb-4">Add IoT water meters for automated monitoring and readings</p>
              <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
            Add First Smart Meter
              </button>
            </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {meters.map((meter) => {
            const assignedTenant = meter.tenant_id ? tenants.find(t => t.id === meter.tenant_id) : null;
            const connectivity = getConnectivityStatus(meter);
            const signalStrength = getSignalStrength(meter);
            const batteryLevel = getBatteryLevel(meter);
            
            return (
              <div key={meter.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Droplet className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                      <h4 className="text-lg font-medium text-gray-900">{meter.meter_number}</h4>
                      <p className="text-sm text-gray-500">{meter.location}</p>
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
                        <p className="text-sm text-gray-500">Signal</p>
                        <div className="flex items-center space-x-2">
                          <Signal className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">{signalStrength}/5</span>
                </div>
              </div>
                <div>
                        <p className="text-sm text-gray-500">Battery</p>
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
                      onClick={() => setShowAssignMenu(showAssignMenu === meter.id ? null : meter.id)}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
                    >
                      <Users className="h-4 w-4 inline mr-1" />
                      {assignedTenant ? 'Reassign' : 'Assign'}
                    </button>
                    
                    {showAssignMenu === meter.id && (
                      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]">
                        {assignedTenant && (
                          <button
                            onClick={() => handleUnassignMeter(meter.id)}
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
                                onClick={() => handleAssignMeter(meter.id, tenant.id)}
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
                    onClick={() => setEditingMeter(meter)}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteMeter(meter.id, meter.meter_number)}
                    className="bg-gray-100 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
            </div>
          </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateSmartMeterModal
          propertyId={propertyId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            onDataChange();
          }}
        />
      )}

      {editingMeter && (
        <EditSmartMeterModal
          meter={editingMeter}
          onClose={() => setEditingMeter(null)}
          onSuccess={() => {
            setEditingMeter(null);
            onDataChange();
          }}
        />
      )}
    </div>
  );
};

// Modal Components
interface CreateSmartMeterModalProps {
  propertyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateSmartMeterModal = ({ propertyId, onClose, onSuccess }: CreateSmartMeterModalProps) => {
  const [formData, setFormData] = useState<CreateMeterData>({
    property_id: propertyId,
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
      alert(`Error creating meter: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Meter</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meter Number</label>
            <input
              type="text"
              required
              value={formData.meter_number}
              onChange={(e) => setFormData(prev => ({ ...prev, meter_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. WM001, WM002"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meter Type</label>
            <select
              value={formData.meter_type}
              onChange={(e) => setFormData(prev => ({ ...prev, meter_type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="gas">Gas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Unit A101 - Kitchen, Basement"
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
              {loading ? 'Creating...' : 'Create Meter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditSmartMeterModalProps {
  meter: Meter;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSmartMeterModal = ({ meter, onClose, onSuccess }: EditSmartMeterModalProps) => {
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
      alert(`Error updating meter: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Edit Meter</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meter Number</label>
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
              <option value="water">Water</option>
              <option value="electricity">Electricity</option>
              <option value="gas">Gas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
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
              <option value="active">Active</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
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
              {loading ? 'Updating...' : 'Update Meter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyDetail; 