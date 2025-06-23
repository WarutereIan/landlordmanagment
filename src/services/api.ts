import { supabase } from '../lib/supabase';
import type { 
  Property, 
  Tenant, 
  Meter, 
  MeterReading, 
  Billing,
  Payment,
  MpesaTransaction,
  PaymentRequest,
  PaymentStats,
  CreatePropertyData, 
  CreateTenantData, 
  CreateMeterData, 
  CreateReadingData,
  CreatePaymentData,
  CreateBillingData
} from '../types';

// Properties API
export const propertiesApi = {
  // Get all properties for the current landlord
  async getAll(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get property by ID
  async getById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new property
  async create(propertyData: CreatePropertyData): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update property
  async update(id: string, updates: Partial<CreatePropertyData>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete property
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Tenants API
export const tenantsApi = {
  // Get all tenants with property information
  async getAll(): Promise<Tenant[]> {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        property:properties(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get tenants by property ID
  async getByPropertyId(propertyId: string): Promise<Tenant[]> {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        property:properties(*)
      `)
      .eq('property_id', propertyId)
      .order('unit_number');

    if (error) throw error;
    return data || [];
  },

  // Create new tenant
  async create(tenantData: CreateTenantData): Promise<Tenant> {
    const { data, error } = await supabase
      .from('tenants')
      .insert([tenantData])
      .select(`
        *,
        property:properties(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update tenant
  async update(id: string, updates: Partial<CreateTenantData>): Promise<Tenant> {
    const { data, error } = await supabase
      .from('tenants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        property:properties(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete tenant
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Meters API
export const metersApi = {
  // Get all meters with property and tenant information
  async getAll(): Promise<Meter[]> {
    const { data, error } = await supabase
      .from('meters')
      .select(`
        *,
        property:properties(*),
        tenant:tenants(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get meters by property ID
  async getByPropertyId(propertyId: string): Promise<Meter[]> {
    const { data, error } = await supabase
      .from('meters')
      .select(`
        *,
        property:properties(*),
        tenant:tenants(*)
      `)
      .eq('property_id', propertyId)
      .order('meter_number');

    if (error) throw error;
    return data || [];
  },

  // Get available meters (not assigned to tenants)
  async getAvailable(): Promise<Meter[]> {
    const { data, error } = await supabase
      .from('meters')
      .select(`
        *,
        property:properties(*)
      `)
      .is('tenant_id', null)
      .eq('status', 'available')
      .order('meter_number');

    if (error) throw error;
    return data || [];
  },

  // Create new meter
  async create(meterData: CreateMeterData): Promise<Meter> {
    const { data, error } = await supabase
      .from('meters')
      .insert([meterData])
      .select(`
        *,
        property:properties(*),
        tenant:tenants(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update meter
  async update(id: string, updates: Partial<CreateMeterData>): Promise<Meter> {
    const { data, error } = await supabase
      .from('meters')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        property:properties(*),
        tenant:tenants(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Assign meter to tenant
  async assignToTenant(meterId: string, tenantId: string): Promise<Meter> {
    const { data, error } = await supabase
      .from('meters')
      .update({ 
        tenant_id: tenantId, 
        status: 'active', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', meterId)
      .select(`
        *,
        property:properties(*),
        tenant:tenants(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Unassign meter from tenant
  async unassignFromTenant(meterId: string): Promise<Meter> {
    const { data, error } = await supabase
      .from('meters')
      .update({ 
        tenant_id: null, 
        status: 'available', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', meterId)
      .select(`
        *,
        property:properties(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete meter
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('meters')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Meter Readings API
export const meterReadingsApi = {
  // Get readings for a specific meter
  async getByMeterId(meterId: string): Promise<MeterReading[]> {
    const { data, error } = await supabase
      .from('meter_readings')
      .select(`
        *,
        meter:meters(*)
      `)
      .eq('meter_id', meterId)
      .order('reading_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get recent readings (last 30 days)
  async getRecent(): Promise<MeterReading[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('meter_readings')
      .select(`
        *,
        meter:meters(
          *,
          property:properties(*),
          tenant:tenants(*)
        )
      `)
      .gte('reading_date', thirtyDaysAgo.toISOString())
      .order('reading_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create new meter reading
  async create(readingData: CreateReadingData): Promise<MeterReading> {
    // Get the previous reading to calculate consumption
    const { data: prevReading } = await supabase
      .from('meter_readings')
      .select('reading_value')
      .eq('meter_id', readingData.meter_id)
      .order('reading_date', { ascending: false })
      .limit(1)
      .single();

    const newReading = {
      ...readingData,
      previous_reading: prevReading?.reading_value || 0
    };

    const { data, error } = await supabase
      .from('meter_readings')
      .insert([newReading])
      .select(`
        *,
        meter:meters(*)
      `)
      .single();

    if (error) throw error;

    // Update the meter's last reading
    await supabase
      .from('meters')
      .update({
        last_reading_value: readingData.reading_value,
        last_reading_date: readingData.reading_date
      })
      .eq('id', readingData.meter_id);

    return data;
  }
};

// Billing API
export const billingApi = {
  // Get all bills
  async getAll(): Promise<Billing[]> {
    const { data, error } = await supabase
      .from('billing')
      .select(`
        *,
        tenant:tenants(
          *,
          property:properties(*)
        ),
        meter:meters(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get bills by tenant ID
  async getByTenantId(tenantId: string): Promise<Billing[]> {
    const { data, error } = await supabase
      .from('billing')
      .select(`
        *,
        tenant:tenants(
          *,
          property:properties(*)
        ),
        meter:meters(*)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get pending bills
  async getPending(): Promise<Billing[]> {
    const { data, error } = await supabase
      .from('billing')
      .select(`
        *,
        tenant:tenants(
          *,
          property:properties(*)
        ),
        meter:meters(*)
      `)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create new bill
  async create(billingData: CreateBillingData): Promise<Billing> {
    // Calculate total amount
    const waterCharges = billingData.water_consumption * billingData.rate_per_unit;
    const totalAmount = waterCharges + billingData.service_charges;

    const billData = {
      ...billingData,
      water_charges: waterCharges,
      total_amount: totalAmount,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('billing')
      .insert([billData])
      .select(`
        *,
        tenant:tenants(
          *,
          property:properties(*)
        ),
        meter:meters(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Update bill
  async update(id: string, updates: Partial<CreateBillingData>): Promise<Billing> {
    const { data, error } = await supabase
      .from('billing')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        tenant:tenants(
          *,
          property:properties(*)
        ),
        meter:meters(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }
};

// Payments API
export const paymentsApi = {
  // Get all payments
  async getAll(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        billing:billing(
          *,
          tenant:tenants(
            *,
            property:properties(*)
          )
        ),
        tenant:tenants(
          *,
          property:properties(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get payments by tenant ID
  async getByTenantId(tenantId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        billing:billing(*),
        tenant:tenants(
          *,
          property:properties(*)
        )
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get payment statistics
  async getStats(): Promise<PaymentStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalRevenueResult,
      pendingPaymentsResult,
      completedPaymentsResult,
      recentPaymentsResult
    ] = await Promise.all([
      supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'completed'),
      supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'pending'),
      supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'completed')
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase
        .from('payments')
        .select('amount')
        .gte('created_at', thirtyDaysAgo.toISOString())
    ]);

    const totalRevenue = totalRevenueResult.data?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const pendingAmount = pendingPaymentsResult.data?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const completedThisMonth = completedPaymentsResult.data?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalTransactions = recentPaymentsResult.data?.length || 0;
    const averagePayment = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalRevenue,
      pendingPayments: pendingAmount,
      completedPayments: completedThisMonth,
      averagePayment,
      monthlyGrowth: 0, // Calculate based on previous month comparison
      totalTransactions
    };
  },

  // Initiate M-Pesa payment
  async initiateMpesaPayment(paymentRequest: PaymentRequest): Promise<any> {
    const { data, error } = await supabase.functions.invoke('mpesa-payment/initiate', {
      body: paymentRequest
    });

    if (error) throw error;
    return data;
  },

  // Check payment status
  async checkPaymentStatus(paymentId: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('mpesa-payment/status', {
      body: { payment_id: paymentId }
    });

    if (error) throw error;
    return data;
  },

  // Create manual payment
  async createManual(paymentData: CreatePaymentData): Promise<Payment> {
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        ...paymentData,
        payment_status: 'completed',
        confirmed_at: new Date().toISOString()
      }])
      .select(`
        *,
        billing:billing(*),
        tenant:tenants(
          *,
          property:properties(*)
        )
      `)
      .single();

    if (error) throw error;

    // Update billing status
    await supabase
      .from('billing')
      .update({
        status: 'paid',
        paid_date: new Date().toISOString()
      })
      .eq('id', paymentData.billing_id);

    return data;
  }
};

// Dashboard Statistics API
export const dashboardApi = {
  async getStats() {
    const [
      propertiesResult,
      tenantsResult,
      metersResult,
      recentReadingsResult,
      paymentsResult
    ] = await Promise.all([
      supabase.from('properties').select('id'),
      supabase.from('tenants').select('id, status').eq('status', 'active'),
      supabase.from('meters').select('id, status'),
      supabase.from('meter_readings').select('*').order('reading_date', { ascending: false }).limit(10),
      supabase.from('payments').select('amount, payment_status').eq('payment_status', 'completed')
    ]);

    const totalRevenue = paymentsResult.data?.reduce((sum, p) => sum + p.amount, 0) || 0;

    return {
      totalProperties: propertiesResult.data?.length || 0,
      activeTenants: tenantsResult.data?.length || 0,
      totalMeters: metersResult.data?.length || 0,
      activeMeters: metersResult.data?.filter(m => m.status === 'active').length || 0,
      recentReadings: recentReadingsResult.data || [],
      totalRevenue
    };
  }
}; 