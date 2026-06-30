import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatsCards from "./components/StatsCards";
import ChallengeList from "./components/ChallengeList";
import ChallengeDetails from "./components/ChallengeDetails";
import useDashboard from "./hooks/useDashboard";

const Dashboard = () => {
  const navigate = useNavigate();

  const {
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
  } = useDashboard();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8 lg:py-8">
        {/* Header */}

        {/* Header */}

        <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        transition
        hover:border-violet-500
      "
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Dashboard
              </h1>

              <p className="mt-1 text-sm text-zinc-500">
                Track your challenge progress.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-full border border-zinc-800 px-4 py-2">
              <span className="text-sm text-zinc-400">
                {dashboard?.activeChallenges ?? 0} Active
              </span>
            </div>

            <div className="rounded-full bg-violet-600 px-4 py-2">
              <span className="text-sm font-medium">
                {dashboard?.completionRate ?? 0}% Complete
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="mb-8">
          <StatsCards dashboard={dashboard} />
        </div>

        {/* ========================= */}
        {/* Desktop */}
        {/* ========================= */}

        <div className="hidden gap-6 lg:grid lg:grid-cols-12">
          <aside className="col-span-4">
            <ChallengeList
              loading={loading}
              challenges={challenges}
              selectedChallenge={selectedChallenge}
              setSelectedChallenge={setSelectedChallenge}
            />
          </aside>

          <main className="col-span-8">
            <ChallengeDetails
              challenge={challenge}
              progress={progress}
              heatmap={heatmap}
              checkIns={checkIns}
              onCheckIn={handleCheckIn}
            />
          </main>
        </div>

        {/* ========================= */}
        {/* Mobile */}
        {/* ========================= */}

        <div className="lg:hidden">
          {!selectedChallenge ? (
            <ChallengeList
              loading={loading}
              challenges={challenges}
              selectedChallenge={selectedChallenge}
              setSelectedChallenge={setSelectedChallenge}
            />
          ) : (
            <div className="animate-in fade-in slide-in-from-right-5 duration-300">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="
                  mb-5
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  px-4
                  py-3
                  transition
                  hover:border-violet-500
                "
              >
                <ArrowLeft size={18} />
                Back to Challenges
              </button>

              <ChallengeDetails
                challenge={challenge}
                progress={progress}
                heatmap={heatmap}
                checkIns={checkIns}
                onCheckIn={handleCheckIn}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
