import React, { createContext, useContext, useState, useRef } from "react";

interface MasteryAnimationContextType {
  isAnimating: boolean;
  startAnimation: () => void;
  endAnimation: () => void;
  badgeRef: React.RefObject<HTMLDivElement>;
  getBadgePosition: () => { x: number; y: number } | null;
}

const MasteryAnimationContext = createContext<
  MasteryAnimationContextType | undefined
>(undefined);

export function MasteryAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const startAnimation = () => {
    setIsAnimating(true);
  };

  const endAnimation = () => {
    setIsAnimating(false);
  };

  const getBadgePosition = () => {
    if (!badgeRef.current) return null;
    const rect = badgeRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  return (
    <MasteryAnimationContext.Provider
      value={{
        isAnimating,
        startAnimation,
        endAnimation,
        badgeRef,
        getBadgePosition,
      }}
    >
      {children}
    </MasteryAnimationContext.Provider>
  );
}

export function useMasteryAnimation() {
  const context = useContext(MasteryAnimationContext);
  if (!context) {
    throw new Error(
      "useMasteryAnimation must be used within MasteryAnimationProvider",
    );
  }
  return context;
}
