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
  ChevronRight,
  Users,
  Globe,
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

interface TopicDataItem {
  name: string;
  score: number;
  personas: string[];
  metros: string[];
  domains: string[];
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

const generateChartData = (
  intentData: IntentSignalData,
  selectedTopic?: string,
) => {
  const baseData = [];
  let baseValue = intentData.compositeScore;

  // If a topic is selected, generate data specific to that topic
  if (selectedTopic) {
    // Generate topic-specific scores based on topic index and name
    const topicIndex = intentData.relatedTopics.indexOf(selectedTopic);
    const baseScores = [65, 63, 58];
    baseValue = baseScores[topicIndex] || 60;
  }

  // Generate 7 weeks of data
  for (let i = 0; i < 7; i++) {
    const variation = (i / 6) * 0.6; // Progressive increase from week 1 to week 7
    const value = Math.max(0, Math.round(baseValue * (0.2 + variation)));

    if (selectedTopic) {
      // When a topic is selected, show only one data series
      baseData.push({
        week: `week${i + 1}`,
        score: value,
      });
    } else {
      // Default view with both composite and delta scores
      baseData.push({
        week: `week${i + 1}`,
        compositeScore: Math.max(
          0,
          Math.round(intentData.compositeScore * (0.2 + variation)),
        ),
        deltaScore: Math.max(
          0,
          Math.round(intentData.deltaScore * (0.2 + variation)),
        ),
      });
    }
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
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const chartData = generateChartData(data, selectedTopic);
  const [isAdded, setIsAdded] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set([0]));

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
                      data.intentSignal === "Super Strong" &&
                        "animate-badge-popup",
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
                          : "bg-slate-700 hover:bg-slate-600 text-slate-200",
                      )}
                      title={
                        isAdded ? "Remove from download" : "Add to download"
                      }
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

          {/* Content Area - Flexbox layout with fixed chart and scrollable content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Fixed Intent Signal Trend Chart Section */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-valasys-orange to-orange-500 rounded-full"></div>
                  <span>
                    {selectedTopic
                      ? `${selectedTopic} Intent Trend`
                      : "Intent Signal Trend"}
                  </span>
                </h3>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-500">7-week view</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  {selectedTopic && (
                    <button
                      onClick={() => setSelectedTopic(undefined)}
                      className="ml-2 px-2 py-1 text-valasys-orange hover:bg-orange-50 rounded transition-colors"
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>
              </div>
              <div
                className="border border-gray-200 rounded-xl bg-gradient-to-br from-slate-50 to-white cursor-pointer hover:border-valasys-orange hover:shadow-lg transition-all duration-300 overflow-hidden group"
                onClick={handleChartClick}
                style={{ height: "320px" }}
              >
                <ChartContainer config={chartConfig} className="w-full h-full">
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
                        <linearGradient
                          id="colorScore"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#F59E0B"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#F59E0B"
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
                      {selectedTopic ? (
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#F59E0B"
                          fillOpacity={1}
                          fill="url(#colorScore)"
                          strokeWidth={2.5}
                          dot={{
                            fill: "#F59E0B",
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{
                            r: 6,
                          }}
                          isAnimationActive={true}
                        />
                      ) : (
                        <>
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
                        </>
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="flex items-center justify-center mt-4">
                {selectedTopic ? (
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 w-fit">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 font-medium">
                        {selectedTopic} Intent Score
                      </p>
                      <p className="text-xs font-bold text-gray-900">
                        ↑ 24% week-over-week
                      </p>
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-auto p-5">
              <div className="space-y-6">
                {/* Topics Section - Compact Expandable List */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-valasys-orange to-orange-500 rounded-full"></div>
                    <span>Top Topics</span>
                    <span className="text-xs font-normal text-gray-500 ml-auto">
                      Click to expand
                    </span>
                  </h3>

                  {/* Topics List */}
                  <div className="space-y-2">
                    {data.relatedTopics.slice(0, 3).map((topic, index) => {
                      const topicsData: TopicDataItem[] = [
                        {
                          name: "Fair Value Measurement",
                          score: 61,
                          personas: ["CFO", "Controller", "Accounting Manager"],
                          metros: ["New York, NY", "San Francisco, CA", "Chicago, IL"],
                          domains: ["Financial Services", "Accounting", "Audit"],
                        },
                        {
                          name: "Goodwill Accounting",
                          score: 73,
                          personas: ["Financial Analyst", "M&A Manager", "Auditor"],
                          metros: ["Boston, MA", "Los Angeles, CA", "Dallas, TX"],
                          domains: ["Banking", "Private Equity", "Consulting"],
                        },
                        {
                          name: "Revenue Recognition",
                          score: 58,
                          personas: ["Revenue Analyst", "Compliance Officer", "CFO"],
                          metros: ["Seattle, WA", "Denver, CO", "Austin, TX"],
                          domains: ["SaaS", "Technology", "Software"],
                        },
                      ];

                      const currentTopic = topicsData[index] || {
                        name: topic,
                        score: Math.floor(Math.random() * 40 + 60),
                        personas: ["Manager", "Analyst"],
                        metros: ["New York, NY"],
                        domains: ["Technology"],
                      };

                      const isExpanded = expandedTopics.has(index);
                      const isSelected = selectedTopic === topic;

                      const getScoreBadgeColor = (score: number) => {
                        if (score >= 70) return "bg-green-100 text-green-800";
                        if (score >= 50) return "bg-yellow-100 text-yellow-800";
                        return "bg-red-100 text-red-800";
                      };

                      const toggleExpand = () => {
                        const newExpanded = new Set(expandedTopics);
                        if (newExpanded.has(index)) {
                          newExpanded.delete(index);
                        } else {
                          newExpanded.add(index);
                        }
                        setExpandedTopics(newExpanded);
                      };

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 bg-white hover:border-valasys-orange hover:shadow-md"
                        >
                          {/* Header */}
                          <button
                            onClick={toggleExpand}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3 flex-1 text-left">
                              {/* Score Badge */}
                              <Badge className={cn("font-bold text-xs flex-shrink-0", getScoreBadgeColor(currentTopic.score))}>
                                {currentTopic.score}
                              </Badge>

                              {/* Topic Name */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-valasys-orange transition-colors">
                                  {currentTopic.name}
                                </h4>
                              </div>
                            </div>

                            {/* Expand/Collapse Icon */}
                            <div className="flex-shrink-0 ml-2">
                              <div className={cn(
                                "w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-orange-50 transition-all",
                                isExpanded && "bg-valasys-orange/10"
                              )}>
                                <ChevronRight className={cn(
                                  "w-4 h-4 text-gray-600 group-hover:text-valasys-orange transition-all",
                                  isExpanded && "rotate-90 text-valasys-orange"
                                )} />
                              </div>
                            </div>
                          </button>

                          {/* Expandable Content */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

                              {/* B2B Personas */}
                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-blue-600" />
                                  B2B Personas
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {currentTopic.personas.map((persona, i) => (
                                    <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800 text-xs font-normal">
                                      {persona}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Top Metros */}
                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-green-600" />
                                  Top Metros
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {currentTopic.metros.map((metro, i) => (
                                    <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 text-xs font-normal">
                                      {metro}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Domain Origin */}
                              <div>
                                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                                  Domain Origin
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {currentTopic.domains.map((domain, i) => (
                                    <Badge key={i} variant="secondary" className="bg-purple-100 text-purple-800 text-xs font-normal">
                                      {domain}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Divider */}
                              <div className="border-t border-gray-200 pt-3 flex gap-2">
                                {/* View Trend Button */}
                                <button
                                  onClick={() => {
                                    setSelectedTopic(selectedTopic === topic ? undefined : topic);
                                  }}
                                  className={cn(
                                    "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                                    selectedTopic === topic
                                      ? "bg-valasys-orange text-white border border-valasys-orange"
                                      : "bg-orange-50 text-valasys-orange border border-orange-200 hover:border-valasys-orange hover:bg-orange-100"
                                  )}
                                >
                                  {selectedTopic === topic ? "✓ Viewing Trend" : "View Trend"}
                                </button>
                              </div>
                            </div>
                          )}
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
