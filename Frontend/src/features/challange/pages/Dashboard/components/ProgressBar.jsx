import React from "react";

const ProgressBar = ({
  value = 0,
  height = "h-3",
  color = "bg-[#D5F94C]",
  showPercentage = false,
}) => {
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full">
      <div
        className={`relative w-full overflow-hidden rounded-full bg-zinc-200 border-2 border-black ${height}`}
      >
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {showPercentage && (
        <div className="mt-2 flex justify-end">
          <span className="text-xs font-bold text-zinc-600">
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
