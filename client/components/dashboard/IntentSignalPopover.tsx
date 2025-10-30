import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  DollarSign,
  Target,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IntentSignalModal from "./IntentSignalModal";

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

interface IntentSignalPopoverProps {
  data: IntentSignalData;
  children: React.ReactNode;
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

export default function IntentSignalPopover({
  data,
  children,
}: IntentSignalPopoverProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExpandClick = () => {
    setIsPopoverOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start" side="right">
          <div className="space-y-4">
            {/* Company Header */}
            <div className="border-b pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-valasys-orange" />
                  <h4 className="text-sm font-bold text-gray-900">
                    {data.companyName}
                  </h4>
                </div>
                <Badge
                  className={cn(
                    "text-xs",
                    getIntentSignalColor(data.intentSignal),
                  )}
                >
                  {data.intentSignal}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3 text-valasys-orange" />
                  <span>
                    VAIS:{" "}
                    <span className="font-semibold text-valasys-orange">
                      {data.vais.toFixed(1)}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  <span>{data.revenue}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>{data.city}</span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-gray-700">Metrics</h5>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <div className="text-blue-600 font-medium text-xs">
                    Composite
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    {data.compositeScore}
                  </div>
                </div>
                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <div className="text-green-600 font-medium text-xs">
                    Delta
                  </div>
                  <div className="text-lg font-bold text-green-800">
                    {data.deltaScore.toFixed(1)}
                  </div>
                </div>
                <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                  <div className="text-yellow-600 font-medium text-xs">
                    Topics
                  </div>
                  <div className="text-lg font-bold text-yellow-800">
                    {data.matchedTopics}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Topics Preview */}
            {data.relatedTopics.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-gray-700">
                  High Intent Topics
                </h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {data.relatedTopics.slice(0, 3).map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
                    >
                      <span>{topic}</span>
                      <div className="w-1.5 h-1.5 bg-valasys-orange rounded-full"></div>
                    </div>
                  ))}
                  {data.relatedTopics.length > 3 && (
                    <div className="text-xs text-gray-500 italic pt-1">
                      +{data.relatedTopics.length - 3} more topics
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expand Button */}
            <Button
              onClick={handleExpandClick}
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              View Full Breakdown
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Full Modal - shown when user clicks "View Full Breakdown" */}
      <IntentSignalModal
        data={data}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
