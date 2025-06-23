import { useState, useEffect } from 'react';
import { Droplet, Building2, Users, Plus, Edit, Trash2 } from 'lucide-react';
import PropertyDetail from './PropertyDetail';
import { propertiesApi, tenantsApi } from '../services/api';
import type { Property } from '../types';

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertiesApi.getAll();
      setProperties(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string, propertyName: string) => {
    if (confirm(`Are you sure you want to delete "${propertyName}"? This will also delete all associated tenants and meters.`)) {
      try {
        await propertiesApi.delete(propertyId);
        await loadProperties();
      } catch (err: any) {
        alert(`Error deleting property: ${err.message}`);
      }
    }
  };

  if (selectedProperty) {
    return (
      <PropertyDetail 
        propertyId={selectedProperty} 
        onBack={() => setSelectedProperty(null)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading properties...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        Error loading properties: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Properties</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first property</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Property
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {properties.map((property) => (
              <PropertyRow
                key={property.id}
                property={property}
                onSelect={() => setSelectedProperty(property.id)}
                onDelete={() => handleDeleteProperty(property.id, property.name)}
              />
            ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreatePropertyModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadProperties();
          }}
        />
      )}
    </div>
  );
};

interface PropertyRowProps {
  property: Property;
  onSelect: () => void;
  onDelete: () => void;
}

const PropertyRow = ({ property, onSelect, onDelete }: PropertyRowProps) => {
  const [tenantCount, setTenantCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenantCount();
  }, [property.id]);

  const loadTenantCount = async () => {
    try {
      const tenants = await tenantsApi.getByPropertyId(property.id);
      setTenantCount(tenants.filter(t => t.status === 'active').length);
    } catch (err) {
      console.error('Error loading tenant count:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 px-6 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1 cursor-pointer" onClick={onSelect}>
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">{property.name}</h3>
              <p className="text-sm text-gray-500">{property.address}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-gray-500 flex items-center">
                  <Building2 className="h-3 w-3 mr-1" />
                  {property.total_units} units
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {loading ? '...' : tenantCount} tenants
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  property.property_type === 'residential' 
                    ? 'bg-green-100 text-green-800'
                    : property.property_type === 'commercial'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {property.property_type}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onSelect}
            className="p-2 text-gray-400 hover:text-blue-600"
            title="View Details"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-600"
            title="Delete Property"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface CreatePropertyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePropertyModal = ({ onClose, onSuccess }: CreatePropertyModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    property_type: 'residential' as 'residential' | 'commercial' | 'mixed',
    total_units: 1
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await propertiesApi.create(formData);
      onSuccess();
    } catch (err: any) {
      alert(`Error creating property: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Property</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter property name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              value={formData.property_type}
              onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed">Mixed Use</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Units
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.total_units}
              onChange={(e) => setFormData(prev => ({ ...prev, total_units: parseInt(e.target.value) }))}
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
              {loading ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyList;