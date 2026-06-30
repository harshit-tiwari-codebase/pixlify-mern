import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/challenge",
  withCredentials: true,
});

/**
 * Dashboard Statistics
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
 * Challenge Progress
 */
export const getChallengeProgress = async (challengeId) => {
  const { data } = await API.get(
    `/${challengeId}/progress`
  );

  return data;
};

/**
 * Challenge Heatmap
 */
export const getChallengeHeatmap = async (
  challengeId
) => {
  const { data } = await API.get(
    `/${challengeId}/heatmap`
  );

  return data;
};

/**
 * Challenge Check-ins
 */
export const getChallengeCheckIns = async (
  challengeId
) => {
  const { data } = await API.get(
    `/${challengeId}/checkins`
  );

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
 * Daily Check-in
 */
export const challengeCheckIn = async (
  challengeId,
  formData
) => {
  const { data } = await API.post(
    `/${challengeId}/checkin`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/**
 * Delete Challenge
 */
export const deleteChallenge = async (
  challengeId
) => {
  const { data } = await API.delete(
    `/${challengeId}`
  );

  return data;
};