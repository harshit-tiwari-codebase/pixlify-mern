import React from "react";
import { Loader2 } from "lucide-react";

const GradientButton = ({
  icon: Icon,
  title,
  loading = false,
  type = "button",
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-2.5
        rounded-2xl
        border-2
        border-black
        bg-[#FF6B4A]
        hover:bg-[#ff5a36]
        py-3.5
        text-sm
        font-extrabold
        text-white
        shadow-[3px_3px_0px_#000]
        active:translate-x-0.5
        active:translate-y-0.5
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={18} className="stroke-[2.5]" />}
          <span>{title}</span>
        </>
      )}
    </button>
  );
};

export default GradientButton;
