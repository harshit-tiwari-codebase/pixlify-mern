import axios from "axios";
const api = axios.create ({
    baseURL : "https://pixlify-mern-1.onrender.com/api/auth",
    withCredentials:true
})


export async function register(username, email, password) {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function login(username, password) {
    try {
        const response = await api.post("/login", {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMe(){
    try {
        const response = await api.get("/getme");
        return response.data;
    } catch (error) {
        throw error
    }
}

export async function editProfile(bio, profile_img) {
    try {
        const response = await api.put("/editProfile", {
            bio,
            profile_img,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
