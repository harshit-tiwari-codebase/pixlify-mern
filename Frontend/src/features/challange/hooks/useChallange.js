import { useContext } from "react";
import { ChallengeContext } from "../context/ChallangeContext";
import { getChallengeFeed } from "../api/challange.api";

const useChallenge = () => {
  const {
    posts,
    setPosts,
    loading,
    setLoading,
  } = useContext(ChallengeContext);

const fetchChallengeFeed = async () => {
  try {
    setLoading(true);

    const data = await getChallengeFeed();

    console.log(data); // remove after testing

    setPosts(data.posts || []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return {
    posts,
    loading,
    fetchChallengeFeed,
  };
};

export default useChallenge;