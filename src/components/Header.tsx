import { Button } from "@/components/ui/button";
import { Droplets, User, ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  userName?: string;
  onProfileClick: () => void;
  onCartClick: () => void;
  cartItemCount?: number;
}

export const Header = ({ userName, onProfileClick, onCartClick, cartItemCount = 0 }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-card">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Droplets className="h-8 w-8 text-primary droplet-shadow animate-float" />
            <div className="absolute inset-0 animate-ripple opacity-20">
              <Droplets className="h-8 w-8 text-primary-glow" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AquaFlow
            </h1>
            <p className="text-xs text-muted-foreground">Pure Water Delivery</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {userName && (
            <div className="text-sm text-primary-deep">
              Welcome, <span className="font-medium">{userName}</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
          
          <Button variant="glass" size="icon" onClick={onProfileClick}>
            <User className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 glass-card">
          <div className="container py-4 space-y-2">
            {userName && (
              <div className="text-sm text-primary-deep mb-2">
                Welcome, <span className="font-medium">{userName}</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              onClick={onCartClick}
              className="w-full justify-start"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cartItemCount})
            </Button>
            
            <Button
              variant="ghost"
              onClick={onProfileClick}
              className="w-full justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};