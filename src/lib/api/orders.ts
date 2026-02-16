import { supabase } from '@/lib/supabase';
import type { Order, OrderInsert, OrderUpdate, OrderItem, OrderItemInsert, Customer, CustomerInsert } from '@/types/database';

// Generate order number
export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORY-${timestamp}-${random}`;
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
    }
    return data;
}

// Get order items
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

    if (error) throw error;
    return data || [];
}

// Create order with items
export async function createOrder(
    order: Omit<OrderInsert, 'order_number'>,
    items: Omit<OrderItemInsert, 'order_id'>[]
): Promise<Order> {
    const orderNumber = generateOrderNumber();

    // Create the order
    console.log('Creating order with payload:', JSON.stringify(order));
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({ ...order, order_number: orderNumber } as any)
        .select()
        .single();

    if (orderError) throw orderError;

    // Sanitize order items to strict schema (prevent variant_id errors)
    const orderItems = items.map(item => ({
        order_id: (orderData as any).id,
        product_id: item.product_id,
        product_name: item.product_name,
        variant_name: item.variant_name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as any);

    if (itemsError) throw itemsError;

    return orderData as Order;
}

// Update order status
export async function updateOrderStatus(id: string, status: string): Promise<Order> {
    const { data, error } = await (supabase as any)
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Order;
}

// Update order
export async function updateOrder(id: string, order: OrderUpdate): Promise<Order> {
    const { data, error } = await (supabase as any)
        .from('orders')
        .update(order)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Order;
}

// Get orders by status
export async function getOrdersByStatus(status: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

// Get customer or create new
export async function getOrCreateCustomer(customer: CustomerInsert): Promise<Customer> {
    // Check if customer exists by email
    const { data: existing } = await supabase
        .from('customers')
        .select('*')
        .eq('email', customer.email)
        .single();

    if (existing) {
        return existing;
    }

    // Create new customer (Guest or Registered will be handled by trigger if auth.uid is present, 
    // but here we just insert the basic info. The trigger might try to update user_id if valid)

    const safePayload = {
        email: customer.email,
        name: customer.name ?? null,
        phone: customer.phone ?? null,
        address: customer.address ?? null,
        city: customer.city ?? null,
        state: customer.state ?? null,
        pincode: customer.pincode ?? null
        // user_id will be null for guests, or linked via trigger if logged in
    };

    console.log('Creating customer with payload:', JSON.stringify(safePayload));

    // Create new customer
    const { data, error } = await supabase
        .from('customers')
        .insert(safePayload as any)
        .select()
        .single();

    if (error) {
        console.error('Error creating customer:', error);
        throw error;
    }

    return data as Customer;
}

// Get order statistics
export async function getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
}> {
    const { data, error } = await supabase
        .from('orders')
        .select('status');

    if (error) throw error;

    const orders = (data || []) as Array<{ status: string }>;
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    return stats;
}

// Delete order
export async function deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
