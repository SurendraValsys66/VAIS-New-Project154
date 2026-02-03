import React from "react";
import { Badge } from "@/components/ui/badge";
import IntentSignalPopover from "./IntentSignalPopover";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface IntentSignalData {
  compositeScore: number;
  deltaScore: number;
  matchedTopics: number;
  intentSignal: string;
  companyName: string;
  vais: number;
  revenue: string;
  city: string;
  relatedTopics: string[];
}

interface IntentSignalChartProps {
  data: IntentSignalData;
  className?: string;
  isLocked?: boolean;
  onLockClick?: () => void;
  itemId?: string;
  onAddToList?: (itemId: string, checked: boolean) => void;
}

const getIntentSignalColor = (signal: string) => {
  switch (signal) {
    case "Super Strong":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Very Strong":
      return "bg-green-100 text-green-800 border border-green-200";
    case "Strong":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Medium":
      return "bg-orange-100 text-orange-800 border border-orange-200";
    case "Weak":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export default function IntentSignalChart({
  data,
  className,
  isLocked = false,
  onLockClick,
  itemId,
  onAddToList,
}: IntentSignalChartProps) {
  if (isLocked) {
    return (
      <div className="relative inline-block">
        <Badge
          className={cn(
            "font-medium",
            getIntentSignalColor(data.intentSignal),
            className,
          )}
        >
          {data.intentSignal}
        </Badge>
        <div
          onClick={onLockClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onLockClick?.();
            }
          }}
          className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 transition-colors"
        >
          <Lock className="w-4 h-4 text-gray-700" />
        </div>
      </div>
    );
  }

  return (
    <IntentSignalPopover data={data} itemId={itemId} onAddToList={onAddToList}>
      <Badge
        className={cn(
          "font-medium cursor-pointer",
          getIntentSignalColor(data.intentSignal),
          className,
        )}
      >
        {data.intentSignal}
      </Badge>
    </IntentSignalPopover>
  );
}
