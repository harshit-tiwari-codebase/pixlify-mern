import React from "react";
import { CalendarCheck2, UploadCloud, Send } from "lucide-react";

const DailyCheckIn = () => {
  return (
    <section className="rounded-[32px] border-[2.5px] border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black bg-[#EBE6FB] p-5 sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="rounded-2xl border-2 border-black bg-[#D5F94C] p-2.5 shadow-[2px_2px_0px_#000]">
            <CalendarCheck2 size={24} className="text-black" />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-black">
              Daily Check-in
            </h2>
            <p className="text-xs font-semibold text-zinc-600">
              Share your progress and keep your streak alive.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block rounded-full border-2 border-black bg-[#A0E7D4] px-3.5 py-1 text-xs font-extrabold text-black shadow-[1px_1px_0px_#000]">
          🔥 Streak Alive
        </span>
      </div>

      {/* Body */}
      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-2">
        {/* Upload */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-black">
            Upload Proof
          </p>

          <div className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-black bg-[#EBE6FB]/30 hover:bg-[#EBE6FB]/70 transition shadow-[2px_2px_0px_#000]">
            <div className="w-12 h-12 rounded-2xl border-2 border-black bg-[#FED7A5] flex items-center justify-center shadow-[1px_1px_0px_#000]">
              <UploadCloud size={24} className="text-black" />
            </div>

            <p className="mt-3 text-xs font-extrabold text-black">
              Upload an image
            </p>

            <p className="mt-1 text-[11px] font-semibold text-zinc-500">
              PNG, JPG up to 5MB
            </p>

            <button className="mt-4 rounded-xl border-2 border-black bg-white px-4 py-1.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000]">
              Browse Files
            </button>
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black">
            Today's Caption
          </label>

          <div className="relative">
            <textarea
              rows={9}
              placeholder="What did you accomplish today?"
              className="w-full resize-none rounded-[28px] border-2 border-black bg-white p-4 text-xs font-bold text-black placeholder:text-zinc-400 outline-none shadow-[2px_2px_0px_#000]"
            />

            <span className="absolute bottom-3 right-3 text-[10px] font-bold text-zinc-400">
              0/200
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black p-5 sm:p-6 bg-[#EBE6FB]/40">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-[#FF6B4A] hover:bg-[#ff5a36] py-3.5 text-sm font-extrabold text-white shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition">
          <Send size={16} />
          Post Check-in
        </button>
      </div>
    </section>
  );
};

export default DailyCheckIn;
