import React, { useEffect, useState } from "react";
import { Button, Card, Input, Table } from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Supplier } from "./types";

import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "./services";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { SupplierFormValues } from "./schemas";
import CreateEditSupplierModal from "./components/CreateEditSupplierModal";
import { toast } from "sonner";

const { Search } = Input;

const SuppliersPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const suppliers = await getAllSuppliers();
      setSuppliers(suppliers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onEditSupplierClicked = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const onDeleteSupplierClicked = async (supplier: Supplier) => {
    try {
      await deleteSupplier(supplier.id);
      await fetchSuppliers();
      toast.success("Supplier deleted successully");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ,please try again");
    }
  };

  const handleSaveSupplier = async (values: SupplierFormValues) => {
    try {
      if (selectedSupplier) {
        await updateSupplier(selectedSupplier.id, values);
        toast.success("Supplier updated successully");
      } else {
        await createSupplier(values);
        toast.success("Supplier created successully");
      }
      await fetchSuppliers();
      setIsModalOpen(false);
      setSelectedSupplier(null);
    } catch (error) {
      console.error("Error saving supplier:", error);
      toast.error("Error while updating the supplier table");
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Suppliers List", 10, 10);
    autoTable(doc, {
      head: [["Name", "Email", "Contact Number", "Address"]],
      body: suppliers.map((supplier) => [
        supplier.name,
        supplier.email,
        supplier.contactNumber,
        supplier.address,
      ]),
    });
    doc.save("suppliers.pdf");
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, supplier: Supplier) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => onEditSupplierClicked(supplier)}>
            <EditOutlined />
          </Button>
          <Button
            type="link"
            danger
            onClick={() => onDeleteSupplierClicked(supplier)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Card
        title="Suppliers"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Supplier
          </Button>
        }
      >
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Search by name"
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
          dataSource={filteredSuppliers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
      <CreateEditSupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(null);
        }}
        supplier={selectedSupplier}
        onSave={handleSaveSupplier}
      />
    </div>
  );
};

export default SuppliersPage;
