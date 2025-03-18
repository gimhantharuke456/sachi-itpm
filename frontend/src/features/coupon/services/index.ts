import axios from "axios";
import { CouponFormValues } from "../schemas";

const API_URL = "http://localhost:5001/api/coupons";

export const createCoupon = async (couponData: CouponFormValues) => {
  try {
    const response = await axios.post(API_URL, couponData);
    return response.data;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

export const getAllCoupons = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

export const getCouponById = async (couponId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${couponId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw error;
  }
};

export const updateCoupon = async (
  couponId: string,
  couponData: Partial<CouponFormValues>
) => {
  try {
    const response = await axios.put(`${API_URL}/${couponId}`, couponData);
    return response.data;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

export const deleteCoupon = async (couponId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${couponId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};
