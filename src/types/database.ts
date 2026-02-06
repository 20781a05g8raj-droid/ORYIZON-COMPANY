// Database types for Supabase
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    short_description: string | null
                    price: number
                    original_price: number | null
                    category: string
                    in_stock: boolean
                    featured: boolean
                    images: string[]
                    benefits: string[]
                    ingredients: string[]
                    how_to_use: string | null
                    certifications: string[]
                    rating: number
                    review_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    short_description?: string | null
                    price: number
                    original_price?: number | null
                    category?: string
                    in_stock?: boolean
                    featured?: boolean
                    images?: string[]
                    benefits?: string[]
                    ingredients?: string[]
                    how_to_use?: string | null
                    certifications?: string[]
                    rating?: number
                    review_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    short_description?: string | null
                    price?: number
                    original_price?: number | null
                    category?: string
                    in_stock?: boolean
                    featured?: boolean
                    images?: string[]
                    benefits?: string[]
                    ingredients?: string[]
                    how_to_use?: string | null
                    certifications?: string[]
                    rating?: number
                    review_count?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            product_variants: {
                Row: {
                    id: string
                    product_id: string
                    name: string
                    price: number
                    original_price: number | null
                    in_stock: boolean
                    sku: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    name: string
                    price: number
                    original_price?: number | null
                    in_stock?: boolean
                    sku?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    name?: string
                    price?: number
                    original_price?: number | null
                    in_stock?: boolean
                    sku?: string | null
                    created_at?: string
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    excerpt: string | null
                    content: string | null
                    image: string | null
                    icon: string
                    author: string
                    category: string
                    tags: string[]
                    featured: boolean
                    published: boolean
                    date: string
                    read_time: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    excerpt?: string | null
                    content?: string | null
                    image?: string | null
                    icon?: string
                    author?: string
                    category?: string
                    tags?: string[]
                    featured?: boolean
                    published?: boolean
                    date?: string
                    read_time?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    excerpt?: string | null
                    content?: string | null
                    image?: string | null
                    icon?: string
                    author?: string
                    category?: string
                    tags?: string[]
                    featured?: boolean
                    published?: boolean
                    date?: string
                    read_time?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            faqs: {
                Row: {
                    id: string
                    question: string
                    answer: string
                    category: string
                    sort_order: number
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    question: string
                    answer: string
                    category?: string
                    sort_order?: number
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    question?: string
                    answer?: string
                    category?: string
                    sort_order?: number
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            customers: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    phone: string | null
                    address: string | null
                    city: string | null
                    state: string | null
                    pincode: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    phone?: string | null
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    phone?: string | null
                    address?: string | null
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    customer_id: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone: string | null
                    shipping_address: string
                    city: string | null
                    state: string | null
                    pincode: string | null
                    subtotal: number
                    discount: number
                    shipping: number
                    total: number
                    coupon_code: string | null
                    status: string
                    payment_method: string
                    payment_status: string
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_number: string
                    customer_id?: string | null
                    customer_name: string
                    customer_email: string
                    customer_phone?: string | null
                    shipping_address: string
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    subtotal: number
                    discount?: number
                    shipping?: number
                    total: number
                    coupon_code?: string | null
                    status?: string
                    payment_method?: string
                    payment_status?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_number?: string
                    customer_id?: string | null
                    customer_name?: string
                    customer_email?: string
                    customer_phone?: string | null
                    shipping_address?: string
                    city?: string | null
                    state?: string | null
                    pincode?: string | null
                    subtotal?: number
                    discount?: number
                    shipping?: number
                    total?: number
                    coupon_code?: string | null
                    status?: string
                    payment_method?: string
                    payment_status?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string | null
                    product_name: string
                    variant_name: string | null
                    quantity: number
                    price: number
                    total: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id?: string | null
                    product_name: string
                    variant_name?: string | null
                    quantity?: number
                    price: number
                    total: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string | null
                    product_name?: string
                    variant_name?: string | null
                    quantity?: number
                    price?: number
                    total?: number
                    created_at?: string
                }
            }
            coupons: {
                Row: {
                    id: string
                    code: string
                    description: string | null
                    discount_type: string
                    discount_value: number
                    min_order: number
                    max_uses: number | null
                    used_count: number
                    active: boolean
                    starts_at: string | null
                    expires_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    description?: string | null
                    discount_type?: string
                    discount_value: number
                    min_order?: number
                    max_uses?: number | null
                    used_count?: number
                    active?: boolean
                    starts_at?: string | null
                    expires_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    description?: string | null
                    discount_type?: string
                    discount_value?: number
                    min_order?: number
                    max_uses?: number | null
                    used_count?: number
                    active?: boolean
                    starts_at?: string | null
                    expires_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    phone: string | null
                    subject: string | null
                    message: string
                    status: string
                    replied: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    phone?: string | null
                    subject?: string | null
                    message: string
                    status?: string
                    replied?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    subject?: string | null
                    message?: string
                    status?: string
                    replied?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            newsletter_subscribers: {
                Row: {
                    id: string
                    email: string
                    subscribed: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    subscribed?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    subscribed?: boolean
                    created_at?: string
                }
            }
            testimonials: {
                Row: {
                    id: string
                    name: string
                    location: string | null
                    rating: number
                    comment: string
                    image: string | null
                    verified: boolean
                    featured: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    location?: string | null
                    rating?: number
                    comment: string
                    image?: string | null
                    verified?: boolean
                    featured?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    location?: string | null
                    rating?: number
                    comment?: string
                    image?: string | null
                    verified?: boolean
                    featured?: boolean
                    created_at?: string
                }
            }
            banners: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    image_url: string
                    link: string | null
                    active: boolean
                    sort_order: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    image_url: string
                    link?: string | null
                    active?: boolean
                    sort_order?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    image_url?: string
                    link?: string | null
                    active?: boolean
                    sort_order?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            campaigns: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    start_date: string | null
                    end_date: string | null
                    active: boolean
                    discount_percentage: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    active?: boolean
                    discount_percentage?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    active?: boolean
                    discount_percentage?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            product_reviews: {
                Row: {
                    id: string
                    product_id: string
                    user_id: string | null
                    user_name: string
                    rating: number
                    comment: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    user_id?: string | null
                    user_name: string
                    rating: number
                    comment: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    user_id?: string | null
                    user_name?: string
                    rating?: number
                    comment?: string
                    created_at?: string
                }
            }
        }
    }
}

// Helper types for easier usage
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']
export type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update']

export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update']

export type FAQ = Database['public']['Tables']['faqs']['Row']
export type FAQInsert = Database['public']['Tables']['faqs']['Insert']
export type FAQUpdate = Database['public']['Tables']['faqs']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

export type Coupon = Database['public']['Tables']['coupons']['Row']
export type CouponInsert = Database['public']['Tables']['coupons']['Insert']
export type CouponUpdate = Database['public']['Tables']['coupons']['Update']

export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert']

export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row']

export type Testimonial = Database['public']['Tables']['testimonials']['Row']

export type Banner = Database['public']['Tables']['banners']['Row']
export type BannerInsert = Database['public']['Tables']['banners']['Insert']
export type BannerUpdate = Database['public']['Tables']['banners']['Update']

export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert']
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update']

// Product with variants
export type ProductWithVariants = Product & {
    product_variants: ProductVariant[]
}
