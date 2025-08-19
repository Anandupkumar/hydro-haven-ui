import { useState } from "react";
import { LoginPage } from "./LoginPage";
import { UserApp } from "./UserApp";
import { VendorDashboard } from "./VendorDashboard";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{
    type: "user" | "vendor" | null;
    phone: string;
  }>({ type: null, phone: "" });

  const handleLogin = (userType: "user" | "vendor", phone: string) => {
    setCurrentUser({ type: userType, phone });
  };

  const handleLogout = () => {
    setCurrentUser({ type: null, phone: "" });
  };

  // Simple test to ensure component renders
  try {
    if (!currentUser.type) {
      return <LoginPage onLogin={handleLogin} />;
    }

    if (currentUser.type === "vendor") {
      return <VendorDashboard onLogout={handleLogout} />;
    }

    return <UserApp onLogout={handleLogout} />;
  } catch (error) {
    // Fallback in case of component error
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">AquaFlow</h1>
          <p className="text-gray-600 mb-6">Pure Water Delivery Service</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Refresh App
          </button>
        </div>
      </div>
    );
  }
};

export default Index;
