import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Users, 
  Package, 
  TrendingUp, 
  Search, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient, VendorStats, Order, User } from "@/services/api";

const statusIcons = {
  booked: Package,
  processing: Clock,
  arriving: Truck,
  delivered: CheckCircle
};

export const VendorDashboard = () => {
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorStats, setVendorStats] = useState<VendorStats>({
    totalOrders: 0,
    activeCustomers: 0,
    todayDeliveries: 0,
    revenue: 0
  });
  const [customers, setCustomers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { vendor, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!vendor) {
      navigate('/login');
      return;
    }
    loadData();
  }, [vendor, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsData, customersData, ordersData] = await Promise.all([
        apiClient.getVendorDashboard(),
        apiClient.getVendorCustomers(),
        apiClient.getVendorOrders()
      ]);
      setVendorStats(statsData);
      setCustomers(customersData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (newCustomerPhone.trim()) {
      try {
        await apiClient.registerCustomer(newCustomerPhone);
        setNewCustomerPhone("");
        // Reload customers data
        const customersData = await apiClient.getVendorCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error('Error adding customer:', error);
      }
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.updateOrderStatus(parseInt(orderId), newStatus);
      // Reload orders data
      const ordersData = await apiClient.getVendorOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => 
    (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="glass-card border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-deep">Vendor Dashboard</h1>
              <p className="text-muted-foreground">Manage your water delivery business</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="ocean-gradient text-white border-none">
                Active Vendor
              </Badge>
              <Button variant="destructive" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card ripple-effect">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 ocean-gradient rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-primary-deep">{vendorStats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card ripple-effect">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 wave-gradient rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Customers</p>
                  <p className="text-2xl font-bold text-primary-deep">{vendorStats.activeCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card ripple-effect">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent rounded-lg">
                  <Truck className="h-6 w-6 text-primary-deep" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Deliveries</p>
                  <p className="text-2xl font-bold text-primary-deep">{vendorStats.todayDeliveries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card ripple-effect">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-primary-deep">₹{vendorStats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="glass-card grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary-deep">Recent Orders</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No orders found</h3>
                      <p className="text-muted-foreground">Orders will appear here when customers place them</p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                      return (
                        <Card key={order.id} className="border border-border/50 hover:border-primary/30 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                  <Badge variant="outline" className="text-xs">
                                    {order.order_number}
                                  </Badge>
                                  <h3 className="font-medium text-primary-deep">{order.customer_name || 'Unknown Customer'}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {order.delivery_address || 'Address not provided'}
                                </p>
                                <p className="text-sm">
                                  {order.items.map(item => 
                                    `${item.quantity}x ${item.product_name || 'Product'} (${item.product_size || 'Standard'})`
                                  ).join(', ')}
                                </p>
                              </div>
                              
                              <div className="text-right space-y-2">
                                <p className="font-semibold text-primary">₹{order.total_amount}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <StatusIcon className="h-4 w-4 text-primary" />
                                  <Badge 
                                    variant={order.status === "delivered" ? "default" : "secondary"}
                                    className={order.status === "delivered" ? "bg-green-500" : ""}
                                  >
                                    {order.status}
                                  </Badge>
                                </div>
                                {order.status !== "delivered" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => {
                                      const nextStatus = order.status === "booked" ? "processing" 
                                        : order.status === "processing" ? "arriving" 
                                        : "delivered";
                                      handleStatusUpdate(order.id.toString(), nextStatus);
                                    }}
                                  >
                                    Update Status
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary-deep">Add New Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="phone">Customer Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+91 XXXXX XXXXX"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddCustomer}
                    variant="flow"
                    className="mt-6"
                  >
                    Add Customer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary-deep">Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading customers...</p>
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No customers yet</h3>
                    <p className="text-muted-foreground">Customers will appear here when they register</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customers.map((customer) => (
                      <Card key={customer.id} className="border border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-medium text-primary-deep">{customer.name || 'Unknown Customer'}</h3>
                              <p className="text-sm text-muted-foreground">{customer.phone}</p>
                              <p className="text-sm text-muted-foreground">{customer.address || 'Address not provided'}</p>
                            </div>
                            <div className="text-right space-y-1">
                              <Badge variant="outline" className="ocean-gradient text-white border-none">
                                Active Customer
                              </Badge>
                              <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary-deep flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Business Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced analytics and reporting features will be available in the next update
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};