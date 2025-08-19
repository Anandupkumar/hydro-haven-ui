import { useState, useEffect, createContext, useContext } from 'react';
import { apiClient, User, Vendor } from '@/services/api';

interface AuthContextType {
  user: User | null;
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userType: 'user' | 'vendor', phone: string, otp: string) => Promise<void>;
  logout: () => void;
  sendOTP: (phone: string, type: 'user' | 'vendor') => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    if (apiClient.isAuthenticated()) {
      // Try to get user profile to validate token
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      // Try to get user profile first
      try {
        const userProfile = await apiClient.getUserProfile();
        setUser(userProfile);
        setVendor(null);
      } catch {
        // If user profile fails, try vendor profile
        try {
          const vendorProfile = await apiClient.getVendorProfile();
          setVendor(vendorProfile);
          setUser(null);
        } catch {
          // If both fail, clear authentication
          apiClient.clearToken();
          setUser(null);
          setVendor(null);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      apiClient.clearToken();
      setUser(null);
      setVendor(null);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string, type: 'user' | 'vendor'): Promise<string> => {
    try {
      const response = await apiClient.sendOTP(phone, type);
      return response.otp || '';
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const login = async (userType: 'user' | 'vendor', phone: string, otp: string) => {
    try {
      const response = await apiClient.verifyOTP(phone, otp, userType);
      
      if (userType === 'user' && response.user) {
        setUser(response.user);
        setVendor(null);
      } else if (userType === 'vendor' && response.vendor) {
        setVendor(response.vendor);
        setUser(null);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
    setVendor(null);
  };

  const value: AuthContextType = {
    user,
    vendor,
    isAuthenticated: !!user || !!vendor,
    isLoading,
    login,
    logout,
    sendOTP,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
