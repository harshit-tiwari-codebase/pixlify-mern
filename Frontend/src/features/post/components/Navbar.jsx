import React from "react";
import { Plus, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <nav
      className="
        w-full
        max-w-md
        lg:max-w-6xl
        mx-auto
        h-16
        px-4
        flex
        items-center
        justify-between
        bg-black/80
        backdrop-blur-xl
        border-b
        border-zinc-800/70
      "
    >
      {/* Logo */}
      <h1
        className="
          text-2xl
          font-black
          italic
          tracking-wide
          bg-gradient-to-r
          from-violet-500
          via-fuchsia-500
          to-pink-500
          bg-clip-text
          text-transparent
        "
      >
        Pixlify
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="
          hidden
          md:block
          w-72
          rounded-xl
          border
          border-zinc-800
          bg-zinc-900/70
          px-4
          py-2
          text-white
          placeholder:text-zinc-500
          outline-none
          transition
          focus:border-violet-500
        "
      />

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link to="/createPost" className="transition hover:scale-110">
          <Plus />
        </Link>

        <UserPlus
          className="
            cursor-pointer
            transition
            hover:scale-110
            hover:text-violet-400
          "
        />

        <div
          onClick={() => navigate("/myProfile")}
          className="
            h-9
            w-9
            cursor-pointer
            overflow-hidden
            rounded-full
            ring-2
            ring-violet-500/40
            transition
            hover:scale-105
          "
        >
          <img
            src={
              user?.profile ||
              user?.profile_img ||
              `https://ui-avatars.com/api/?name=${user?.user || user?.username || "User"}`
            }
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
