import React from "react";

const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  maxLength = 60,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-black">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3 text-xs font-bold text-black placeholder:text-zinc-400 outline-none shadow-[2px_2px_0px_#000] focus:ring-2 focus:ring-[#FF6B4A]/30 transition"
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default InputField;
