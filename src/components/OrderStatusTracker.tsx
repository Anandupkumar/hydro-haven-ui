import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Truck, Package } from "lucide-react";

interface OrderStatus {
  id: string;
  status: "booked" | "processing" | "arriving" | "delivered";
  timestamp: string;
  estimatedDelivery?: string;
}

interface OrderStatusTrackerProps {
  order: OrderStatus;
}

const statusConfig = {
  booked: { 
    label: "Order Booked", 
    icon: Package, 
    color: "bg-primary",
    description: "Your order has been received" 
  },
  processing: { 
    label: "Processing", 
    icon: Clock, 
    color: "bg-primary-glow",
    description: "Preparing your water delivery" 
  },
  arriving: { 
    label: "Out for Delivery", 
    icon: Truck, 
    color: "bg-accent",
    description: "On the way to your location" 
  },
  delivered: { 
    label: "Delivered", 
    icon: CheckCircle, 
    color: "bg-green-500",
    description: "Successfully delivered" 
  }
};

export const OrderStatusTracker = ({ order }: OrderStatusTrackerProps) => {
  const statuses = ["booked", "processing", "arriving", "delivered"] as const;
  const currentIndex = statuses.indexOf(order.status);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-primary-deep">Order #{order.id}</span>
          <Badge variant="outline" className="ocean-gradient text-white border-none">
            {statusConfig[order.status].label}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {order.estimatedDelivery && (
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
            <p className="text-sm text-primary-deep">
              <strong>Estimated Delivery:</strong> {order.estimatedDelivery}
            </p>
          </div>
        )}
        
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-border"></div>
          <div 
            className="absolute left-6 top-8 w-0.5 ocean-gradient transition-all duration-1000"
            style={{ height: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          ></div>
          
          {/* Status steps */}
          <div className="space-y-8">
            {statuses.map((status, index) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div key={status} className="flex items-start space-x-4">
                  <div className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full
                    ${isCompleted ? 'ocean-gradient text-white shadow-lg' : 'bg-background border-2 border-border'}
                    ${isCurrent ? 'animate-pulse' : ''}
                    transition-all duration-300
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <h3 className={`font-medium ${isCompleted ? 'text-primary-deep' : 'text-muted-foreground'}`}>
                      {config.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.description}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary mt-1">
                        Updated: {order.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};