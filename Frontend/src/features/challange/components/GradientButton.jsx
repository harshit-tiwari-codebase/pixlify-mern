import { Loader2 } from "lucide-react";

const GradientButton = ({
  icon: Icon,
  title,
  loading = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        bg-gradient-to-r
        from-violet-700
        via-violet-600
        to-violet-500
        py-4
        text-lg
        font-semibold
        transition-all
        duration-300
        hover:scale-[1.01]
        hover:shadow-xl
        hover:shadow-violet-500/20
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {loading ? (
        <Loader2
          size={20}
          className="animate-spin"
        />
      ) : (
        Icon && (
          <Icon
            size={20}
            className="transition group-hover:rotate-12"
          />
        )
      )}

      {loading ? "Please wait..." : title}
    </button>
  );
};

export default GradientButton;