import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface WaterProductCardProps {
  id: string;
  name: string;
  size: string;
  price: number;
  image?: string;
  available: boolean;
  onAddToOrder: (id: string, quantity: number) => void;
}

export const WaterProductCard = ({ 
  id, 
  name, 
  size, 
  price, 
  image, 
  available, 
  onAddToOrder 
}: WaterProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToOrder = () => {
    onAddToOrder(id, quantity);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <Card className="glass-card hover:scale-105 water-flow group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-primary-deep">
            {name}
          </CardTitle>
          <Badge 
            variant={available ? "default" : "secondary"} 
            className={available ? "ocean-gradient text-white" : ""}
          >
            {available ? "Available" : "Out of Stock"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative h-32 bg-gradient-to-br from-primary/5 to-accent/10 rounded-lg flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Droplets className="w-full h-full text-primary" />
          </div>
          <div className="relative z-10 text-center">
            <Droplets className="w-12 h-12 text-primary mx-auto droplet-shadow animate-float" />
            <p className="text-sm font-medium text-primary-deep mt-2">{size}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            ₹{price}
          </div>
          
          {available && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={decrementQuantity}
                className="h-8 w-8 text-primary hover:bg-primary/10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={incrementQuantity}
                className="h-8 w-8 text-primary hover:bg-primary/10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddToOrder}
          disabled={!available}
          variant="flow"
          className="w-full"
        >
          <Droplets className="w-4 h-4 mr-2" />
          Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
};