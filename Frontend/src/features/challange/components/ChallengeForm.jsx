import { useState } from "react";
import { PlusCircle, Rocket, Sparkles } from "lucide-react";
import CategorySelect from "./CategorySelect";
import DurationSelect from "./DurationSelect";

const ChallengeForm = ({ loading, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: "",
    customCategory: "",
    description: "",
    duration: 30,
    visibility: "public",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[32px] border-[2.5px] border-black bg-white shadow-[4px_4px_0px_#000]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black bg-[#EBE6FB] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-black bg-[#FF6B4A] text-white shadow-[2px_2px_0px_#000]">
            <Sparkles size={20} />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-black">
              Challenge Details
            </h2>
            <p className="text-xs font-semibold text-zinc-600">
              Set your target and commit to the habit.
            </p>
          </div>
        </div>

        <span className="rounded-full border-2 border-black bg-[#D5F94C] px-3 py-1 text-[11px] font-extrabold text-black uppercase shadow-[1px_1px_0px_#000]">
          {formData.visibility}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-5 p-5 sm:p-6">
        {/* Category & Duration */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CategorySelect
            value={formData.category}
            customCategory={formData.customCategory}
            onChange={(category) =>
              setFormData((prev) => ({
                ...prev,
                category,
                customCategory:
                  category === "custom" ? prev.customCategory : "",
              }))
            }
            onCustomCategoryChange={(customCategory) =>
              setFormData((prev) => ({
                ...prev,
                customCategory,
              }))
            }
          />

          <DurationSelect
            value={formData.duration}
            onChange={(value) => handleChange("duration", value)}
          />
        </div>

        {/* Custom Category fallback if selected directly */}
        {formData.category === "Other" && (
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black">
              Custom Category
            </label>
            <input
              type="text"
              value={formData.customCategory}
              onChange={(e) => handleChange("customCategory", e.target.value)}
              placeholder="Enter custom category..."
              className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3 text-xs font-bold text-black outline-none shadow-[2px_2px_0px_#000]"
            />
          </div>
        )}

        {/* Goal Description */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black">
            Goal / Commitment
          </label>

          <div className="relative">
            <textarea
              rows={4}
              maxLength={150}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Take one sunset photo every day and log the vibe."
              className="w-full resize-none rounded-2xl border-2 border-black bg-white p-4 text-xs font-bold text-black placeholder:text-zinc-400 outline-none shadow-[2px_2px_0px_#000]"
            />

            <span className="absolute bottom-3 right-3 text-[10px] font-bold text-zinc-500">
              {formData.description.length}/150
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading || !formData.category || !formData.description.trim()
          }
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FF6B4A] hover:bg-[#ff5a36] text-white text-sm font-extrabold shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket size={18} />
          {loading ? "Creating Challenge..." : "Launch Challenge"}
        </button>
      </div>
    </form>
  );
};

export default ChallengeForm;
