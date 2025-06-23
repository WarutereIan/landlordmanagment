export interface Property {
  id: string;
  landlord_id?: string;
  name: string;
  address: string;
  property_type: 'residential' | 'commercial' | 'mixed';
  total_units: number;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  property_id: string;
  user_id?: string;
  unit_number: string;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  status: 'active' | 'inactive' | 'pending';
  phone_number?: string;
  email?: string;
  created_at: string;
  updated_at: string;
  property?: Property;
}

export interface Meter {
  id: string;
  property_id: string;
  tenant_id?: string;
  meter_number: string;
  meter_type: 'water' | 'electricity' | 'gas';
  location: string;
  installation_date: string;
  last_reading_date?: string;
  last_reading_value?: number;
  status: 'active' | 'inactive' | 'maintenance' | 'available';
  created_at: string;
  updated_at: string;
  property?: Property;
  tenant?: Tenant;
}

export interface MeterReading {
  id: string;
  meter_id: string;
  reading_value: number;
  reading_date: string;
  previous_reading?: number;
  consumption: number;
  recorded_by?: string;
  notes?: string;
  created_at: string;
  meter?: Meter;
}

export interface Billing {
  id: string;
  tenant_id: string;
  meter_id: string;
  billing_period_start: string;
  billing_period_end: string;
  water_consumption?: number;
  rate_per_unit: number;
  water_charges?: number;
  service_charges: number;
  total_amount?: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
  meter?: Meter;
}

// Payment-related types
export interface Payment {
  id: string;
  billing_id: string;
  tenant_id: string;
  amount: number;
  payment_method: 'mpesa' | 'bank_transfer' | 'cash';
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
  payment_reference: string;
  mpesa_transaction_id?: string;
  payment_date: string;
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
  billing?: Billing;
  tenant?: Tenant;
}

export interface MpesaTransaction {
  id: string;
  payment_id?: string;
  merchant_request_id: string;
  checkout_request_id: string;
  amount: number;
  phone_number: string;
  account_reference: string;
  transaction_desc: string;
  mpesa_receipt_number?: string;
  result_code?: number;
  result_desc?: string;
  transaction_date?: string;
  status: 'initiated' | 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface PaymentRequest {
  tenant_id: string;
  billing_id: string;
  amount: number;
  phone_number: string;
  account_reference: string;
  transaction_desc: string;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  averagePayment: number;
  monthlyGrowth: number;
  totalTransactions: number;
}

export interface CreatePropertyData {
  name: string;
  address: string;
  property_type: 'residential' | 'commercial' | 'mixed';
  total_units: number;
}

export interface CreateTenantData {
  property_id: string;
  unit_number: string;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  phone_number?: string;
  email?: string;
}

export interface CreateMeterData {
  property_id: string;
  tenant_id?: string;
  meter_number: string;
  meter_type: 'water' | 'electricity' | 'gas';
  location: string;
  installation_date: string;
}

export interface CreateReadingData {
  meter_id: string;
  reading_value: number;
  reading_date: string;
  notes?: string;
}

export interface CreatePaymentData {
  billing_id: string;
  tenant_id: string;
  amount: number;
  payment_method: 'mpesa' | 'bank_transfer' | 'cash';
  payment_reference: string;
  mpesa_transaction_id?: string;
}

export interface CreateBillingData {
  tenant_id: string;
  meter_id: string;
  billing_period_start: string;
  billing_period_end: string;
  water_consumption: number;
  rate_per_unit: number;
  service_charges: number;
  due_date: string;
} 