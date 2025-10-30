import React from "react";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  (props, ref) => React.createElement(RouterLink, { ...props, ref }),
);
