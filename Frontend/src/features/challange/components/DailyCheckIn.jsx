import {
  CalendarCheck2,
  UploadCloud,
  Send,
} from "lucide-react";

const DailyCheckIn = () => {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-zinc-800 p-7">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-green-500/10 p-3">
            <CalendarCheck2
              size={28}
              className="text-green-400"
            />
          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Daily Check-in
            </h2>

            <p className="text-sm text-zinc-500">
              Share your progress and keep your streak alive.
            </p>

          </div>

        </div>

        <span className="hidden rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400 md:block">
          🔥 Consistency is key
        </span>

      </div>

      {/* Body */}

      <div className="grid gap-8 p-7 md:grid-cols-2">

        {/* Upload */}

        <div>

          <p className="mb-3 text-sm font-medium">
            Upload Proof
          </p>

          <div className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-black transition hover:border-green-500">

            <UploadCloud
              size={50}
              className="text-green-400"
            />

            <p className="mt-5 text-lg font-semibold">
              Upload an image
            </p>

            <p className="mt-2 text-zinc-500">
              PNG, JPG up to 5MB
            </p>

            <button className="mt-7 rounded-xl border border-zinc-700 px-5 py-3 transition hover:bg-zinc-900">
              Browse Files
            </button>

          </div>

        </div>

        {/* Caption */}

        <div>

          <label className="mb-3 block text-sm font-medium">
            Today's Caption
          </label>

          <div className="relative">

            <textarea
              rows={12}
              placeholder="What did you accomplish today?"
              className="w-full resize-none rounded-3xl border border-zinc-800 bg-black p-5 outline-none transition focus:border-green-500"
            />

            <span className="absolute bottom-5 right-5 text-sm text-zinc-500">
              0/200
            </span>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="border-t border-zinc-800 p-7">

        <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-green-500 py-4 text-lg font-semibold text-green-400 transition hover:bg-green-500 hover:text-black">

          <Send size={20} />

          Post Check-in

        </button>

      </div>

    </section>
  );
};

export default DailyCheckIn;