import { useState } from 'react';
import { Droplet } from 'lucide-react';
import PropertyDetail from './PropertyDetail';

interface Property {
  id: string;
  name: string;
  units: number;
  usage: number;
  status: 'Normal' | 'Alert';
}

const properties: Property[] = [
  {
    id: '1',
    name: 'Green Valley Apartments',
    units: 12,
    usage: 450,
    status: 'Normal',
  },
  {
    id: '2',
    name: 'Sunset Heights',
    units: 8,
    usage: 380,
    status: 'Alert',
  },
  {
    id: '3',
    name: 'Blue Ridge Complex',
    units: 15,
    usage: 620,
    status: 'Normal',
  },
];

const PropertyList = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  if (selectedProperty) {
    return <PropertyDetail />;
  }

  return (
    <div className="divide-y divide-gray-200">
      {properties.map((property) => (
        <div
          key={property.id}
          className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => setSelectedProperty(property.id)}
        >
          <div>
            <h3 className="text-sm font-medium text-gray-900">{property.name}</h3>
            <p className="text-sm text-gray-500">{property.units} units</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Droplet className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-gray-600">{property.usage}L</span>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              property.status === 'Normal' 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {property.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;