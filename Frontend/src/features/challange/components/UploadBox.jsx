import { useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";

const UploadBox = ({
  image,
  setImage,
}) => {
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
          className="
            cursor-pointer
            overflow-hidden
            rounded-3xl
            border
            border-zinc-800
          "
        >
          <img
            src={URL.createObjectURL(image)}
            alt=""
            className="h-72 w-full object-cover"
          />
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          className="
            flex
            h-72
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-3xl
            border-2
            border-dashed
            border-zinc-700
            bg-black
            transition-all
            duration-300
            hover:border-violet-500
            hover:bg-zinc-950
          "
        >
          <div className="rounded-full bg-violet-500/10 p-5">
            <UploadCloud
              size={42}
              className="text-violet-400"
            />
          </div>

          <h3 className="mt-6 text-xl font-semibold">
            Upload Proof
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            PNG, JPG or JPEG (Max 5MB)
          </p>

          <button className="mt-7 flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 transition hover:border-violet-500">
            <ImageIcon size={18} />

            Browse Image
          </button>
        </div>
      )}

    </div>
  );
};

export default UploadBox;