import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Info } from "lucide-react";

interface UnlockIntentSignalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: (selectedOptions: string[]) => void;
  currentlyClickedBadgeId?: string;
}

const unlockOptions = [
  {
    id: "current",
    label: "Unlock Current Signal",
    description: "This company's intent signal",
  },
  {
    id: "super_strong",
    label: "Super Strong Signals Only",
    description: "Companies with super strong intent signals",
  },
  {
    id: "very_strong",
    label: "Very Strong Signals Only",
    description: "Companies with very strong intent signals",
  },
  {
    id: "strong",
    label: "Strong Signals Only",
    description: "Companies with strong intent signals",
  },
  {
    id: "all",
    label: "Unlock All Signals",
    description: "All intent signals in this list",
  },
];

export default function UnlockIntentSignalModal({
  open,
  onOpenChange,
  onUnlock,
  currentlyClickedBadgeId,
}: UnlockIntentSignalModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(["current"]),
  );

  const handleCheckboxChange = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const handleUnlock = () => {
    if (selectedOptions.size > 0) {
      onUnlock(Array.from(selectedOptions));
      onOpenChange(false);
      setSelectedOptions(new Set(["current"]));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 border-0 rounded-xl overflow-hidden">
        <div className="bg-white">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-valasys-orange via-orange-400 to-valasys-orange p-6 sm:p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest opacity-90">
                    Powered by Bombora
                  </span>
                </div>
                <h2 className="text-3xl font-bold">Unlock Intent Signals</h2>
                <p className="text-orange-50 mt-2 text-sm leading-relaxed">
                  Access real-time buying intent data and deeper insights into company behaviors
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8">
            {/* Options */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Choose what to unlock
              </h3>
              <div className="space-y-2">
                {unlockOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-valasys-orange hover:bg-orange-50/30 cursor-pointer transition-all group"
                  >
                    <Checkbox
                      checked={selectedOptions.has(option.id)}
                      onCheckedChange={() => handleCheckboxChange(option.id)}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cost Alert */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Each unlock deducts 5 credits</span>
                <br />
                You have <span className="font-semibold">48,256 credits</span> remaining
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  setSelectedOptions(new Set(["current"]));
                }}
                variant="outline"
                className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUnlock}
                disabled={selectedOptions.size === 0}
                className="flex-1 h-10 bg-gradient-to-r from-valasys-orange to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 mr-2" />
                Unlock Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
