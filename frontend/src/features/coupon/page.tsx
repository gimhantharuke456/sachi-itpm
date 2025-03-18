import React, { useEffect, useState } from "react";
import { Button, Card, Input, Table } from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Coupon } from "./types";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "./services";
import { getAllInventoryItems as getAllItems } from "../items/services";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CouponFormValues } from "./schemas";
import CreateEditCouponModal from "./components/CreateEditCouponModalProps";

const { Search } = Input;

const CouponPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const coupons = await getAllCoupons();
      setCoupons(coupons);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const items = await getAllItems();
      setItems(
        items.map((item: { id: string; name: string }) => ({
          id: item.id,
          name: item.name,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchItems();
  }, []);

  const onDeleteCouponClicked = async (coupon: Coupon) => {
    await deleteCoupon(coupon.id);
    await fetchCoupons();
  };

  const handleSaveCoupon = async (values: CouponFormValues) => {
    try {
      if (selectedCoupon) {
        await updateCoupon(selectedCoupon.id, { ...values });
      } else {
        await createCoupon(values);
      }
      await fetchCoupons();
      setIsModalOpen(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Coupons List", 10, 10);
    doc.autoTable({
      head: [["Coupon Code", "Discounted Amount", "Active Status"]],
      body: coupons.map((coupon) => [
        coupon.couponCode,
        coupon.discountedAmount,
        coupon.activeStatus ? "Active" : "Inactive",
      ]),
    });
    doc.save("coupons.pdf");
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.couponCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "couponCode",
      key: "couponCode",
    },
    {
      title: "Discounted Amount",
      dataIndex: "discountedAmount",
      key: "discountedAmount",
    },
    {
      title: "Active Status",
      dataIndex: "activeStatus",
      key: "activeStatus",
      render: (status: boolean) => (status ? "Active" : "Inactive"),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, coupon: Coupon) => (
        <div className="flex gap-2">
          <Button
            type="link"
            danger
            onClick={() => onDeleteCouponClicked(coupon)}
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
        title="Coupons"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Coupon
          </Button>
        }
      >
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Search by coupon code"
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
          dataSource={filteredCoupons}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
      <CreateEditCouponModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCoupon(null);
        }}
        coupon={selectedCoupon}
        items={items}
        onSave={handleSaveCoupon}
      />
    </div>
  );
};

export default CouponPage;
