import React, { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { createUser } from "./services";

// Comprehensive Validation Schema
const UserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  contactNumber: z
    .string()
    .regex(/^\d{10,15}$/, "Contact number must be 10-15 digits"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email is too long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

// Infer TypeScript type from Zod schema
type UserFormValues = z.infer<typeof UserSchema>;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm<UserFormValues>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      // Validate all form fields
      await form.validateFields();

      // Get form values
      const values = form.getFieldsValue();

      // Set loading state
      setIsLoading(true);

      try {
        // Uncomment and replace with actual API call
        await createUser({ ...values, role: "user" });

        message.success("Registration successful!");
        navigate("/login");
      } catch (error) {
        // Handle API errors
        message.error("Registration failed. Please try again.");
        console.error(error);
      }
    } catch (errorInfo) {
      console.error(errorInfo);
      message.error("Please correct the errors in the form.");
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        title="Register"
        style={{
          width: 400,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          {/* Name Field */}
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
              {
                validator: async (_, value) => {
                  try {
                    UserSchema.pick({ name: true }).parse({ name: value });
                  } catch (error) {
                    console.error(error);
                    throw new Error("Invalid name format");
                  }
                },
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
            />
          </Form.Item>

          {/* Username Field */}
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
              {
                validator: async (_, value) => {
                  try {
                    UserSchema.pick({ username: true }).parse({
                      username: value,
                    });
                  } catch (error) {
                    console.error(error);
                    throw new Error("Invalid username format");
                  }
                },
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Choose a username" />
          </Form.Item>

          {/* Contact Number Field */}
          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[
              {
                required: true,
                message: "Please input your contact number!",
              },
              {
                validator: async (_, value) => {
                  try {
                    UserSchema.pick({ contactNumber: true }).parse({
                      contactNumber: value,
                    });
                  } catch (error) {
                    console.error(error);
                    throw new Error("Invalid contact number");
                  }
                },
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter 10-15 digit contact number"
            />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                validator: async (_, value) => {
                  try {
                    UserSchema.pick({ email: true }).parse({ email: value });
                  } catch (error) {
                    console.error(error);
                    throw new Error("Invalid email format");
                  }
                },
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                validator: async (_, value) => {
                  try {
                    UserSchema.pick({ password: true }).parse({
                      password: value,
                    });
                  } catch (error) {
                    console.error(error);
                    throw new Error("Password does not meet requirements");
                  }
                },
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Create a strong password"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Register
            </Button>
          </Form.Item>
        </Form>

        {/* Login Link */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1890ff" }}>
            Login Now
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
