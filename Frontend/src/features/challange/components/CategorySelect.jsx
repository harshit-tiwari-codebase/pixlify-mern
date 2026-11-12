import { useMemo, useState } from "react";
import {
  ChevronDown,
  Code2,
  Dumbbell,
  BookOpen,
  GraduationCap,
  Briefcase,
  Shapes,
  Check,
} from "lucide-react";

const categories = [
  {
    label: "Coding",
    value: "coding",
    icon: Code2,
  },
  {
    label: "Fitness",
    value: "fitness",
    icon: Dumbbell,
  },
  {
    label: "Reading",
    value: "reading",
    icon: BookOpen,
  },
  {
    label: "Study",
    value: "study",
    icon: GraduationCap,
  },
  {
    label: "Work",
    value: "work",
    icon: Briefcase,
  },
  {
    label: "Custom",
    value: "custom",
    icon: Shapes,
  },
];

const CategorySelect = ({
  value,
  onChange,
  customCategory,
  onCustomCategoryChange,
}) => {
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    return (
      categories.find((item) => item.value === value) || categories[0]
    );
  }, [value]);

  const Icon = selected.icon;

  return (
    <div className="space-y-3">
      <div className="relative">
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black">
          Category
        </label>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border-2 border-black bg-white px-4 py-3 font-bold text-sm text-black shadow-[2px_2px_0px_#000] transition active:scale-95"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl border-2 border-black bg-[#A0E7D4] flex items-center justify-center text-black">
              <Icon size={16} />
            </div>
            <span>{selected.label}</span>
          </div>

          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] py-1">
            {categories.map((item) => {
              const ItemIcon = item.icon;
              const isChosen = value === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold transition ${
                    isChosen ? "bg-[#D5F94C] text-black" : "text-black hover:bg-[#EBE6FB]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ItemIcon size={16} />
                    <span>{item.label}</span>
                  </div>

                  {isChosen && <Check size={16} className="stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {value === "custom" && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black">
            Custom Category
          </label>

          <input
            type="text"
            value={customCategory}
            onChange={(e) => onCustomCategoryChange(e.target.value)}
            placeholder="e.g. Photography, Art, Baking..."
            className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3 text-xs font-bold text-black placeholder:text-zinc-400 outline-none shadow-[2px_2px_0px_#000]"
          />
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
