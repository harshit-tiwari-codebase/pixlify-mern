import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/challenge",
  withCredentials: true,
});

export const getChallengeFeed = async () => {
  const { data } = await API.get("/feed");
  return data;
};