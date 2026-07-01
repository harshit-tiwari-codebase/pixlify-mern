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
    <div className="space-y-4">
      <div className="relative">
        <label className="mb-3 block text-sm font-medium text-zinc-300">
          Category
        </label>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-zinc-800 bg-black px-5 py-4 transition hover:border-violet-500"
        >
          <div className="flex items-center gap-3">
            <Icon className="text-violet-400" size={20} />
            <span>{selected.label}</span>
          </div>

          <ChevronDown
            size={18}
            className={`transition ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 z-50 mt-3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
            {categories.map((item) => {
              const ItemIcon = item.icon;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-5 py-4 transition hover:bg-zinc-900"
                >
                  <div className="flex items-center gap-3">
                    <ItemIcon
                      size={18}
                      className="text-violet-400"
                    />
                    <span>{item.label}</span>
                  </div>

                  {value === item.value && (
                    <Check
                      size={18}
                      className="text-green-500"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {value === "custom" && (
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Custom Category
          </label>

          <input
            type="text"
            value={customCategory}
            onChange={(e) =>
              onCustomCategoryChange(e.target.value)
            }
            placeholder="e.g. Meditation, Music, Yoga..."
            className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-white outline-none transition focus:border-violet-500"
          />
        </div>
      )}
    </div>
  );
};

export default CategorySelect;