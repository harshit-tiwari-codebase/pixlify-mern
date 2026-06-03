import React from "react";
import { Plus, UserPlus } from "lucide-react";

const Navbar = () => {
  return (
    <div className="w-full bg-black max-w-md lg:max-w-6xl h-12 items-center flex gap-2 justify-evenly px-2 sticky top-0 mb-3 border-b border-zinc-800">
      <h1 className="text-xl font-black italic tracking-wide bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent lg:text-2xl">
        Pixlify
      </h1>
      <input
        type="text"
        placeholder="Search users..."
        className="w-2/4 px-4 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
      />
      <div className="flex gap-3 items-center">
        <Plus className="cursor-pointer transition hover:scale-110 hover:text-violet-400" />

        <UserPlus className="cursor-pointer transition hover:scale-110 hover:text-violet-400" />
        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-violet-500/50">
          <img
            className="w-full h-full object-cover"
            src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
