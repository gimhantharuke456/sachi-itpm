import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Supplier } from "../types";
import { SupplierFormValues, SupplierSchema } from "../schemas";

interface CreateEditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
  onSave: (values: SupplierFormValues) => void;
}

const CreateEditSupplierModal: React.FC<CreateEditSupplierModalProps> = ({
  isOpen,
  onClose,
  supplier,
  onSave,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(SupplierSchema),
    defaultValues: supplier || {
      name: "",
      email: "",
      contactNumber: "",
      address: "",
    },
  });

  // Reset form when supplier changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset(
        supplier || {
          name: "",
          email: "",
          contactNumber: "",
          address: "",
        }
      );
    }
  }, [isOpen, supplier, reset]);

  const onSubmit = (values: SupplierFormValues) => {
    onSave(values);
    onClose();
  };

  return (
    <Modal
      title={supplier ? "Edit Supplier" : "Create Supplier"}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item
          label="Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Contact Number"
          validateStatus={errors.contactNumber ? "error" : ""}
          help={errors.contactNumber?.message}
        >
          <Controller
            name="contactNumber"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Address"
          validateStatus={errors.address ? "error" : ""}
          help={errors.address?.message}
        >
          <Controller
            name="address"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditSupplierModal;
