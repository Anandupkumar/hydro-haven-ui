import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";
import { apiClient, Product, Order } from "@/services/api";
import waterBottleHero from "@/assets/water-bottle-hero.jpg";
import waterContainers from "@/assets/water-containers.jpg";

export const UserApp = () => {
  const [cartItems, setCartItems] = useState<Array<{id: string, quantity: number}>>([]);
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, ordersData] = await Promise.all([
        apiClient.getVendorProducts(),
        apiClient.getUserOrders()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        userName={user?.name || "User"}
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <WaterProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    size={product.size}
                    price={product.price}
                    available={product.stock_quantity > 0}
                    onAddToOrder={handleAddToOrder}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading orders...</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <OrderStatusTracker 
                      key={order.id} 
                      order={{
                        id: order.order_number,
                        status: order.status,
                        timestamp: new Date(order.created_at).toLocaleDateString(),
                        estimatedDelivery: order.status === 'delivered' ? '' : 'Today, 4:00 PM',
                        items: order.items.map(item => ({
                          name: item.product_name || 'Product',
                          size: item.product_size || 'Standard',
                          quantity: item.quantity
                        })),
                        total: order.total_amount
                      }} 
                    />
                  ))}
                </div>
                
                {orders.length === 0 && (
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
              </>
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
                    <p className="text-sm text-muted-foreground">{user?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-primary-deep">Phone</label>
                    <p className="text-sm text-muted-foreground">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-primary-deep">Delivery Address</label>
                    <p className="text-sm text-muted-foreground">
                      {user?.address || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Edit Profile
                  </Button>
                  <Button variant="destructive" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};