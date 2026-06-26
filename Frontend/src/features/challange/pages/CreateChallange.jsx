import ChallengeHeader from "../components/ChallengeHeader";
import ChallengeForm from "../components/ChallengeForm";
import DailyCheckIn from "../components/DailyCheckIn";

const CreateChallenge = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <ChallengeHeader />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">

        <div className="space-y-6">

          {/* Challenge Form */}
          <ChallengeForm />

        </div>

      </main>
    </div>
  );
};

export default CreateChallenge;