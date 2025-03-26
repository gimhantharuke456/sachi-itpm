import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Modal, Select, Spin } from "antd";
import {
  SearchOutlined,
  FilePdfOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { getAllOrders, updateOrder, deleteOrder } from "./services";
import { toast } from "sonner";

interface OrderedItem {
  id: string;
  inventoryId: string;
  quantity: number;
  inventory: {
    name: string;
    price: number;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  userId: string;
  totalBill: number;
  discount: number;
  address: string;
  name: string;
  email: string;
  contactNumber: string;
  orderStatus: string;
  createdAt: string;
  orderedItems: OrderedItem[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = orders.filter(
      (order) =>
        order.name.toLowerCase().includes(value.toLowerCase()) ||
        order.email.toLowerCase().includes(value.toLowerCase()) ||
        order.contactNumber.includes(value)
    );
    setFilteredOrders(filtered);
  };

  const generateInvoice = (order: Order) => {
    const doc = new jsPDF();
    doc.text("Order Invoice", 90, 10);
    doc.text(`Order ID: ${order.id}`, 10, 20);
    doc.text(`Customer: ${order.name}`, 10, 30);
    doc.text(`Email: ${order.email}`, 10, 40);
    doc.text(`Contact: ${order.contactNumber}`, 10, 50);
    doc.text(`Address: ${order.address}`, 10, 60);
    doc.text(`Order Status: ${order.orderStatus}`, 10, 70);
    doc.text(`Total Bill: LKR${order.totalBill}`, 10, 80);

    const tableData = order.orderedItems.map((item, index) => [
      index + 1,
      item.inventory.name,
      item.quantity,
      `$${item.inventory.price}`,
      `$${item.quantity * item.inventory.price}`,
    ]);

    autoTable(doc, {
      head: [["#", "Item", "Quantity", "Unit Price", "Total Price"]],
      body: tableData,
      startY: 90,
    });

    doc.save(`Invoice_${order.id}.pdf`);
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrder(orderId, { orderStatus: status });
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Total Bill (LKR)",
      dataIndex: "totalBill",
      key: "totalBill",
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_, record) => (
        <Select
          defaultValue={record.orderStatus}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Processing">Processing</Select.Option>
          <Select.Option value="Completed">Completed</Select.Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetails(record)}
          ></Button>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => generateInvoice(record)}
          ></Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOrder(record.id)}
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Order Management</h1>
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Search by name, email, or contact number"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-1/3"
          prefix={<SearchOutlined />}
        />
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={filteredOrders} rowKey="id" />
      </Spin>
      <Modal
        title="Order Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Customer:</strong> {selectedOrder.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.email}
            </p>
            <p>
              <strong>Contact:</strong> {selectedOrder.contactNumber}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Order Status:</strong> {selectedOrder.orderStatus}
            </p>
            <p>
              <strong>Total Bill:</strong> ${selectedOrder.totalBill}
            </p>
            <h3 className="text-lg font-semibold mt-4">Ordered Items</h3>
            <ul>
              {selectedOrder.orderedItems.map((item) => (
                <li key={item.id}>
                  {item.inventory.name} - {item.quantity} x $
                  {item.inventory.price} = $
                  {item.quantity * item.inventory.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
