import ChallengeHeader from "../components/ChallengeHeader";
import ChallengeForm from "../components/ChallengeForm";
import useCreateChallenge from "../hooks/useCreateChallenge";

const CreateChallenge = () => {
  const { loading, createNewChallenge } = useCreateChallenge();

  console.log("CreateChallenge Rendered");
  console.log({
    loading,
    createNewChallenge,
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <ChallengeHeader />

      <main className="mx-auto max-w-3xl px-4 py-6">
        <ChallengeForm
          loading={loading}
          onSubmit={createNewChallenge}
        />
      </main>
    </div>
  );
};

export default CreateChallenge;