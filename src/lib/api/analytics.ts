import { supabase } from '@/lib/supabase';

export interface RevenueData {
    month: string;
    revenue: number;
    orders: number;
}

export interface TopProduct {
    name: string;
    sales: number;
    revenue: number;
}

export interface AnalyticsStats {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    newCustomers: number;
}

// Get revenue data for the last 6 months
export async function getRevenueData(): Promise<RevenueData[]> {
    const { data: orders, error } = await supabase
        .from('orders')
        .select('total, created_at')
        .order('created_at', { ascending: true });

    if (error) throw error;

    // Process data to group by month
    const months: Record<string, { revenue: number; orders: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = monthNames[d.getMonth()];
        months[monthKey] = { revenue: 0, orders: 0 };
    }

    const ordersData = (orders || []) as Array<{ total: number; created_at: string }>;
    ordersData.forEach(order => {
        const date = new Date(order.created_at);
        const monthKey = monthNames[date.getMonth()];
        if (months[monthKey]) {
            months[monthKey].revenue += order.total || 0;
            months[monthKey].orders += 1;
        }
    });

    return Object.entries(months).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders
    }));
}

// Get top products
export async function getTopProducts(): Promise<TopProduct[]> {
    const { data: items, error } = await supabase
        .from('order_items')
        .select('product_name, quantity, total');

    if (error) throw error;

    const productStats: Record<string, { sales: number; revenue: number }> = {};

    const itemsData = (items || []) as Array<{ product_name: string; quantity: number; total: number }>;
    itemsData.forEach(item => {
        if (!productStats[item.product_name]) {
            productStats[item.product_name] = { sales: 0, revenue: 0 };
        }
        productStats[item.product_name].sales += item.quantity;
        productStats[item.product_name].revenue += item.total;
    });

    return Object.entries(productStats)
        .map(([name, stats]) => ({
            name,
            sales: stats.sales,
            revenue: stats.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
}

// Get overall stats
export async function getAnalyticsStats(): Promise<AnalyticsStats> {
    // Get orders stats
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total');

    if (ordersError) throw ordersError;

    // Get customers stats
    const { count: customersCount, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

    if (customersError) throw customersError;

    const ordersData = (orders || []) as Array<{ total: number }>;
    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = ordersData.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    return {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        newCustomers: customersCount || 0
    };
}
