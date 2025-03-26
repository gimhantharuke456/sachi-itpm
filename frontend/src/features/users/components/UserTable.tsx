import { useMemo, useState } from "react";
import { Table, Input, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { User } from "../types";

interface UserTableProps {
  users: User[];
  onDeleteUserClicked: (user: User) => void;
  onEditUserClicked: (user: User) => void;
}
const { Search } = Input;

const UserTable = ({
  users,
  onDeleteUserClicked,
  onEditUserClicked,
}: UserTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contactNumber.includes(searchQuery)
    );
  }, [users, searchQuery]);

  // Generate PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 10, 10);
    autoTable(doc, {
      head: [["Name", "Contact Number", "Role", "Email", "Username"]],
      body: filteredUsers.map((user) => [
        user.name,
        user.contactNumber,
        user.role,
        user.email,
        user.username,
      ]),
    });
    doc.save("users.pdf");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, user: User) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => onEditUserClicked(user)}>
            <EditOutlined />
          </Button>
          <Button type="link" danger onClick={() => onDeleteUserClicked(user)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Search
          placeholder="Search by name or contact number"
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
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserTable;
