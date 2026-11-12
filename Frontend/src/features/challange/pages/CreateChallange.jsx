import ChallengeHeader from "../components/ChallengeHeader";
import ChallengeForm from "../components/ChallengeForm";
import useCreateChallenge from "../hooks/useCreateChallenge";
import BottomNavbar from "../../post/components/BottomNavbar";

const CreateChallenge = () => {
  const { loading, createNewChallenge } = useCreateChallenge();

  return (
    <div className="min-h-screen bg-[#EBE6FB] text-black pb-28">
      <ChallengeHeader />

      <main className="mx-auto max-w-xl px-4 py-6">
        <ChallengeForm
          loading={loading}
          onSubmit={createNewChallenge}
        />
      </main>

      <BottomNavbar />
    </div>
  );
};

export default CreateChallenge;
