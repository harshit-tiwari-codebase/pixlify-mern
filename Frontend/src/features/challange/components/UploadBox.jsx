import React, { useRef } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

const UploadBox = ({ image, setImage }) => {
  const inputRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  return (
    <div>
      <input
        type="file"
        hidden
        accept="image/*"
        ref={inputRef}
        onChange={handleImage}
      />

      {image ? (
        <div
          onClick={() => inputRef.current.click()}
          className="cursor-pointer overflow-hidden rounded-[28px] border-2 border-black shadow-[3px_3px_0px_#000] relative group"
        >
          <img
            src={URL.createObjectURL(image)}
            alt="Upload proof"
            className="h-64 w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="rounded-full bg-white border-2 border-black px-4 py-1.5 text-xs font-bold text-black shadow-[2px_2px_0px_#000]">
              Change Image
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-black bg-white hover:bg-[#EBE6FB]/40 transition shadow-[3px_3px_0px_#000]"
        >
          <div className="rounded-2xl border-2 border-black bg-[#FED7A5] p-3.5 shadow-[2px_2px_0px_#000]">
            <UploadCloud size={28} className="text-black stroke-[2.5]" />
          </div>

          <h3 className="mt-4 text-sm font-extrabold text-black">
            Upload Progress Photo
          </h3>

          <p className="mt-1 text-xs font-semibold text-zinc-500">
            PNG, JPG or WEBP (Max 5MB)
          </p>

          <span className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black shadow-[2px_2px_0px_#000]">
            <ImageIcon size={14} />
            Browse File
          </span>
        </div>
      )}
    </div>
  );
};

export default UploadBox;
