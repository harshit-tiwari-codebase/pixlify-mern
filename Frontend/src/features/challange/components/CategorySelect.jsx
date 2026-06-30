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
    name: "Coding",
    icon: Code2,
  },
  {
    name: "Fitness",
    icon: Dumbbell,
  },
  {
    name: "Reading",
    icon: BookOpen,
  },
  {
    name: "Study",
    icon: GraduationCap,
  },
  {
    name: "Work",
    icon: Briefcase,
  },
  {
    name: "Other",
    icon: Shapes,
  },
];

const CategorySelect = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    return (
      categories.find(
        (item) => item.name === value
      ) || categories[0]
    );
  }, [value]);

  const Icon = selected.icon;

  return (
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
          <Icon
            className="text-violet-400"
            size={20}
          />

          <span>{selected.name}</span>
        </div>

        <ChevronDown
          size={18}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
          {categories.map((item) => {
            const ItemIcon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onChange(item.name);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-5 py-4 transition hover:bg-zinc-900"
              >
                <div className="flex items-center gap-3">
                  <ItemIcon
                    size={18}
                    className="text-violet-400"
                  />

                  <span>{item.name}</span>
                </div>

                {value === item.name && (
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
  );
};

export default CategorySelect;