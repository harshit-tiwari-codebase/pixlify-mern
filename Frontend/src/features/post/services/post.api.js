import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000/api/posts",
    withCredentials : true
})


export async function getFeed() {
    const response = await api.get("/getfeed");
    return response.data;
}

export async function toggleLike(postId) {
    console.log(postId)
    const response = await api.post(`/toggle-like/${postId}`);
    return response.data;
    console.log(response.data)
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