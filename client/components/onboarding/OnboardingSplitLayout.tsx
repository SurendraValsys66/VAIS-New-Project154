import React from "react";
import { Link } from "@/lib/utils";

export default function OnboardingSplitLayout({
  left,
  right,
  logoSrc,
  logoAlt = "VAIS Logo",
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
}) {
  return (
    <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Logo top-left */}
      {logoSrc ? (
        <div className="pointer-events-auto absolute left-4 top-4 md:left-6 md:top-6 z-20">
          <Link to="/" className="inline-flex items-center">
            <img src={logoSrc} alt={logoAlt} className="h-9 w-auto" />
          </Link>
        </div>
      ) : null}

      {/* Left side - centered like right */}
      <div className="relative bg-white">
        <div className="mx-auto w-full max-w-3xl px-6 sm:px-8 py-10 md:py-16 min-h-screen md:min-h-screen flex items-center">
          {left}
        </div>
      </div>

      {/* Right side */}
      <div className="relative hidden md:block bg-white">{right}</div>
    </div>
  );
}
