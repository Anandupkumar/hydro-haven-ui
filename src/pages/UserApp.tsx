import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaterProductCard } from "@/components/WaterProductCard";
import { OrderStatusTracker } from "@/components/OrderStatusTracker";
import { Header } from "@/components/Header";
import { Droplets, ShoppingCart, Clock, MapPin, Phone, User, Package, Settings, LogOut } from "lucide-react";
import waterBottleHero from "@/assets/water-bottle-hero.jpg";
import waterContainers from "@/assets/water-containers.jpg";

interface UserAppProps {
  onLogout: () => void;
}

// Mock data
const waterProducts = [
  { id: "1", name: "Pure Spring Water", size: "5L", price: 25, available: true },
  { id: "2", name: "Mineral Water", size: "10L", price: 45, available: true },
  { id: "3", name: "Premium Water", size: "20L", price: 80, available: true },
  { id: "4", name: "Alkaline Water", size: "5L", price: 35, available: false },
];

const mockOrders = [
  {
    id: "ORD-001",
    status: "arriving" as const,
    timestamp: "2 hours ago",
    estimatedDelivery: "Today, 4:00 PM",
    items: [{ name: "Pure Spring Water", size: "5L", quantity: 2 }],
    total: 50
  },
  {
    id: "ORD-002", 
    status: "delivered" as const,
    timestamp: "Yesterday",
    estimatedDelivery: "",
    items: [{ name: "Mineral Water", size: "10L", quantity: 1 }],
    total: 45
  }
];

export const UserApp = ({ onLogout }: UserAppProps) => {
  const [cartItems, setCartItems] = useState<Array<{id: string, quantity: number}>>([]);
  const [activeTab, setActiveTab] = useState("products");

  const handleAddToOrder = (productId: string, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productId);
      if (existingItem) {
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: productId, quantity }];
    });
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <Header 
        userName="Priya Sharma"
        onProfileClick={() => setActiveTab("profile")}
        onCartClick={() => setActiveTab("orders")}
        cartItemCount={totalCartItems}
      />
      
      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl glass-card h-64 md:h-80">
          <div className="absolute inset-0">
            <img 
              src={waterBottleHero} 
              alt="Pure water delivery" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 ocean-gradient opacity-80"></div>
          </div>
          <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                Pure Water
                <span className="block text-2xl md:text-3xl font-normal opacity-90">
                  Delivered Fresh
                </span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                Crystal clear, mineral-rich water delivered right to your doorstep
              </p>
              <Button 
                variant="glass" 
                size="lg"
                onClick={() => setActiveTab("products")}
                className="text-white border-white/30 hover:bg-white/20"
              >
                <Droplets className="w-5 h-5 mr-2" />
                Order Now
              </Button>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {waterProducts.map((product) => (
                <WaterProductCard
                  key={product.id}
                  {...product}
                  onAddToOrder={handleAddToOrder}
                />
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid gap-6">
              {mockOrders.map((order) => (
                <OrderStatusTracker key={order.id} order={order} />
              ))}
            </div>
            
            {mockOrders.length === 0 && (
              <Card className="glass-card text-center py-12">
                <CardContent>
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">Start by ordering some fresh water</p>
                  <Button 
                    variant="flow" 
                    onClick={() => setActiveTab("products")}
                  >
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-primary-deep">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-primary-deep">Name</label>
                    <p className="text-sm text-muted-foreground">Priya Sharma</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary-deep">Phone</label>
                    <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-primary-deep">Delivery Address</label>
                    <p className="text-sm text-muted-foreground">
                      123 Green Valley Apartments, Sector 15, New Delhi, 110001
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};