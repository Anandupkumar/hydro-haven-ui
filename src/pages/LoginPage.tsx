import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Phone, Shield, ArrowLeft } from "lucide-react";
import waterDroplet from "@/assets/water-droplet.jpg";

interface LoginPageProps {
  onLogin: (userType: "user" | "vendor", phone: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loginType, setLoginType] = useState<"user" | "vendor">("user");

  const handleSendOtp = () => {
    if (phone.trim()) {
      setShowOtp(true);
      // Mock OTP sent
      console.log("OTP sent to:", phone);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.trim()) {
      onLogin(loginType, phone);
    }
  };

  const resetForm = () => {
    setShowOtp(false);
    setOtp("");
    setPhone("");
  };

  const switchToVendor = () => {
    setLoginType("vendor");
    resetForm();
  };

  const switchToUser = () => {
    setLoginType("user");
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={waterDroplet} 
                alt="AquaFlow Logo" 
                className="w-20 h-20 rounded-full droplet-shadow animate-float"
              />
              <div className="absolute inset-0 animate-ripple opacity-30">
                <Droplets className="w-20 h-20 text-primary-glow" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AquaFlow
            </h1>
            <p className="text-muted-foreground">Pure Water, Delivered Fresh</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="glass-card ripple-effect">
          <CardHeader className="text-center">
            {loginType === "vendor" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={switchToUser}
                className="absolute left-4 top-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <CardTitle className="text-primary-deep">
              {loginType === "user" ? "Customer Login" : "Vendor Login"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {loginType === "user" 
                ? "Order fresh water delivered to your doorstep"
                : "Manage your water delivery business"
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">

            {/* Phone Input */}
            {!showOtp ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary-deep">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSendOtp}
                  variant="flow"
                  className="w-full"
                  disabled={!phone.trim()}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Send OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-primary-deep">Enter OTP</Label>
                  <div className="text-sm text-muted-foreground">
                    OTP sent to {phone}
                  </div>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleVerifyOtp}
                    variant="flow"
                    className="w-full"
                    disabled={!otp.trim()}
                  >
                    Verify & Login
                  </Button>
                  
                  <Button 
                    onClick={() => setShowOtp(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    Change Phone Number
                  </Button>
                </div>
              </div>
            )}

            {/* Mock credentials info */}
            <div className="text-center">
              <div className="text-xs text-muted-foreground p-3 bg-accent/20 rounded-lg">
                <p className="font-medium">Demo Mode</p>
                <p>Use any phone number and OTP "123456"</p>
              </div>
            </div>

            {/* Vendor login link for users */}
            {loginType === "user" && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Are you a vendor?{" "}
                  <Button
                    variant="link"
                    onClick={switchToVendor}
                    className="p-0 h-auto text-primary underline"
                  >
                    Login here
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center text-xs text-muted-foreground">
          <p>✓ Secure OTP Login • ✓ Real-time Tracking • ✓ 24/7 Support</p>
        </div>
      </div>
    </div>
  );
};