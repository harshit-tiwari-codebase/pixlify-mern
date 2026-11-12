import { useState } from "react";
import { CalendarDays, ChevronDown, Check } from "lucide-react";

const durations = [7, 14, 21, 30, 60, 90];

const DurationSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black">
        Duration
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border-2 border-black bg-white px-4 py-3 font-bold text-sm text-black shadow-[2px_2px_0px_#000] transition active:scale-95"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl border-2 border-black bg-[#BFB9FA] flex items-center justify-center text-black">
              <CalendarDays size={16} />
            </div>
            <span>{value} Days</span>
          </div>

          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] py-1">
            {durations.map((day) => {
              const isChosen = value === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    onChange(day);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold transition ${
                    isChosen ? "bg-[#D5F94C] text-black" : "text-black hover:bg-[#EBE6FB]"
                  }`}
                >
                  <span>{day} Days</span>

                  {isChosen && <Check size={16} className="stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DurationSelect;
