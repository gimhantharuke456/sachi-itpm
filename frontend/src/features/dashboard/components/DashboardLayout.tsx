import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, CreditCard, Truck } from "lucide-react";

const DashboardLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-6">Dashboard</h1>
        <nav className="space-y-2">
          <Button
            variant={
              isActive("/dashboard/user-management") ? "default" : "ghost"
            }
            className="w-full justify-start"
            asChild
          >
            <Link to="/dashboard/user-management">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Link>
          </Button>
          <Button
            variant={
              isActive("/dashboard/item-management") ? "default" : "ghost"
            }
            className="w-full justify-start"
            asChild
          >
            <Link to="/dashboard/item-management">
              <Package className="mr-2 h-4 w-4" />
              Item Management
            </Link>
          </Button>
          <Button
            variant={
              isActive("/dashboard/order-management") ? "default" : "ghost"
            }
            className="w-full justify-start"
            asChild
          >
            <Link to="/dashboard/order-management">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Order Management
            </Link>
          </Button>

          <Button
            variant={
              isActive("/dashboard/point-management") ? "default" : "ghost"
            }
            className="w-full justify-start"
            asChild
          >
            <Link to="/dashboard/point-management">
              <CreditCard className="mr-2 h-4 w-4" />
              Point Management
            </Link>
          </Button>
          <Button
            variant={
              isActive("/dashboard/supplier-management") ? "default" : "ghost"
            }
            className="w-full justify-start"
            asChild
          >
            <Link to="/dashboard/supplier-management">
              <Truck className="mr-2 h-4 w-4" />
              Supplier Management
            </Link>
          </Button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
