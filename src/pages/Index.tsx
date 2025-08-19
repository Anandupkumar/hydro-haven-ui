import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Users, Package } from "lucide-react";
import waterBottleHero from "@/assets/water-bottle-hero.jpg";

const Index = () => {
  const { isAuthenticated, user, vendor, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (vendor) {
        navigate('/vendor');
      } else if (user) {
        navigate('/user');
      }
    }
  }, [isAuthenticated, user, vendor, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
        <div className="text-center">
          <Droplets className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-card h-64 md:h-80 mx-4 mt-8">
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
              AquaFlow
              <span className="block text-2xl md:text-3xl font-normal opacity-90">
                Pure Water Delivered Fresh
              </span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              Crystal clear, mineral-rich water delivered right to your doorstep
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card text-center">
            <CardHeader>
              <Droplets className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Pure Water</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Premium quality water sourced from natural springs and purified to perfection
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardHeader>
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Quick and reliable delivery service to your home or office
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Trusted Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Serving thousands of satisfied customers with quality and care
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-primary-deep">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of customers who trust AquaFlow for their daily water needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="flow" 
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-3"
            >
              <Droplets className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-3"
            >
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
