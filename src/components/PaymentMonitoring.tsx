import React, { useState, useEffect } from 'react';
import { Calendar, Download, Plus, Smartphone, CreditCard, Banknote, CheckCircle, Clock, XCircle, AlertCircle, Eye, Search, Filter } from 'lucide-react';
import { paymentsApi, billingApi } from '../services/api';
import type { Payment, Billing, PaymentStats } from '../types';

const PaymentMonitoring = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bills, setBills] = useState<Billing[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Billing | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, billsData, statsData] = await Promise.all([
        paymentsApi.getAll(),
        billingApi.getPending(),
        paymentsApi.getStats()
      ]);
      setPayments(paymentsData);
      setBills(billsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'mpesa':
        return <Smartphone className="h-4 w-4 text-green-600" />;
      case 'bank_transfer':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'cash':
        return <Banknote className="h-4 w-4 text-gray-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.payment_status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      payment.tenant?.unit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tenant?.property?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount: number) => `KSh ${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading payments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        Error loading payments: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Monitoring</h2>
        <div className="flex items-center space-x-4">
          <select
            className="border rounded-md px-3 py-2"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
          <button
            onClick={() => setShowCreateBillModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Bill</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats ? formatCurrency(stats.totalRevenue) : 'KSh 0'}
          </p>
          <p className="mt-1 text-sm text-gray-500">All time</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Pending Payments</h3>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            {stats ? formatCurrency(stats.pendingPayments) : 'KSh 0'}
          </p>
          <p className="mt-1 text-sm text-gray-500">{bills.length} pending bills</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">This Month</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats ? formatCurrency(stats.completedPayments) : 'KSh 0'}
          </p>
          <p className="mt-1 text-sm text-gray-500">Completed payments</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Average Payment</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats ? formatCurrency(stats.averagePayment) : 'KSh 0'}
          </p>
          <p className="mt-1 text-sm text-gray-500">Per transaction</p>
        </div>
      </div>

      {/* Pending Bills Section */}
      {bills.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Bills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bills.slice(0, 6).map((bill) => (
              <div key={bill.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{bill.tenant?.unit_number}</span>
                  <span className="text-sm text-gray-500">{bill.tenant?.property?.name}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(bill.total_amount || 0)}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  Due: {new Date(bill.due_date || '').toLocaleDateString()}
                </div>
                <button
                  onClick={() => {
                    setSelectedBill(bill);
                    setShowPaymentModal(true);
                  }}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Accept Payment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.tenant?.unit_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.tenant?.property?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getPaymentMethodIcon(payment.payment_method)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {payment.payment_method.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.payment_status)}
                        <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.payment_reference}
                      {payment.mpesa_transaction_id && (
                        <div className="text-xs text-gray-500">
                          M-Pesa: {payment.mpesa_transaction_id}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <PaymentModal
          bill={selectedBill}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBill(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedBill(null);
            loadData();
          }}
        />
      )}

      {/* Create Bill Modal */}
      {showCreateBillModal && (
        <CreateBillModal
          onClose={() => setShowCreateBillModal(false)}
          onSuccess={() => {
            setShowCreateBillModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Payment Modal Component
interface PaymentModalProps {
  bill: Billing;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal = ({ bill, onClose, onSuccess }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash' | 'bank_transfer'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (paymentMethod === 'mpesa') {
        // Initiate M-Pesa payment
        const paymentRequest = {
          tenant_id: bill.tenant_id,
          billing_id: bill.id,
          amount: bill.total_amount || 0,
          phone_number: phoneNumber,
          account_reference: `BILL_${bill.id.slice(-8)}`,
          transaction_desc: `Water bill payment for ${bill.tenant?.unit_number}`
        };

        await paymentsApi.initiateMpesaPayment(paymentRequest);
        alert('M-Pesa payment initiated. Please check your phone for the payment prompt.');
      } else {
        // Create manual payment
        const paymentData = {
          billing_id: bill.id,
          tenant_id: bill.tenant_id,
          amount: bill.total_amount || 0,
          payment_method: paymentMethod,
          payment_reference: `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        };

        await paymentsApi.createManual(paymentData);
        alert('Payment recorded successfully.');
      }

      onSuccess();
    } catch (error: any) {
      alert(`Error processing payment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Accept Payment</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Bill for: {bill.tenant?.unit_number}</p>
          <p className="text-sm text-gray-600">Property: {bill.tenant?.property?.name}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            KSh {(bill.total_amount || 0).toLocaleString()}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="mpesa">M-Pesa</option>
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        {paymentMethod === 'mpesa' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="07xxxxxxxx or +254xxxxxxxx"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading || (paymentMethod === 'mpesa' && !phoneNumber)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Process Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Bill Modal Component
interface CreateBillModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateBillModal = ({ onClose, onSuccess }: CreateBillModalProps) => {
  // This would contain form for creating new bills
  // For now, just a placeholder
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Generate Bill</h3>
        <p className="text-gray-600 mb-4">
          Bill generation feature coming soon. This will automatically generate bills based on meter readings.
        </p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentMonitoring;