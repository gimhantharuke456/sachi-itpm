import axios from "axios";
import { PointsFormValues } from "../schemas";

const API_URL = "http://localhost:5001/api/points";

export const addPoints = async (pointsData: PointsFormValues) => {
  try {
    const response = await axios.post(`${API_URL}/add`, pointsData);
    return response.data;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

export const deductPoints = async (pointsData: PointsFormValues) => {
  try {
    const response = await axios.post(`${API_URL}/deduct`, pointsData);
    return response.data;
  } catch (error) {
    console.error("Error deducting points:", error);
    throw error;
  }
};

export const getPointsBalance = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/balance/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching points balance:", error);
    throw error;
  }
};

export const getAllCustomersPoints = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all customers' points:", error);
    throw error;
  }
};
