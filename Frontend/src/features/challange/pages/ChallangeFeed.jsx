import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ChallengeCard from "../components/ChallangeCard";
import useChallenge from "../hooks/useChallange";

const ChallengeFeed = () => {
  const navigate = useNavigate();

  const { posts, loading, fetchChallengeFeed } = useChallenge();

  useEffect(() => {
    fetchChallengeFeed();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-20 border-b border-zinc-900 bg-black">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-zinc-800 p-2"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-white">Challenge Feed</h1>

            <p className="text-zinc-500 text-sm">
              Daily consistency from the Pixlify community.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-8">
        {loading ? (
          <p className="text-center text-zinc-500">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-zinc-500">No challenge posts found.</p>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <ChallengeCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeFeed;
