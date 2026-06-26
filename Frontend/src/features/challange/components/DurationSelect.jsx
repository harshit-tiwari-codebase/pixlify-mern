import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Check,
} from "lucide-react";

const durations = [7, 14, 21, 30, 60, 90];

const DurationSelect = () => {
  const [selected, setSelected] = useState(30);
  const [open, setOpen] = useState(false);

  return (
    <div>

      <label className="mb-3 block text-sm font-medium text-zinc-300">
        Duration
      </label>

      <div className="relative">

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between rounded-2xl border border-zinc-800 bg-black px-5 py-4 transition hover:border-violet-500"
        >
          <div className="flex items-center gap-3">
            <CalendarDays
              size={20}
              className="text-violet-400"
            />

            <span>{selected} Days</span>
          </div>

          <ChevronDown
            size={18}
            className={`transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 z-20 mt-3 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">

            {durations.map((day) => (
              <button
                key={day}
                onClick={() => {
                  setSelected(day);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-5 py-4 transition hover:bg-zinc-900"
              >
                {day} Days

                {selected === day && (
                  <Check
                    size={18}
                    className="text-green-500"
                  />
                )}
              </button>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default DurationSelect;