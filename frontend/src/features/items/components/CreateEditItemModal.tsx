import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { InventoryItem } from "../types";
import { InventoryItemFormValues } from "../schemas";
import { uploadFile } from "@/services/firebaseService";

interface CreateEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InventoryItem | null;
  onSave: (values: InventoryItemFormValues) => void;
}

const CreateEditItemModal: React.FC<CreateEditItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>(item?.imageUrl || "");
  const [uploading, setUploading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadFile(file, `items/${file.name}`);
      setImageUrl(url);
      form.setFieldsValue({ imageUrl: url });
      messageApi.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({
          ...values,
          imageUrl,
          price: parseFloat(values.price),
          inStock: parseInt(values.inStock),
        });
        onClose();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title={item ? "Edit Item" : "Create Item"}
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
      {contextHolder}
      <Form form={form} layout="vertical" initialValues={item || {}}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter a price" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="In Stock"
          name="inStock"
          rules={[{ required: true, message: "Please enter stock quantity" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Image"
          name="imageUrl"
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload
            beforeUpload={(file) => {
              handleUpload(file);
              return false; // Prevent default upload
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload Image
            </Button>
          </Upload>
          {imageUrl && (
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              View Image
            </a>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditItemModal;
