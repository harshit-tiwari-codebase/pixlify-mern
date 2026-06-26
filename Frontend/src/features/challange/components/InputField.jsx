const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  maxLength = 60,
}) => {
  return (
    <div className="space-y-3">

      <label className="block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div className="relative">

        <input
          type="text"
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          className="
            w-full
            rounded-2xl
            border
            border-zinc-800
            bg-black
            px-5
            py-4
            text-white
            placeholder:text-zinc-500
            outline-none
            transition-all
            duration-300
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-500/20
          "
        />

        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
          {value.length}/{maxLength}
        </span>

      </div>

    </div>
  );
};

export default InputField;