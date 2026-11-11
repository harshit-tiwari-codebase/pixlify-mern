import axios from "axios";
import BASE_URL from "../../../config/url";

const api = axios.create({
  baseURL: `${BASE_URL}/api/posts`,
  withCredentials: true,
});

const userApi = axios.create({
  baseURL: `${BASE_URL}/api/user`,
  withCredentials: true,
});

const commentApi = axios.create({
  baseURL: `${BASE_URL}/api/comment`,
  withCredentials: true,
});

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

export async function createPost(caption, image, tags = [], location = "") {
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("image", image);
  if (location) {
    formData.append("location", location);
  }
  if (tags && tags.length > 0) {
    formData.append("tags", JSON.stringify(tags));
  }

  const response = await api.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deletePostApi(postId) {
  const response = await api.delete(`/${postId}`);
  return response.data;
}

export async function getPostDetails(postId) {
  const response = await api.get(`/details/${postId}`);
  return response.data;
}

export const toggleFollowApi = async (userId) => {
  const response = await userApi.post(`/toggle-follow/${userId}`);
  return response.data;
};

export async function searchUsersApi(q) {
  const response = await userApi.get("/search", {
    params: { q },
  });
  return response.data;
}

export async function getUserProfileApi(username) {
  const response = await userApi.get(`/profile/${username}`);
  return response.data;
}

export async function createComment(postId, comment) {
  const response = await commentApi.post(`/create/${postId}`, {
    comment,
  });
  return response.data;
}

export async function getComments(postId) {
  const response = await commentApi.get(`/get-comments/${postId}`);
  return response.data;
}

export async function deleteCommentApi(commentId) {
  const response = await commentApi.delete(`/${commentId}`);
  return response.data;
}
