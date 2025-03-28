import React from 'react';
import { User, Mail, Phone, MapPin, Building2 } from 'lucide-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white -mt-12 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">James Wilson</h2>
              <p className="text-gray-500">Property Manager</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">james.wilson@example.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">+254 712 345 678</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">Nairobi, Kenya</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Properties Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-gray-900 font-medium">Total Properties</p>
                <p className="text-gray-500">Managing 12 properties</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-gray-900 font-medium">Total Tenants</p>
                <p className="text-gray-500">45 active tenants</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800">Manage</button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50">
            <span className="text-gray-700">Change Password</span>
            <Settings className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50">
            <span className="text-gray-700">Notification Preferences</span>
            <Bell className="h-5 w-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-gray-50">
            <span className="text-gray-700">Payment Settings</span>
            <Wallet className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;