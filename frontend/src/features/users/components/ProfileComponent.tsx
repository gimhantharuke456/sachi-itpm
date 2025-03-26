import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button, Form, Input, Popconfirm } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { getUserById, updateUser } from "../services";
import { User } from "../types";
import { getPointsBalance } from "@/features/points/services";
import { toast } from "sonner";

const { Title, Text } = Typography;

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pointBalance, setPointBalance] = useState<number>(0);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const userData = await getUserById(userId);
          try {
            const balance = await getPointsBalance(userId);
            setPointBalance(balance.balance ?? 0);
          } catch (err) {
            console.error(err);
          }
          setUser(userData);
          form.setFieldsValue(userData); // Pre-fill form with user data
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [userId, form]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSave = async (values: User) => {
    try {
      if (userId) {
        await updateUser(userId, values);
        const updatedUser = await getUserById(userId);
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success("User updated successfully");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Error updating the user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Card
        className="w-full max-w-md shadow-lg"
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        <div className="bg-black -mt-6 -mx-6 mb-6 p-6 text-white text-center">
          <div className="rounded-full bg-white w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <UserOutlined
              src="https://static.vecteezy.com/system/resources/previews/003/715/527/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg"
              className="text-4xl text-blue-600"
            />
          </div>
          <Title
            level={2}
            className="text-white m-0"
            style={{ color: "white" }}
          >
            {user.name}
          </Title>
          <div className="mt-4 inline-block bg-yellow-400 text-blue-800 px-4 py-2 rounded-full font-semibold">
            <TrophyOutlined className="mr-2" /> {pointBalance} Points
          </div>
        </div>

        {isEditing ? (
          <Form form={form} onFinish={handleSave} layout="vertical">
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item
              label="Contact Number"
              name="contactNumber"
              rules={[
                { required: true, message: "Please enter your contact number" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ borderRadius: "8px", height: "40px" }}
              >
                Save
              </Button>
              <Button
                type="default"
                block
                className="mt-2"
                onClick={() => setIsEditing(false)}
                style={{ borderRadius: "8px", height: "40px" }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center border-b border-gray-200 pb-3">
              <MailOutlined className="text-2xl text-blue-500 mr-4" />
              <div>
                <Text type="secondary" className="block text-xs">
                  EMAIL
                </Text>
                <Text className="text-gray-800">{user.email}</Text>
              </div>
            </div>

            <div className="flex items-center border-b border-gray-200 pb-3">
              <PhoneOutlined className="text-2xl text-blue-500 mr-4" />
              <div>
                <Text type="secondary" className="block text-xs">
                  CONTACT
                </Text>
                <Text className="text-gray-800">{user.contactNumber}</Text>
              </div>
            </div>

            <Button
              type="primary"
              block
              className="mt-6"
              onClick={() => setIsEditing(true)}
              style={{
                borderRadius: "8px",
                height: "40px",
                background: "#4263EB",
                borderColor: "#4263EB",
              }}
            >
              Edit Profile
            </Button>
            <div style={{ height: 16 }}></div>
            <Popconfirm
              title="Do you want to logout"
              onConfirm={handleLogout}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="default"
                danger
                block
                className="mt-2"
                style={{
                  borderRadius: "8px",
                  height: "40px",
                  borderColor: "#ff4d4f",
                }}
              >
                Logout
              </Button>
            </Popconfirm>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfileView;
