import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  calculateMasteryPercentage,
  getMastery,
  MasterySteps,
  MASTERY_EVENT,
} from "@/lib/masteryStorage";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useMasteryAnimation } from "@/contexts/MasteryAnimationContext";

interface MasteryProgressBadgeProps {
  onClick?: () => void;
}

export default function MasteryProgressBadge({
  onClick,
}: MasteryProgressBadgeProps) {
  const { isAnimating, badgeRef } = useMasteryAnimation();
  const [state, setState] = useState<MasterySteps>({});
  const [prevPercent, setPrevPercent] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    setState(getMastery());
    const onUpdate = (e: Event) => {
      setState((e as CustomEvent).detail as MasterySteps);
    };
    window.addEventListener(MASTERY_EVENT, onUpdate as EventListener);
    const id = setInterval(() => setState(getMastery()), 3000);
    return () => {
      window.removeEventListener(MASTERY_EVENT, onUpdate as EventListener);
      clearInterval(id);
    };
  }, []);

  const percent = calculateMasteryPercentage(state);

  useEffect(() => {
    if (percent > prevPercent) {
      setShowBadge(true);
      const timer = setTimeout(() => setShowBadge(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevPercent(percent);
  }, [percent, prevPercent]);

  useEffect(() => {
    if (isAnimating) {
      // Show badge after animation completes
      const timer = setTimeout(() => {
        // Badge is already visible when isAnimating is true
      }, 600); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const isDismissed = (() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("valasys-mastery-dismissed") === "1";
    } catch {
      return false;
    }
  })();

  const isMasteryMinimized = (() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("valasys-mastery-minimized") === "1";
    } catch {
      return false;
    }
  })();

  if (isDismissed) return null;

  // Render with zero opacity when not minimized and not animating
  const isVisible = isMasteryMinimized || isAnimating;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          ref={badgeRef}
          className="relative cursor-pointer"
          onClick={onClick}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            !isVisible
              ? { opacity: 0, scale: 0.8 }
              : isAnimating
                ? showBadge
                  ? { opacity: 1, scale: [1, 1.1, 1] }
                  : { opacity: 1, scale: 1 }
                : { opacity: 1, scale: 1 }
          }
          transition={{
            duration: showBadge ? 0.6 : 0.5,
            ease: "easeOut",
          }}
        >
          <div className="relative flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              {/* Pulsing outer ring when animating */}
              {showBadge && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-valasys-orange"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{
                    width: "32px",
                    height: "32px",
                    left: "-6px",
                    top: "-6px",
                  }}
                />
              )}

              {/* Main badge */}
              <motion.div
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm",
                  "bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white",
                  "shadow-md hover:shadow-lg transition-shadow cursor-pointer",
                  showBadge && "ring-2 ring-valasys-orange ring-opacity-50",
                )}
                animate={
                  showBadge
                    ? {
                        backgroundColor: [
                          "rgb(255, 122, 0)",
                          "rgb(255, 200, 0)",
                          "rgb(255, 122, 0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.6 }}
              >
                {/* Progress circle */}
                <div className="relative w-5 h-5">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-full h-full transform -rotate-90"
                  >
                    {/* Background circle */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeDasharray={`${100} 100`}
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - percent }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Center percentage text */}
                  <motion.span
                    className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white"
                    animate={showBadge ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {percent}
                  </motion.span>
                </div>

                {/* Label */}
                <span className="hidden sm:inline">VAIS</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-gray-900 text-white border-0">
        <div className="space-y-1">
          <div className="font-semibold">Your VAIS Mastery: {percent}%</div>
          <div className="text-xs text-gray-300">
            Complete all steps to unlock full potential
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
