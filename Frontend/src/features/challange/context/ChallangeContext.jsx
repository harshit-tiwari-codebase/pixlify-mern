import { createContext, useState } from "react";

export const ChallengeContext = createContext();

const ChallengeProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <ChallengeContext.Provider
      value={{
        posts,
        setPosts,
        loading,
        setLoading,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export default ChallengeProvider;