import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createChallenge } from "../services/challange.service";

const useCreateChallenge = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const createNewChallenge = async (payload) => {
    try {
      setLoading(true);

      const res = await createChallenge(payload);

      toast.success(res.message || "Challenge created!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create challenge."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createNewChallenge,
  };
};

export default useCreateChallenge;