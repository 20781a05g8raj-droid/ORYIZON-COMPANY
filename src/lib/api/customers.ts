import { supabase } from '@/lib/supabase';
import type { Customer } from '@/types/database';

export interface CustomerStats {
    totalCustomers: number;
    activeCustomers: number;
    newThisMonth: number;
    avgLifetimeValue: number;
}

// Get all customers with their stats
export async function getCustomers(): Promise<(Customer & { order_count: number; total_spent: number; last_order_date: string | null })[]> {
    const { data: customers, error } = await supabase
        .from('customers')
        .select('*');

    if (error) throw error;

    if (!customers) return [];

    // For each customer, get their order stats
    // Note: In a larger app, this should be a join or a view, but for now we'll fetch orders separately or aggregate
    const customersWithStats = await Promise.all((customers as Customer[]).map(async (customer) => {
        const { data: orders } = await supabase
            .from('orders')
            .select('total, created_at')
            .eq('customer_id', customer.id) // Assuming customer_id links to customers table. 
        // Wait, in orders table definition, customer_id is a string, and customers table has id.
        // Let's verify if orders.customer_email links to customers.email or if there is a foreign key.
        // Looking at types/database.ts, orders has customer_id likely linking to auth.users or customers table. 
        // Since we created customers table, we should use that.

        // Actually, let's look at how orders are created. 
        // logic in src/lib/api/orders.ts: getOrCreateCustomer uses email.

        const { data: customerOrders, error: ordersError } = await supabase
            .from('orders')
            .select('total, created_at')
            .eq('customer_email', customer.email); // Link by email for robustness if id is missing

        if (ordersError) {
            console.error('Error fetching orders for customer', customer.email, ordersError);
            return { ...customer, order_count: 0, total_spent: 0, last_order_date: null };
        }

        const orderData = (customerOrders || []) as Array<{ total: number; created_at: string }>;
        const totalSpent = orderData.reduce((sum, order) => sum + (order.total || 0), 0);
        const orderCount = orderData.length;

        // Find last order date
        let lastOrderDate = null;
        if (orderData.length > 0) {
            orderData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            lastOrderDate = orderData[0].created_at;
        }

        return {
            ...customer,
            order_count: orderCount,
            total_spent: totalSpent,
            last_order_date: lastOrderDate
        };
    }));

    return customersWithStats;
}

export async function getCustomerStats(): Promise<CustomerStats> {
    const { data: customers, error } = await supabase
        .from('customers')
        .select('created_at');

    if (error) throw error;

    const customerData = (customers || []) as Array<{ created_at: string }>;
    const totalCustomers = customerData.length;

    // Calculate new this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = customerData.filter(c => new Date(c.created_at) >= startOfMonth).length;

    // For avg lifetime value, we need total revenue
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total');

    if (ordersError) throw ordersError;

    const orderData = (orders || []) as Array<{ total: number }>;
    const totalRevenue = orderData.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgLifetimeValue = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

    return {
        totalCustomers,
        activeCustomers: totalCustomers, // Assuming all in table are active for now
        newThisMonth,
        avgLifetimeValue
    };
}
