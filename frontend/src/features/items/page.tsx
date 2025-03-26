import React, { useEffect, useState } from "react";
import { Button, Card, Input, Table, message } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import {
  getAllInventoryItems as getAllItems,
  createInventoryItem as createItem,
  updateInventoryItem as updateItem,
  deleteInventoryItem as deleteItem,
} from "./services/index";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { InventoryItem } from "./types";
import { InventoryItemFormValues } from "./schemas";
import CreateEditItemModal from "./components/CreateEditItemModal";
import { EditIcon, Trash } from "lucide-react";

const { Search } = Input;

const ItemsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await getAllItems();
      setItems(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onEditItemClicked = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const onDeleteItemClicked = async (item: InventoryItem) => {
    await deleteItem(item.id);
    await fetchData();
  };

  const handleSaveItem = async (values: InventoryItemFormValues) => {
    try {
      if (selectedItem) {
        await updateItem(selectedItem.id, values);
        messageApi.success("Item updated successfully");
      } else {
        await createItem(values);
        messageApi.success("Item created successfully");
      }
      await fetchData();
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      messageApi.error("Something went wront, please try again!");
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Inventory Items List", 10, 10);
    autoTable(doc, {
      head: [["Name", "Price", "Description", "In Stock"]],
      body: items.map((item) => [
        item.name,
        item.price,
        item.description,
        item.inStock,
      ]),
    });
    doc.save("inventory_items.pdf");
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "In Stock",
      dataIndex: "inStock",
      key: "inStock",
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          View Image
        </a>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, item: InventoryItem) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => onEditItemClicked(item)}>
            <EditIcon />
          </Button>
          <Button type="link" danger onClick={() => onDeleteItemClicked(item)}>
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {contextHolder}
      <Card
        title="Inventory Items"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Item
          </Button>
        }
      >
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Search by name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
            allowClear
          />
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleGeneratePDF}
          >
            Export PDF
          </Button>
        </div>
        <Table
          dataSource={filteredItems}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
      <CreateEditItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default ItemsPage;
