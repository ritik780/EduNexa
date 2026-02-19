import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  PlusSquare,
  User,
  Bell,
  Brain,
  PlaySquare
} from "lucide-react";

const BottomNavbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/ai-generator", label: "AI", icon: Brain },
    { path: "/feed", label: "Feed", icon: BookOpen },
    { path: "/upload", label: "Upload", icon: PlusSquare, center: true },
    { path: "/reels", label: "Reels", icon: PlaySquare },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-3xl 
      bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-xl 
      border border-black/10 dark:border-white/10 
      shadow-2xl rounded-2xl z-50 px-4 py-3">

      <div className="flex justify-between items-center relative">

        {navItems.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;

          /* CENTER UPLOAD BUTTON */
          if (item.center) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -mt-8"
              >
                <div
                  className="w-14 h-14 rounded-full bg-linear-to-r 
                  from-[#8335ED] to-[#16B9AB] 
                  flex items-center justify-center 
                  shadow-xl hover:scale-110 transition"
                >
                  <Icon size={28} className="text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center flex-1"
            >
              {/* ICON */}
              <div
                className={`relative transition-all duration-300 ${
                  active
                    ? "text-[#8335ED] scale-110 drop-shadow-[0_0_10px_#8335ED]"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Icon size={24} strokeWidth={2.2} />

              
              </div>

              {/* LABEL */}
              <span
                className={`text-[11px] mt-1 transition ${
                  active
                    ? "text-[#8335ED] font-semibold"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.label}
              </span>

              {/* ACTIVE INDICATOR */}
              {active && (
                <span className="absolute -bottom-2 w-8 h-0.75 
                  bg-linear-to-r from-[#8335ED] to-[#16B9AB] 
                  rounded-full animate-slide" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;
