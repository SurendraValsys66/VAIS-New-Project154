import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Building2,
  MapPin,
  DollarSign,
  Target,
  Lock,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface IntentSignalModalProps {
  data: IntentSignalData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const chartConfig = {
  compositeScore: {
    label: "Composite Score",
    color: "hsl(220, 70%, 50%)",
  },
  deltaScore: {
    label: "Delta Score",
    color: "hsl(120, 60%, 50%)",
  },
  matchedTopics: {
    label: "Matched Topics",
    color: "hsl(280, 70%, 55%)",
  },
};

const generateChartData = (intentData: IntentSignalData) => {
  const baseData = [];
  const compositeBase = intentData.compositeScore;
  const deltaBase = intentData.deltaScore;
  const topicsBase = intentData.matchedTopics;

  for (let i = 0; i < 12; i++) {
    const variation = (Math.random() - 0.5) * 0.15;
    baseData.push({
      month: `Month ${i + 1}`,
      compositeScore: Math.max(
        0,
        Math.round(compositeBase + compositeBase * variation),
      ),
      deltaScore: Math.max(
        0,
        Math.round(deltaBase + deltaBase * variation * 100) / 100,
      ),
      matchedTopics: Math.max(
        0,
        Math.round(topicsBase + topicsBase * variation),
      ),
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

export default function IntentSignalModal({
  data,
  isOpen,
  onOpenChange,
}: IntentSignalModalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const chartData = generateChartData(data);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  const handleClose = () => {
    setIsUnlocked(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-xl">Intent Signal Breakdown</DialogTitle>
          <DialogClose onClick={handleClose} />
        </DialogHeader>

        {!isUnlocked ? (
          <div className="space-y-4 py-6">
            {/* Locked Content */}
            <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center space-y-4">
              {/* Blurred preview */}
              <div className="blur-sm select-none pointer-events-none">
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Building2 className="w-4 h-4 text-valasys-orange" />
                        <h3 className="text-lg font-bold text-valasys-gray-900">
                          {data.companyName}
                        </h3>
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
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="text-blue-600 font-medium">
                        Composite Score
                      </div>
                      <div className="text-xl font-bold text-blue-800">
                        {data.compositeScore}
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-md">
                      <div className="text-green-600 font-medium">
                        Delta Score
                      </div>
                      <div className="text-xl font-bold text-green-800">
                        {data.deltaScore.toFixed(1)}
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <div className="text-yellow-600 font-medium">Topics</div>
                      <div className="text-xl font-bold text-yellow-800">
                        {data.matchedTopics}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 rounded-lg flex items-center justify-center bg-white/60 backdrop-blur-sm">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-valasys-orange rounded-full">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Signal Breakdown Locked
                    </p>
                    <p className="text-xs text-gray-600">
                      Unlocking the signal will deduct credits
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Unlock Button */}
            <Button
              onClick={handleUnlock}
              className="w-full h-11 bg-valasys-orange hover:bg-valasys-orange/90 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              Click to Unlock
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-6">
            {/* Unlocked Content */}

            {/* Company Header */}
            <div className="border-b pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-valasys-orange" />
                  <h3 className="text-lg font-bold text-valasys-gray-900">
                    {data.companyName}
                  </h3>
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
              <div className="flex flex-wrap items-center gap-4 text-sm text-valasys-gray-600">
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

            <div>
              <h4 className="text-sm font-semibold mb-3">Current Metrics</h4>

              {/* Current Metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <div className="text-blue-600 font-medium">
                    Composite Score
                  </div>
                  <div className="text-xl font-bold text-blue-800">
                    {data.compositeScore}
                  </div>
                  <div className="text-blue-500 text-xs">Base metric</div>
                </div>
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <div className="text-green-600 font-medium">Delta Score</div>
                  <div className="text-xl font-bold text-green-800">
                    {data.deltaScore.toFixed(1)}
                  </div>
                  <div className="text-green-500 text-xs">Change rate</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  <div className="text-yellow-600 font-medium">Topics</div>
                  <div className="text-xl font-bold text-yellow-800">
                    {data.matchedTopics}
                  </div>
                  <div className="text-yellow-500 text-xs">Matched count</div>
                </div>
              </div>
            </div>

            {/* Spline Chart */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Trend Analysis</h4>
              <div className="h-48 border rounded-lg p-3 bg-white">
                <ChartContainer config={chartConfig}>
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="month"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="compositeScore"
                      stroke={chartConfig.compositeScore.color}
                      strokeWidth={3}
                      dot={{
                        fill: chartConfig.compositeScore.color,
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        stroke: chartConfig.compositeScore.color,
                        strokeWidth: 2,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="deltaScore"
                      stroke={chartConfig.deltaScore.color}
                      strokeWidth={3}
                      dot={{
                        fill: chartConfig.deltaScore.color,
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        stroke: chartConfig.deltaScore.color,
                        strokeWidth: 2,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="matchedTopics"
                      stroke={chartConfig.matchedTopics.color}
                      strokeWidth={3}
                      dot={{
                        fill: chartConfig.matchedTopics.color,
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        stroke: chartConfig.matchedTopics.color,
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </div>

            {/* Related High Intent Topics */}
            <div className="border-t pt-3">
              <h5 className="text-sm font-semibold mb-3">
                Other High Intent Topics
              </h5>
              <div className="grid grid-cols-1 gap-2">
                {data.relatedTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-xs text-gray-700">{topic}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-valasys-orange rounded-full"></div>
                      <span className="text-xs text-valasys-orange font-medium">
                        High
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 border-t pt-3">
              <p className="flex items-center space-x-2">
                <span>📈</span>
                <span>
                  Spline chart analysis showing composite score, delta score,
                  and matched topics trends over 12 months
                </span>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
