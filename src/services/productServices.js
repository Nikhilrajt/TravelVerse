import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data;
}

export const addProduct = async (newData) =>{
    const response = await api.post(`/products`,newData);
    return response.data;
}

export const updateProduct = async (productId,updatedData) =>{
    const response =  await api.patch(`/products/${productId}`,updatedData);
    return response.data;
}

export const deleteProduct = async (productId) => {
    await api.delete(`/products/${productId}`);
    return productId;
};