import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { Coupon } from "../types";
import { CouponFormValues } from "../schemas";

interface CreateEditCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: Coupon | null;
  items: { id: string; name: string }[];
  onSave: (values: CouponFormValues) => void;
}

const CreateEditCouponModal: React.FC<CreateEditCouponModalProps> = ({
  isOpen,
  onClose,
  coupon,
  items,
  onSave,
}) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        onClose();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title={coupon ? "Edit Coupon" : "Create Coupon"}
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
      <Form form={form} layout="vertical" initialValues={coupon || {}}>
        <Form.Item
          label="Coupon Code"
          name="couponCode"
          rules={[{ required: true, message: "Please enter a coupon code" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Discounted Amount"
          name="discountedAmount"
          rules={[
            { required: true, message: "Please enter a discounted amount" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Active Status"
          name="activeStatus"
          valuePropName="checked"
        >
          <Input type="checkbox" />
        </Form.Item>
        <Form.Item
          label="Allowed Items"
          name="allowedItems"
          rules={[
            { required: true, message: "Please select at least one item" },
          ]}
        >
          <Select mode="multiple" placeholder="Select items">
            {items.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditCouponModal;
