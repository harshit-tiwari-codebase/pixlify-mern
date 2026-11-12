import React, { useRef, useState } from "react";
import { Camera, CheckCircle2, ImagePlus } from "lucide-react";

const CheckInCard = ({ progress, onCheckIn }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    if (!image) return;

    onCheckIn({
      image,
      caption,
    });

    setCaption("");
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (progress?.checkedInToday) {
    return (
      <div className="rounded-[32px] border-[2.5px] border-black bg-white p-6 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="rounded-2xl border-2 border-black bg-[#D5F94C] p-4 shadow-[2px_2px_0px_#000]">
            <CheckCircle2 className="text-black" size={36} />
          </div>

          <h2 className="mt-4 text-xl font-extrabold text-black">
            Check-in Completed 🎉
          </h2>

          <p className="mt-1 text-xs font-semibold text-zinc-600 max-w-xs">
            Great work! Come back tomorrow and continue your streak.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border-[2.5px] border-black bg-white p-6 shadow-[4px_4px_0px_#000]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border-2 border-black bg-[#FED7A5] p-2.5 shadow-[2px_2px_0px_#000]">
          <Camera className="text-black" size={20} />
        </div>

        <div>
          <h2 className="text-base font-extrabold text-black">
            Today's Check-in
          </h2>
          <p className="text-xs font-semibold text-zinc-600">
            Upload proof for today's progress.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="mt-5 flex h-48 cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-black bg-[#EBE6FB]/30 hover:bg-[#EBE6FB]/60 transition overflow-hidden"
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <div className="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center mx-auto shadow-[1px_1px_0px_#000]">
              <ImagePlus className="text-black" size={20} />
            </div>
            <p className="mt-2 text-xs font-bold text-black">
              Click to select proof photo
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setImage(file);
          }
        }}
      />

      {/* Caption */}
      <textarea
        rows={3}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="How was today's challenge?"
        className="mt-4 w-full rounded-2xl border-2 border-black bg-white p-3 text-xs font-bold text-black placeholder:text-zinc-400 outline-none shadow-[2px_2px_0px_#000]"
      />

      {/* Button */}
      <button
        disabled={!image}
        onClick={handleSubmit}
        className="mt-4 w-full rounded-2xl border-2 border-black bg-[#FF6B4A] hover:bg-[#ff5a36] py-3 text-xs font-extrabold text-white shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Check-in
      </button>
    </div>
  );
};

export default CheckInCard;
