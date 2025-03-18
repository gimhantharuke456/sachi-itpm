import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  List,
  message,
} from "antd";
import {
  CreditCardOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getInventoryItemById } from "../items/services";
import { getCartItems, clearCart } from "../cart/utils/cartUtils";
import { createOrder } from "./services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OrderFormValues } from "./schemas";
import { InventoryItem } from "@/features/items/types";
import PointBalance from "../points/components/PointBalance";

const { Title, Text } = Typography;

const PlaceOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<
    Array<{ item: InventoryItem; quantity: number }>
  >([]);
  const [totalBill, setTotalBill] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Fetch single item if ID is provided
          const item = await getInventoryItemById(id);
          setItems([{ item, quantity: 1 }]);
          setTotalBill(item.price);
        } else {
          // Get all items from cart
          const cartItems = getCartItems();
          setItems(cartItems);
          // Calculate total bill
          const total = cartItems.reduce(
            (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
            0
          );
          setTotalBill(total);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load order details");
      }
    };

    fetchData();

    // Get user info from localStorage
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
      });
    }
  }, [id, form]);

  const applyCoupon = (couponCode: string) => {
    // This is a dummy function - in a real app, you would validate the coupon
    // and apply the discount based on the coupon logic
    if (couponCode === "SAVE10") {
      const discountAmount = totalBill * 0.1;
      setDiscount(discountAmount);
      message.success("Coupon applied successfully!");
    } else {
      message.error("Invalid coupon code");
    }
  };

  const handleApplyPoints = (pointsToRedeem) => {
    // Apply the points value as discount
    const pointsDiscount = pointsToRedeem; // 1 point = 1 LKR
    setDiscount((prevDiscount) => prevDiscount + pointsDiscount);
    message.success(`Applied ${pointsToRedeem} points to your order!`);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        message.error("Please log in to place an order");
        navigate("/login");
        return;
      }

      const orderData: OrderFormValues = {
        userId,
        totalBill: totalBill - discount,
        discount,
        couponCode: values.couponCode || undefined,
        orderedItems: items.map((item) => ({
          inventoryId: item.item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData);

      if (!id) {
        // Clear cart only if ordering from cart
        clearCart();
      }

      message.success("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 container mx-auto p-8">
        <Title level={2} className="text-center mb-6">
          Place Your Order
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card title="Order Summary">
            <List
              itemLayout="horizontal"
              dataSource={items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img
                        src={item.item.imageUrl}
                        alt={item.item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    }
                    title={item.item.name}
                    description={`LKR${item.item.price} x ${item.quantity}`}
                  />
                  <div>LKR{(item.item.price * item.quantity).toFixed(2)}</div>
                </List.Item>
              )}
            />
            <Divider />
            <div className="flex justify-between mb-2">
              <Text>Subtotal:</Text>
              <Text>LKR{totalBill.toFixed(2)}</Text>
            </div>
            <div className="flex justify-between mb-2">
              <Text>Discount:</Text>
              <Text>-LKR{discount.toFixed(2)}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Total:</Text>
              <Text strong>LKR{(totalBill - discount).toFixed(2)}</Text>
            </div>

            <div className="mt-4">
              <Input.Search
                placeholder="Enter coupon code"
                enterButton="Apply"
                onSearch={applyCoupon}
              />
              <Text type="secondary" className="block mt-1">
                Try "SAVE10" for 10% off
              </Text>
            </div>
            <div className="mt-5">
              {" "}
              <PointBalance onApplyPoints={handleApplyPoints} />
            </div>
          </Card>

          {/* Payment Details */}
          <Card title="Payment Details">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Title level={4} className="mb-4">
                <UserOutlined className="mr-2" />
                Contact Information
              </Title>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
              <Form.Item
                name="contactNumber"
                label="Contact Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter your contact number",
                  },
                ]}
              >
                <Input placeholder="Enter your contact number" />
              </Form.Item>

              <Title level={4} className="mb-4 mt-6">
                <ShopOutlined className="mr-2" />
                Shipping Address
              </Title>
              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input.TextArea placeholder="Enter your address" rows={3} />
              </Form.Item>

              <Title level={4} className="mb-4 mt-6">
                <CreditCardOutlined className="mr-2" />
                Payment Method
              </Title>
              <Form.Item
                name="cardNumber"
                label="Card Number"
                rules={[
                  { required: true, message: "Please enter your card number" },
                ]}
              >
                <Input placeholder="1234 5678 9012 3456" />
              </Form.Item>
              <div className="flex space-x-4">
                <Form.Item
                  name="expiryDate"
                  label="Expiry Date"
                  className="w-1/2"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="MM/YY" />
                </Form.Item>
                <Form.Item
                  name="cvv"
                  label="CVV"
                  className="w-1/2"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="123" />
                </Form.Item>
              </div>

              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Place Order
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlaceOrderPage;
