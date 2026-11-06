import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const adminLogin = async (username,password)=>{
    const response =  await api.get(`/admins?username=${username}`);

    const admin = response.data[0];

    if(!admin || admin.password !== password){
        throw new Error("Invalid username or password");
    }

    return admin;
};