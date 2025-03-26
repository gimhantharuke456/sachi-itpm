import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Supplier } from "../types";

// Enhanced validation schema
const SupplierSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Name can only contain letters, numbers, and spaces"
    )
    .max(50, "Name cannot exceed 50 characters"),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  contactNumber: z
    .string()
    .regex(/^\d{10,15}$/, "Contact number must be 10-15 digits"),

  address: z
    .string()
    .min(1, "Address is required")
    .regex(
      /^[a-zA-Z0-9\s]+\s+[a-zA-Z0-9\s]+/,
      "Address must contain at least two words"
    )
    .max(200, "Address cannot exceed 200 characters"),
});

// Infer the type from the schema
type SupplierFormValues = z.infer<typeof SupplierSchema>;

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
    formState: { errors, isSubmitting },
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
        <Button
          key="save"
          type="primary"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
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
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter supplier name"
                maxLength={50}
              />
            )}
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
            render={({ field }) => (
              <Input {...field} placeholder="Enter email address" />
            )}
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
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter 10-15 digit contact number"
                maxLength={15}
              />
            )}
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
            render={({ field }) => (
              <Input.TextArea
                {...field}
                placeholder="Enter full address (at least two words)"
                maxLength={200}
                rows={3}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditSupplierModal;
