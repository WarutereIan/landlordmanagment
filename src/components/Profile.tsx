import React from 'react';
import { User, Mail, Phone, MapPin, Building2, Users, Settings, Bell, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, signOut } = useAuth();

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
              <h2 className="text-2xl font-bold text-gray-900">Landlord User</h2>
              <p className="text-gray-500">Property Manager</p>
              <div className="flex items-center space-x-2 text-blue-600 mt-1">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{user?.phone || 'Phone not available'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">User ID</span>
            <span className="font-medium text-sm">{user?.id?.substring(0, 8)}...</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Phone Number</span>
            <span className="font-medium">{user?.phone || 'Not available'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Account Status</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Sign In</span>
            <span className="font-medium text-sm">
              {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Role</span>
            <span className="font-medium text-blue-600">Landlord</span>
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

      <div className="bg-white shadow rounded-lg p-6">
        <button
          onClick={signOut}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;