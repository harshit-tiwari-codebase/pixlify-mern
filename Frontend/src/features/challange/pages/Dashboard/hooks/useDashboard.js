import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getDashboard,
  getMyChallenges,
  getChallengeById,
  getChallengeProgress,
  getChallengeHeatmap,
  getChallengeCheckIns,
  challengeCheckIn,
} from "../services/dashboard.api";

const useDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState(null);

  const [challenges, setChallenges] = useState([]);

  const [selectedChallenge, setSelectedChallenge] =
    useState(null);

  const [challenge, setChallenge] = useState(null);

  const [progress, setProgress] = useState(null);

  const [heatmap, setHeatmap] = useState([]);

  const [checkIns, setCheckIns] = useState([]);

  /**
   * Dashboard + Challenges
   */

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardRes, challengeRes] =
        await Promise.all([
          getDashboard(),
          getMyChallenges(),
        ]);

      setDashboard(dashboardRes.dashboard);

      setChallenges(challengeRes.challenges);

      if (
        challengeRes.challenges &&
        challengeRes.challenges.length > 0
      ) {
        setSelectedChallenge(
          challengeRes.challenges[0]
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

    /**
   * Load Selected Challenge
   */
  const loadSelectedChallenge = async (
    challengeId
  ) => {
    try {
      setLoading(true);

      const [
        challengeRes,
        progressRes,
        heatmapRes,
        checkInsRes,
      ] = await Promise.all([
        getChallengeById(challengeId),
        getChallengeProgress(challengeId),
        getChallengeHeatmap(challengeId),
        getChallengeCheckIns(challengeId),
      ]);

      setChallenge(challengeRes.challenge);

      setProgress(progressRes.progress);

      setHeatmap(heatmapRes.heatmap);

      setCheckIns(checkInsRes.checkIns);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load challenge."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Whenever selected challenge changes
   */
  useEffect(() => {
    if (!selectedChallenge) return;

    loadSelectedChallenge(
      selectedChallenge._id
    );
  }, [selectedChallenge]);

    /**
   * Daily Check-In
   */
  const handleCheckIn = async ({
    image,
    caption,
  }) => {
    try {
      if (!selectedChallenge) return;

      const formData = new FormData();

      formData.append("image", image);

      formData.append("caption", caption);

      await challengeCheckIn(
        selectedChallenge._id,
        formData
      );

      toast.success(
        "Check-in successful!"
      );

      // Refresh selected challenge data
      await Promise.all([
        loadSelectedChallenge(
          selectedChallenge._id
        ),
        loadDashboard(),
      ]);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Check-in failed."
      );
    }
  };

  return {
    loading,

    dashboard,

    challenges,

    challenge,

    selectedChallenge,

    setSelectedChallenge,

    progress,

    heatmap,

    checkIns,

    handleCheckIn,

    refreshDashboard: loadDashboard,
  };
};

export default useDashboard;