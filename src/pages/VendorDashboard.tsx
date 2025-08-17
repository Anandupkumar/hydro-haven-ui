import { useState } from "react";
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
  Truck
} from "lucide-react";

interface VendorDashboardProps {
  onLogout: () => void;
}

// Mock vendor data
const vendorStats = {
  totalOrders: 156,
  activeCustomers: 42,
  todayDeliveries: 8,
  revenue: 12500
};

const mockCustomers = [
  {
    id: "1",
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    address: "123 Green Valley Apartments, Sector 15",
    totalOrders: 15,
    lastOrder: "2 days ago",
    status: "active"
  },
  {
    id: "2", 
    name: "Raj Kumar",
    phone: "+91 87654 32109",
    address: "456 Blue Hills Society, Sector 22",
    totalOrders: 8,
    lastOrder: "1 week ago",
    status: "active"
  }
];

const mockOrders = [
  {
    id: "ORD-001",
    customer: "Priya Sharma",
    phone: "+91 98765 43210",
    items: "2x Pure Spring Water (5L)",
    amount: 50,
    status: "arriving",
    orderTime: "2 hours ago",
    address: "123 Green Valley Apartments"
  },
  {
    id: "ORD-002",
    customer: "Raj Kumar", 
    phone: "+91 87654 32109",
    items: "1x Mineral Water (10L)",
    amount: 45,
    status: "processing",
    orderTime: "4 hours ago",
    address: "456 Blue Hills Society"
  }
];

const statusIcons = {
  booked: Package,
  processing: Clock,
  arriving: Truck,
  delivered: CheckCircle
};

export const VendorDashboard = ({ onLogout }: VendorDashboardProps) => {
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddCustomer = () => {
    if (newCustomerPhone.trim()) {
      console.log("Adding customer:", newCustomerPhone);
      setNewCustomerPhone("");
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log("Updating order", orderId, "to", newStatus);
  };

  const filteredOrders = mockOrders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Badge variant="outline" className="ocean-gradient text-white border-none">
              Active Vendor
            </Badge>
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
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                    return (
                      <Card key={order.id} className="border border-border/50 hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="text-xs">
                                  {order.id}
                                </Badge>
                                <h3 className="font-medium text-primary-deep">{order.customer}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {order.phone}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {order.address}
                              </p>
                              <p className="text-sm">{order.items}</p>
                            </div>
                            
                            <div className="text-right space-y-2">
                              <p className="font-semibold text-primary">₹{order.amount}</p>
                              <p className="text-xs text-muted-foreground">{order.orderTime}</p>
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
                                    handleStatusUpdate(order.id, nextStatus);
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
                  })}
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
                <div className="space-y-4">
                  {mockCustomers.map((customer) => (
                    <Card key={customer.id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium text-primary-deep">{customer.name}</h3>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                            <p className="text-sm text-muted-foreground">{customer.address}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant="outline" className="ocean-gradient text-white border-none">
                              {customer.totalOrders} orders
                            </Badge>
                            <p className="text-xs text-muted-foreground">Last: {customer.lastOrder}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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