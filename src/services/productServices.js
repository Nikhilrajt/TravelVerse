import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

 export const getProducts = async()=>{
    const response = await api.get("/products");
    return response.data;
}