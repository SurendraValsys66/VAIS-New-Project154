import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  DollarSign,
  Target,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import IntentSignalModal from "./IntentSignalModal";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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

const chartConfig = {
  compositeScore: {
    label: "Composite Score",
    color: "#EF4444", // Red/Orange color
  },
  deltaScore: {
    label: "Delta Score",
    color: "#6366F1", // Indigo/Blue color
  },
};

const generateChartData = (intentData: IntentSignalData) => {
  const baseData = [];
  const compositeBase = intentData.compositeScore;
  const deltaBase = intentData.deltaScore;

  // Generate 7 weeks of data
  for (let i = 0; i < 7; i++) {
    const variation = (i / 6) * 0.6; // Progressive increase from week 1 to week 7
    baseData.push({
      week: `week${i + 1}`,
      compositeScore: Math.max(0, Math.round(compositeBase * (0.2 + variation))),
      deltaScore: Math.max(0, Math.round(deltaBase * (0.2 + variation))),
    });
  }
  return baseData;
};

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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartData = generateChartData(data);

  const handleChartClick = () => {
    setIsPanelOpen(false);
    setIsModalOpen(true);
  };

  const closePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPanelOpen(false);
  };

  return (
    <>
      {/* Trigger - Clone and add onClick handler */}
      <div
        onClick={() => setIsPanelOpen(true)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {/* Right-side Slide-in Panel */}
      <div
        className={cn(
          "fixed inset-0 z-50",
          isPanelOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/30 transition-opacity",
            isPanelOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setIsPanelOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[50%] max-w-2xl bg-white shadow-2xl transition-transform duration-300 overflow-auto flex flex-col",
            isPanelOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-valasys-orange to-orange-500 text-white sticky top-0 z-10 border-b border-orange-600">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold truncate">{data.companyName}</h2>
                    <p className="text-xs opacity-85">Intent Signal Analysis</p>
                  </div>
                </div>
                <div className="ml-3 flex items-center space-x-2 flex-shrink-0">
                  <Badge
                    className={cn(
                      "text-xs px-2 py-1 font-medium whitespace-nowrap",
                      getIntentSignalColor(data.intentSignal),
                    )}
                  >
                    {data.intentSignal}
                  </Badge>
                  <button
                    onClick={closePanelClick}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Quick Stats in Header */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 text-center">
                  <div className="text-xs opacity-85 mb-0.5">VAIS</div>
                  <div className="text-sm font-bold">{data.vais}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 text-center">
                  <div className="text-xs opacity-85 mb-0.5">Revenue</div>
                  <div className="text-xs font-semibold truncate">{data.revenue}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 text-center">
                  <div className="text-xs opacity-85 mb-0.5">Location</div>
                  <div className="text-xs font-semibold truncate">{data.city}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-5">
            <div className="space-y-6">
              {/* Intent Signal Breakdown Chart */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <div className="w-1 h-5 bg-valasys-orange rounded-full"></div>
                  <span>Intent Signal Breakdown</span>
                </h3>
                <div
                  className="border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white cursor-pointer hover:border-valasys-orange hover:shadow-md transition-all duration-300 overflow-hidden"
                  onClick={handleChartClick}
                  style={{ height: "280px" }}
                >
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-20"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="week"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#999" }}
                        />
                        <YAxis
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#999" }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="compositeScore"
                          stroke={chartConfig.compositeScore.color}
                          strokeWidth={2.5}
                          dot={{
                            fill: chartConfig.compositeScore.color,
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{
                            r: 6,
                          }}
                          isAnimationActive={true}
                        />
                        <Line
                          type="monotone"
                          dataKey="deltaScore"
                          stroke={chartConfig.deltaScore.color}
                          strokeWidth={2.5}
                          dot={{
                            fill: chartConfig.deltaScore.color,
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{
                            r: 6,
                          }}
                          isAnimationActive={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center hover:text-valasys-orange transition-colors cursor-pointer">
                  Click to view full breakdown →
                </p>
              </div>

              {/* Topics Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <div className="w-1 h-5 bg-valasys-orange rounded-full"></div>
                  <span>High Intent Topics</span>
                </h3>
                <div className="space-y-3">
                  {data.relatedTopics.slice(0, 3).map((topic, index) => {
                    const scores = [65, 63, 58];
                    const score = scores[index] || Math.floor(Math.random() * 40 + 60);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:border-valasys-orange hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-2 h-2 bg-valasys-orange rounded-full group-hover:scale-125 transition-transform"></div>
                          <span className="text-sm text-gray-700 font-medium">{topic}</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 font-semibold text-xs">
                          {score}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
                {data.relatedTopics.length > 3 && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Showing 3 of {data.relatedTopics.length} topics
                  </p>
                )}
              </div>

              {/* Footer Info */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 text-center">
                  <span className="text-valasys-orange font-semibold">Tip:</span> Click the chart to view detailed breakdown
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Modal - shown when user clicks on chart */}
      <IntentSignalModal
        data={data}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
