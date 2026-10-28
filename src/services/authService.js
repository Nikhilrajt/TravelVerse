import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});
export const createUser = async (userData)=>{
    const response = await api.post("/users",userData);
    return response.data;
};
export const checkEmail = async (email)=>{
 const response = await api.get(`/users?email=${email}`);
 return response.data;
}
export const checkUsername = async (username)=>{
    const response = await api.get(`/users?username=${username}`);
    return response.data;
}
export const findUser = async (email)=>{
    const response = await api.get(`/users?email=${email}`);
    return response.data;
}