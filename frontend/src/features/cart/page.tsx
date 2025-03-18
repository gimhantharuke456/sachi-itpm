import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../cart/utils/cartUtils";
import { Button, Card, Typography, message } from "antd";
import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartItem } from "./types";

const { Title, Text } = Typography;

const CartView: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartItems());

  // Increment quantity of a cart item
  const handleIncrement = (itemId: string, currentQuantity: number) => {
    const newQuantity = currentQuantity + 1;
    updateCartItemQuantity(itemId, newQuantity);
    setCartItems(getCartItems()); // Refresh cart items
  };

  // Decrement quantity of a cart item
  const handleDecrement = (itemId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) return; // Prevent going below 1
    const newQuantity = currentQuantity - 1;
    updateCartItemQuantity(itemId, newQuantity);
    setCartItems(getCartItems()); // Refresh cart items
  };

  // Remove an item from the cart
  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    setCartItems(getCartItems()); // Refresh cart items
    message.success("Item removed from cart");
  };

  // Clear the entire cart
  const handleClearCart = () => {
    clearCart();
    setCartItems([]); // Clear cart items
    message.success("Cart cleared");
  };

  // Calculate total price of all items in the cart
  const totalPrice = cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 container mx-auto p-8">
        <Title level={2} className="text-center mb-6">
          Your Cart
        </Title>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <Text>Your cart is empty.</Text>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((cartItem) => (
              <Card
                key={cartItem.item.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={cartItem.item.imageUrl}
                    alt={cartItem.item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <Text strong>{cartItem.item.name}</Text>
                    <Text className="block">${cartItem.item.price}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() =>
                        handleDecrement(cartItem.item.id, cartItem.quantity)
                      }
                      disabled={cartItem.quantity <= 1}
                    />
                    <span className="mx-3 text-center w-8">
                      {cartItem.quantity}
                    </span>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() =>
                        handleIncrement(cartItem.item.id, cartItem.quantity)
                      }
                    />
                  </div>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(cartItem.item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
            <div className="mt-6">
              <Text strong className="text-xl">
                Total: LKR {totalPrice.toFixed(2)}
              </Text>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="primary" danger onClick={handleClearCart}>
                Clear Cart
              </Button>
              <Button type="primary" onClick={() => navigate("/place-order")}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartView;
