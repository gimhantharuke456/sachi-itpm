import { useEffect, useState } from "react";
import { Table, Tag, Collapse, Button, Popconfirm } from "antd";
import { deleteOrder, getAllCustomerOrders } from "./services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrashIcon } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface OrderedItem {
  id: string;
  quantity: number;
  inventory: InventoryItem;
}

interface Order {
  id: string;
  totalBill: number;
  orderStatus: string;
  createdAt: string;
  orderedItems: OrderedItem[];
}

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllCustomerOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Total Bill",
      dataIndex: "totalBill",
      key: "totalBill",
      render: (totalBill: number) => `$${totalBill}`,
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: string) => (
        <Tag color={status === "Pending" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record: Order) => (
        <Popconfirm
          title="Are you sure you want to delete this order?"
          onConfirm={async () => {
            await deleteOrder(record.id);
            const data = await getAllCustomerOrders();
            setOrders(data);
          }}
          okText="Yes"
          cancelText="No"
          disabled={record.orderStatus !== "Pending"}
        >
          <Button
            disabled={record.orderStatus !== "Pending"}
            type="primary"
            danger
          >
            <TrashIcon />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col justify-between h-screen">
      <Navbar />
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={loading}
          expandable={{
            expandedRowRender: (record: Order) => (
              <Collapse accordion>
                {record.orderedItems.length > 0 ? (
                  record.orderedItems.map((item) => (
                    <Collapse.Panel
                      header={`${item.inventory.name} (x${item.quantity})`}
                      key={item.id}
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.inventory.imageUrl}
                          alt={item.inventory.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div>
                          <p className="text-lg font-semibold">
                            {item.inventory.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.inventory.description}
                          </p>
                          <p className="text-md font-bold">
                            Price: ${item.inventory.price}
                          </p>
                        </div>
                      </div>
                    </Collapse.Panel>
                  ))
                ) : (
                  <p>No items in this order.</p>
                )}
              </Collapse>
            ),
          }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;
