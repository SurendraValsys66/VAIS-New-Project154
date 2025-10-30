import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface UnlockIntentSignalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlockCurrent: () => void;
  onUnlockAll: () => void;
}

const intentSignalFeatures = [
  "Real-time intent signals",
  "Composite scoring breakdown",
  "Matched topic analysis",
  "Enterprise-grade accuracy",
  "AI-powered insights",
];

export default function UnlockIntentSignalModal({
  open,
  onOpenChange,
  onUnlockCurrent,
  onUnlockAll,
}: UnlockIntentSignalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 border-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Column - Bombora Logo and Introduction */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex flex-col justify-between border-r border-gray-200">
            <div>
              {/* Icon before Title */}
              <div className="p-3 bg-white rounded-full mb-4 w-fit">
                <img
                  src="https://img.freepik.com/premium-vector/art-illustration_824268-635.jpg"
                  alt="Intent Signal Icon"
                  style={{ width: "40px" }}
                />
              </div>

              {/* Title and Description */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unlock Intent Signal
              </h2>

              {/* Bombora Logo */}
              <div className="mb-8">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F826a3e27b58443589187ad5b7757a718%2F26618173823c471191d805cde87239d2?format=webp&width=800"
                  alt="Powered by Bombora"
                  style={{ width: "150px" }}
                  className="object-contain"
                />
              </div>
              <p className="text-gray-700 mb-2">
                Unlock Bombora intent data signals to access deeper insights
                into company buying behaviors and decision-making timelines.
              </p>
              <p className="text-gray-600 text-sm">
                Each unlock uses 1 credit. Gain access to enterprise-grade
                intent intelligence powered by Bombora's proprietary data.
              </p>
            </div>
          </div>

          {/* Right Column - Features and Actions */}
          <div className="p-8 flex flex-col justify-between">
            {/* Features List */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                Included with Intent Signal
              </h3>
              <ul className="space-y-3">
                {intentSignalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Note */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Each unlock the intent signal deducts 1
                credit.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  onUnlockCurrent();
                  onOpenChange(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-11"
              >
                Unlock Current Signal
              </Button>
              <Button
                onClick={() => {
                  onUnlockAll();
                  onOpenChange(false);
                }}
                variant="outline"
                className="w-full h-11"
              >
                Unlock All Signals
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
