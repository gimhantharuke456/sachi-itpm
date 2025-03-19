import React, { useState, useEffect } from "react";
import { Card, Button, Table, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllCustomersPoints } from "./services";

interface User {
  id: string;
  name: string;
  contactNumber: string;
  username: string;
  email: string;
  role: string;
}

interface Points {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}

const PointsPage: React.FC = () => {
  const [pointsData, setPointsData] = useState<Points[]>([]);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      // Simulate API call (replace with real API)
      const response = await getAllCustomersPoints();
      setPointsData(response);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch points data");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User Points Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["User", "Email", "Balance"]],
      body: pointsData.map((item) => [
        item.user.name,
        item.user.email,
        item.balance,
      ]),
    });

    doc.save("Points_Report.pdf");
  };

  const columns = [
    {
      title: "User",
      dataIndex: ["user", "name"],
      key: "user",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Points</h2>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={generatePDF}
          >
            Generate Report
          </Button>
        </div>
        <Table dataSource={pointsData} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default PointsPage;
