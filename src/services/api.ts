const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface User {
  id: number;
  phone: string;
  name: string;
  email: string;
  address: string;
  vendor_id: number;
}

export interface Vendor {
  id: number;
  phone: string;
  name: string;
  business_name: string;
  email: string;
  address: string;
  status: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  size: string;
  price: number;
  stock_quantity: number;
  vendor_id: number;
  status: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  vendor_id: number;
  status: string;
  total_amount: number;
  delivery_address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  customer_name?: string;
  vendor_name?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name?: string;
  product_size?: string;
}

export interface VendorStats {
  totalOrders: number;
  activeCustomers: number;
  todayDeliveries: number;
  revenue: number;
}

// API Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async sendOTP(phone: string, type: 'user' | 'vendor'): Promise<{ message: string; otp?: string }> {
    const endpoint = type === 'vendor' ? '/auth/vendor-send-otp' : '/auth/send-otp';
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, otp: string, type: 'user' | 'vendor'): Promise<{ 
    message: string; 
    token: string; 
    user?: User; 
    vendor?: Vendor; 
  }> {
    const endpoint = type === 'vendor' ? '/auth/vendor-login' : '/auth/verify-otp';
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });

    // Store token
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    
    return response;
  }

  // User methods
  async getUserProfile(): Promise<User> {
    return this.request('/users/profile');
  }

  async getUserOrders(): Promise<Order[]> {
    return this.request('/orders/my-orders');
  }

  async getVendorProducts(): Promise<Product[]> {
    return this.request('/products/my-vendor');
  }

  // Vendor methods
  async getVendorProfile(): Promise<Vendor> {
    return this.request('/vendors/profile');
  }

  async getVendorDashboard(): Promise<VendorStats> {
    const response = await this.request('/vendors/dashboard');
    return {
      totalOrders: response.totalOrders || 0,
      activeCustomers: response.activeCustomers || 0,
      todayDeliveries: response.todayDeliveries || 0,
      revenue: response.totalRevenue || 0,
    };
  }

  async getVendorOrders(): Promise<Order[]> {
    return this.request('/orders/vendor-orders');
  }

  async getVendorCustomers(): Promise<User[]> {
    return this.request('/users/vendor-customers');
  }

  async updateOrderStatus(orderId: number, status: string): Promise<{ message: string }> {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async registerCustomer(phone: string, name?: string, email?: string, address?: string): Promise<{ message: string; user: User }> {
    return this.request('/auth/register-user', {
      method: 'POST',
      body: JSON.stringify({ phone, name, email, address }),
    });
  }

  // Utility methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);


