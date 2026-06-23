import React from "react";
import {
  House,
  Trophy,
  PlusCircle,
  Flame,
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
      path: "/challenges/create",
      label: "Create Challange",
    },
    {
      icon: Flame,
      path: "/streaks",
      label: "Streaks",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 z-50">
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center text-xs transition-colors ${
                active
                  ? "text-white"
                  : "text-zinc-400"
              }`}
            >
              <Icon
                size={22}
                color="#fff"
                strokeWidth={active ? 2.5 : 2}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;