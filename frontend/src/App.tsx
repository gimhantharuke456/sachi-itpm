import "antd/dist/reset.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/page";
import RegisterPage from "./features/users/page";
import DashboadPage from "./features/dashboard/page";
import HomePage from "./pages/HomePage";
import SingleItemView from "./features/items/components/SingleItemView";
import ProfileView from "./features/users/components/ProfileComponent";
import CartView from "./features/cart/page";
import PlaceOrderPage from "./features/orders/place-order-page";
import MyOrdersPage from "./features/orders/my-orders-page";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboadPage />} />
        <Route path="/item-view/:id" element={<SingleItemView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/place-order/:id" element={<PlaceOrderPage />} />
        <Route path="/place-order" element={<PlaceOrderPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
