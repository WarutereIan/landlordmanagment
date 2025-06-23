import { useState } from 'react';
import { Building2, Users, Droplet, AlertTriangle, Bell, Wallet } from 'lucide-react';
import DashboardCard from './components/DashboardCard';
import WaterUsageChart from './components/WaterUsageChart';
import PropertyList from './components/PropertyList';
import AlertsList from './components/AlertsList';
import TenantManagement from './components/TenantManagement';
import PaymentMonitoring from './components/PaymentMonitoring';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import ConsumptionAnalysis from './components/ConsumptionAnalysis';
import LoadingSpinner from './components/LoadingSpinner';
import MeterManagement from './components/MeterManagement';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner className="min-h-screen bg-gray-100" />;
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'tenants':
        return <TenantManagement />;
      case 'payments':
        return <PaymentMonitoring />;
      case 'settings':
        return <Profile />;
      case 'properties':
        return <PropertyList />;
      case 'consumption':
        return <ConsumptionAnalysis />;
      case 'meters':
        return <MeterManagement />;
      default:
        return (
          <>
            {/* Overview Cards */}
            <DashboardCard />

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Water Consumption</h2>
                  <div className="flex items-center space-x-2">
                    <select className="text-sm border rounded-md px-2 py-1">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                    </select>
                  </div>
                </div>
                <WaterUsageChart />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
                  <button 
                    onClick={() => setActiveView('consumption')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
                <AlertsList />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Droplet className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Smarta Landlord</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}

export default App;