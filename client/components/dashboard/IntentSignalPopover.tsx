import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  DollarSign,
  Target,
  X,
  TrendingUp,
  Zap,
  Activity,
  Sparkles,
  Download,
  Check,
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
  Area,
  AreaChart,
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
  itemId?: string;
  onAddToList?: (itemId: string, checked: boolean) => void;
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
      compositeScore: Math.max(
        0,
        Math.round(compositeBase * (0.2 + variation)),
      ),
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
  itemId,
  onAddToList,
}: IntentSignalPopoverProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartData = generateChartData(data);
  const [isAdded, setIsAdded] = useState(false);

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
      <div onClick={() => setIsPanelOpen(true)} className="cursor-pointer">
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
          {/* Header with Modern Design */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white sticky top-0 z-10 border-b border-slate-700">
            <div className="p-6">
              {/* Company Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-valasys-orange to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h2 className="text-xl font-bold truncate">
                      {data.companyName}
                    </h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                      Intent Signal Analysis
                    </p>
                  </div>
                </div>
                <div className="ml-3 flex items-center space-x-2 flex-shrink-0">
                  <Badge
                    className={cn(
                      "text-xs px-3 py-1.5 font-semibold whitespace-nowrap",
                      getIntentSignalColor(data.intentSignal),
                      data.intentSignal === "Super Strong" && "animate-badge-popup",
                    )}
                  >
                    {data.intentSignal}
                  </Badge>
                  {itemId && onAddToList && (
                    <button
                      onClick={() => {
                        onAddToList(itemId, !isAdded);
                        setIsAdded(!isAdded);
                      }}
                      className={cn(
                        "px-3 h-9 rounded-lg flex items-center justify-center gap-2 transition-all flex-shrink-0 text-xs font-medium whitespace-nowrap",
                        isAdded
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                      )}
                      title={isAdded ? "Remove from download" : "Add to download"}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Add to Download</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={closePanelClick}
                    className="w-9 h-9 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* VAIS Stat */}
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm rounded-xl p-3.5 border border-blue-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      VAIS Score
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">+12%</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {data.vais}%
                  </div>
                  <p className="text-xs text-slate-400 mt-1">vs. 3 weeks ago</p>
                </div>

                {/* Revenue Stat */}
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      Revenue
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-400">
                      <Zap className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">+8%</span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-white truncate">
                    {data.revenue}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">ARR Potential</p>
                </div>

                {/* Location/Momentum Stat */}
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm rounded-xl p-3.5 border border-purple-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      Momentum
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">High</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {data.city}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Strong Growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-5">
            <div className="space-y-6">
              {/* Intent Signal Breakdown Chart */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-valasys-orange to-orange-500 rounded-full"></div>
                    <span>Intent Signal Trend</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-500">7-week view</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>
                <div
                  className="border border-gray-200 rounded-xl bg-gradient-to-br from-slate-50 to-white cursor-pointer hover:border-valasys-orange hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  onClick={handleChartClick}
                  style={{ height: "320px" }}
                >
                  <ChartContainer
                    config={chartConfig}
                    className="w-full h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{
                          top: 15,
                          right: 30,
                          left: -5,
                          bottom: 15,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="colorComposite"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#EF4444"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#EF4444"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorDelta"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#6366F1"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366F1"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-10"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="week"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#999", fontSize: 12 }}
                        />
                        <YAxis
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#999", fontSize: 12 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="compositeScore"
                          stroke={chartConfig.compositeScore.color}
                          fillOpacity={1}
                          fill="url(#colorComposite)"
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
                        <Area
                          type="monotone"
                          dataKey="deltaScore"
                          stroke={chartConfig.deltaScore.color}
                          fillOpacity={1}
                          fill="url(#colorDelta)"
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
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="flex items-center justify-center mt-4">
                  <div className="flex items-center space-x-4 p-2.5 bg-blue-50 rounded-lg border border-blue-100 w-fit">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-medium">
                        Composite Score
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        ↑ 42% week-over-week
                      </p>
                    </div>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-medium">
                        Delta Score
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        ↑ 18% week-over-week
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Topics Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2.5 flex items-center space-x-2">
                  <div className="w-1 h-4 bg-gradient-to-b from-valasys-orange to-orange-500 rounded-full"></div>
                  <span>Top Topics</span>
                </h3>
                <div className="space-y-1.5">
                  {data.relatedTopics.slice(0, 3).map((topic, index) => {
                    const scores = [65, 63, 58];
                    const score =
                      scores[index] || Math.floor(Math.random() * 40 + 60);
                    const growthTrends = ["+24%", "+18%", "+12%"];
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-valasys-orange hover:bg-orange-50 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className="w-1.5 h-1.5 bg-valasys-orange rounded-full flex-shrink-0"></div>
                          <span className="text-xs font-medium text-gray-700 truncate">
                            {topic}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 font-semibold text-xs px-2">
                            {score}
                          </Badge>
                          <span className="text-xs font-semibold text-emerald-600 w-10 text-right">
                            {growthTrends[index]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Info */}
              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="bg-gradient-to-r from-valasys-orange/10 to-orange-500/10 border border-orange-200/50 rounded-lg p-3">
                  <p className="text-xs text-gray-700">
                    <span className="text-valasys-orange font-bold">
                      💡 Insight:
                    </span>{" "}
                    This company shows strong intent signals across multiple
                    topics with consistent week-over-week growth. Click the
                    chart for deeper analysis.
                  </p>
                </div>
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
