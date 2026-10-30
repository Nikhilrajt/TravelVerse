import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getOrdersByUser = async (userId) => {
  const response = await api.get("/orders", {
    params: { userId }
  });
  return response.data;
};
