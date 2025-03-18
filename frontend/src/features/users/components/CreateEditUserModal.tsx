import React, { useEffect } from "react";
import { User } from "../types";
import { Modal, Input, Form, Button } from "antd";
import { UserFormValues } from "../schemas";

interface CreateEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSave: (user: UserFormValues) => void;
}

const CreateEditUserModal: React.FC<CreateEditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: user?.id || "",
      name: user?.name || "",
      contactNumber: user?.contactNumber || "",
      role: user?.role || "customer",
      password: user?.password || "",
      username: user?.username || "",
      email: user?.email || "",
      createdAt: user?.createdAt || "",
      updatedAt: user?.updatedAt || "",
    });
  }, [user, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values as UserFormValues);
        onClose();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title={user ? "Edit User" : "Create User"}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contact Number"
          name="contactNumber"
          rules={[{ required: true, message: "Please enter a contact number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter a username" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter an email" }]}
        >
          <Input />
        </Form.Item>

        {!user && (
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input type="password" />
          </Form.Item>
        )}
        <Form.Item name="role">
          <Input type="hidden" value={"Admin"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditUserModal;
