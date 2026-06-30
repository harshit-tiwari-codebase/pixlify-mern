import React from "react";

const ProgressBar = ({
  value = 0,
  height = "h-2.5",
  color = "bg-violet-500",
  showPercentage = true,
}) => {
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full">
      <div
        className={`relative w-full overflow-hidden rounded-full bg-zinc-800 ${height}`}
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
          <span className="text-xs font-medium text-zinc-400">
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;