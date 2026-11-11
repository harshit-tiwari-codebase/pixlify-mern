import React from "react";
import {
  House,
  Trophy,
  PlusCircle,
  LayoutDashboard,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavbar = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: House,
      path: "/feed",
      label: "Home",
    },
    {
      icon: Trophy,
      path: "/challangeFeed",
      label: "Challenges",
    },
    {
      icon: PlusCircle,
      path: "/createPost",
      label: "Post",
    },
    {
      icon: LayoutDashboard,
      path: "/dashboard",
      label: "Dashboard",
    },
    {
      icon: User,
      path: "/myProfile",
      label: "Profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-zinc-800/80 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname.toLowerCase() === item.path.toLowerCase();

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
                active
                  ? "text-violet-400 scale-105"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon
                size={22}
                className={active ? "stroke-[2.5]" : "stroke-[1.8]"}
              />
              <span className={`text-[11px] mt-1 font-medium ${active ? "text-violet-400" : "text-zinc-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
