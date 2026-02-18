import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Download,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Search",
    href: "/find-prospect",
    icon: Search,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "History",
    href: "/my-downloads",
    icon: Download,
  },
  {
    name: "Profile",
    href: "/settings",
    icon: Settings,
  },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update active index when location changes
  useEffect(() => {
    const index = navItems.findIndex((item) => item.href === location.pathname);
    if (index !== -1) {
      setActiveIndex(index);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleNavigation = (item: NavItem, index: number) => {
    setActiveIndex(index);
    setIsAnimating(true);
    navigate(item.href);
  };

  return (
    <>
      {/* Add global styles for animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes floatUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-8px);
          }
        }

        .mobile-nav-animate {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mobile-nav-icon-animate {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mobile-nav-float {
          animation: floatUp 0.6s ease-in-out infinite;
        }
      `}</style>

      <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-40">
        <div className="relative px-4 pb-4">
          {/* Active Badge - Floating Circle */}
          <div
            className={cn(
              "absolute transform -translate-x-1/2 -top-6 transition-all duration-300",
              isAnimating ? "mobile-nav-icon-animate" : "",
            )}
            style={{
              left: `${10 + activeIndex * 20}%`,
              transition: "left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-valasys-orange to-valasys-orange-light rounded-full shadow-lg flex items-center justify-center">
              {React.createElement(navItems[activeIndex].icon, {
                className: "w-7 h-7 text-white",
              })}
            </div>
          </div>

          {/* Black Curved Bar */}
          <div
            className={cn(
              "relative bg-black/85 rounded-3xl shadow-xl backdrop-blur-sm transition-all duration-300 overflow-hidden",
              isAnimating ? "mobile-nav-animate" : "",
            )}
          >
            <div className="flex items-center justify-around h-20 px-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = activeIndex === index;

                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item, index)}
                    className={cn(
                      "flex flex-col items-center justify-center flex-1 h-full py-3 px-2 rounded-2xl transition-all duration-300 relative group",
                      active ? "text-white" : "text-gray-400 hover:text-gray-200",
                    )}
                    aria-current={active ? "page" : undefined}
                    title={item.name}
                  >
                    {!active && (
                      <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    )}
                    {!active && (
                      <span className="text-[10px] font-medium mt-1 opacity-70 group-hover:opacity-100">
                        {item.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
