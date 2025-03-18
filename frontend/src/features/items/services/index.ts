import axios from "axios";
import { InventoryItemFormValues } from "../schemas";

const API_URL = "http://localhost:5001/api/inventoryItems";

export const createInventoryItem = async (
  itemData: InventoryItemFormValues
) => {
  try {
    const response = await axios.post(API_URL, itemData);
    return response.data;
  } catch (error) {
    console.error("Error creating inventory item:", error);
    throw error;
  }
};

export const getAllInventoryItems = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw error;
  }
};

export const getInventoryItemById = async (itemId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    throw error;
  }
};

export const updateInventoryItem = async (
  itemId: string,
  itemData: Partial<InventoryItemFormValues>
) => {
  try {
    const response = await axios.put(`${API_URL}/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
};

export const deleteInventoryItem = async (itemId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
};
