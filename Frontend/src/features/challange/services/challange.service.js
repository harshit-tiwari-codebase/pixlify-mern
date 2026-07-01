import axios from "axios";
import BASE_URL from "../../../config/url";


const API = axios.create({
  // baseURL: "http://localhost:3000/api/challenge",
  baseURL:`${BASE_URL}/api/challenge`,
  withCredentials: true,
});

/**
 * Create Challenge
 */
export const createChallenge = async (payload) => {
  const { data } = await API.post("/create", payload);
  return data;
};

/**
 * Challenge Feed
 */
export const getChallengeFeed = async () => {
  const { data } = await API.get("/feed");
  return data;
};

/**
 * Dashboard
 */
export const getDashboard = async () => {
  const { data } = await API.get("/dashboard");
  return data;
};

/**
 * My Challenges
 */
export const getMyChallenges = async () => {
  const { data } = await API.get("/my");
  return data;
};

/**
 * Challenge Details
 */
export const getChallengeById = async (challengeId) => {
  const { data } = await API.get(`/${challengeId}`);
  return data;
};

/**
 * Heatmap
 */
export const getChallengeHeatmap = async (challengeId) => {
  const { data } = await API.get(`/${challengeId}/heatmap`);
  return data;
};

/**
 * Check-ins
 */
export const getChallengeCheckIns = async (challengeId) => {
  const { data } = await API.get(`/${challengeId}/checkins`);
  return data;
};

/**
 * Daily Check-in
 */
export const challengeCheckIn = async (challengeId, formData) => {
  const { data } = await API.post(`/${challengeId}/checkin`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
