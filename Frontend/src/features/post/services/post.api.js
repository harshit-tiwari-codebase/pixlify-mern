import axios from "axios";

const api = axios.create({
    baseURL:"https://pixlify-mern-1.onrender.com/api/posts",
    //  baseURL  : "http://localhost:3000/api/posts",
    withCredentials : true
})

const userApi = axios.create({
    baseURL:"https://pixlify-mern-1.onrender.com/api/user",
    //  baseURL  : "http://localhost:3000/api/user",
    withCredentials : true
})


export async function getFeed() {
    const response = await api.get("/getfeed");
    return response.data;
}

export async function toggleLike(postId) {
    const response = await api.post(`/toggle-like/${postId}`);
    return response.data;
}

export async function toggleSavePost(postId) {
    const response = await api.post(`/save/${postId}`);
    return response.data;
}

export async function getSavedPosts() {
    const response = await api.get("/getSaved");
    return response.data;
}


export async function createPost(caption, image) {
  const formData = new FormData();

  formData.append("caption", caption);
  formData.append("image", image);

  const response = await api.post(
    "/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export const toggleFollowApi = async (userId) => {
  const response = await userApi.post(`/toggle-follow/${userId}`);
  return response.data;
};
