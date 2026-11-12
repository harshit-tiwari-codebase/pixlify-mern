import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatsCards from "./components/StatsCards";
import ChallengeList from "./components/ChallengeList";
import ChallengeDetails from "./components/ChallengeDetails";
import useDashboard from "./hooks/useDashboard";
import BottomNavbar from "../../../post/components/BottomNavbar";

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
    <div className="min-h-screen bg-[#EBE6FB] text-black pb-28">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-5 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 border-b-2 border-black pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-[2px_2px_0px_#000] hover:bg-zinc-50 active:scale-95 transition"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-black">
                Dashboard
              </h1>
              <p className="text-xs text-zinc-600 font-medium">
                Track your challenge progress and streaks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-full border-2 border-black bg-white px-4 py-1.5 shadow-[2px_2px_0px_#000]">
              <span className="text-xs font-bold text-black">
                {dashboard?.activeChallenges ?? 0} Active
              </span>
            </div>

            <div className="rounded-full border-2 border-black bg-[#D5F94C] px-4 py-1.5 shadow-[2px_2px_0px_#000]">
              <span className="text-xs font-bold text-black">
                {dashboard?.completionRate ?? 0}% Complete
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsCards dashboard={dashboard} />
        </div>

        {/* ========================= */}
        {/* Desktop */}
        {/* ========================= */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
          {/* Left Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-4">
            <div className="sticky top-6">
              <ChallengeList
                loading={loading}
                challenges={challenges}
                selectedChallenge={selectedChallenge}
                setSelectedChallenge={setSelectedChallenge}
              />
            </div>
          </aside>

          {/* Right Content */}
          <main className="min-w-0 lg:col-span-8 xl:col-span-8">
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
            <div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="mb-4 flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold shadow-[2px_2px_0px_#000]"
              >
                <ArrowLeft size={16} />
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

      <BottomNavbar />
    </div>
  );
};

export default Dashboard;
