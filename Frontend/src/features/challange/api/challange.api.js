import axios from "axios";
import BASE_URL from "../../../config/url";

const API = axios.create({
  baseURL:`${BASE_URL}/api/challenge`,

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
