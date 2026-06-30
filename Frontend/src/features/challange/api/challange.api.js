import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/challenge",
  withCredentials: true,
});

/**
 * Challenge Feed
 */
export const getChallengeFeed = async () => {
  const { data } = await API.get("/feed");
  return data;
};

/**
 * Create Challenge
 */
export const createChallenge = async (payload) => {
  const { data } = await API.post("/create", payload);
  return data;
};