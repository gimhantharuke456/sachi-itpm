import axios from "axios";
import { SupplierFormValues } from "../schemas";

const API_URL = "http://localhost:5001/api/suppliers";

export const createSupplier = async (supplierData: SupplierFormValues) => {
  try {
    const response = await axios.post(API_URL, supplierData);
    return response.data;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};

export const getAllSuppliers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const getSupplierById = async (supplierId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${supplierId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier:", error);
    throw error;
  }
};

export const updateSupplier = async (
  supplierId: string,
  supplierData: Partial<SupplierFormValues>
) => {
  try {
    const response = await axios.put(`${API_URL}/${supplierId}`, supplierData);
    return response.data;
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw error;
  }
};

export const deleteSupplier = async (supplierId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${supplierId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw error;
  }
};
