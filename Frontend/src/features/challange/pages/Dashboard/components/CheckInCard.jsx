import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
} from "lucide-react";

const CheckInCard = ({
  progress,
  onCheckIn,
}) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (!image) return;

    onCheckIn({
      image,
      caption,
    });

    setCaption("");
    setImage(null);
  };

  if (progress?.checkedInToday) {
    return (
      <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-6">
        <div className="flex flex-col items-center justify-center text-center">

          <div className="rounded-full bg-green-500/10 p-4">
            <CheckCircle2
              className="text-green-400"
              size={40}
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            Check-in Completed 🎉
          </h2>

          <p className="mt-2 text-zinc-400">
            Great work! Come back tomorrow and
            continue your streak.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

      {/* Header */}

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-violet-500/10 p-3">
          <Camera
            className="text-violet-400"
            size={22}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Today's Check-in
          </h2>

          <p className="text-sm text-zinc-500">
            Upload proof for today's progress.
          </p>
        </div>

      </div>

      {/* Upload */}

      <label
        htmlFor="image"
        className="mt-8 flex h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-black/20 transition hover:border-violet-500"
      >

        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt=""
            className="h-full w-full rounded-3xl object-cover"
          />
        ) : (
          <>
            <ImagePlus
              className="text-zinc-500"
              size={42}
            />

            <p className="mt-3 text-sm text-zinc-400">
              Click to upload image
            </p>
          </>
        )}

      </label>

      <input
        id="image"
        hidden
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(e.target.files[0])
        }
      />

      {/* Caption */}

      <textarea
        rows={4}
        value={caption}
        onChange={(e) =>
          setCaption(e.target.value)
        }
        placeholder="How was today's challenge?"
        className="mt-6 w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm outline-none transition focus:border-violet-500"
      />

      {/* Button */}

      <button
        disabled={!image}
        onClick={handleSubmit}
        className="mt-6 w-full rounded-2xl bg-violet-600 py-4 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit Check-in
      </button>

    </div>
  );
};

export default CheckInCard;