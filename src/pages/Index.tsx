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

  if (!currentUser.type) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.type === "vendor") {
    return <VendorDashboard />;
  }

  return <UserApp />;
};

export default Index;
