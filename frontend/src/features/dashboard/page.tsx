import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
} from "lucide-react";

import ItemsPage from "../items/page";
import UserManagement from "../users/components/UserManagement";
import CustomerManagement from "../users/components/CustomerManagement";
import OrdersPage from "../orders/page";
import CouponPage from "../coupon/page";
import PointsPage from "../points/page";
import SuppliersPage from "../suppliers/page";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("item-management");

  const navigationItems = [
    {
      id: "item-management",
      label: "Item Management",
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: "user-management",
      label: "User Management",
      icon: <Users className="h-5 w-5" />,
    },

    {
      id: "order-management",
      label: "Order Management",
      icon: <ShoppingCart className="h-5 w-5" />,
    },

    {
      id: "point-management",
      label: "Point Management",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "supplier-management",
      label: "Supplier Management",
      icon: <Truck className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className="w-64 bg-white border-r"
        style={{ paddingLeft: 16, paddingTop: 16 }}
      >
        <div className="p-6" style={{ paddingTop: 16 }}>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" /> Dashboard
          </h1>
        </div>
        <nav className="space-y-1" style={{ padding: 4 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start",
                activeTab === item.id
                  ? "bg-black text-white hover:bg-black hover:text-white"
                  : "hover:bg-gray-100"
              )}
              style={{ paddingRight: 12, paddingLeft: 12 }}
              onClick={() => setActiveTab(item.id)}
            >
              <div style={{ cursor: "pointer" }}>
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1" style={{ padding: 8 }}>
        {activeTab === "item-management" && <ItemsPage />}
        {activeTab === "user-management" && <UserManagement />}
        {activeTab === "customer-management" && <CustomerManagement />}
        {activeTab === "order-management" && <OrdersPage />}
        {activeTab === "coupon-management" && <CouponPage />}
        {activeTab === "point-management" && <PointsPage />}
        {activeTab === "supplier-management" && <SuppliersPage />}
      </div>
    </div>
  );
};

export default DashboardPage;
