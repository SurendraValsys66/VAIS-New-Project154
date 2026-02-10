import React, { useState } from "react";
import {
  Mail,
  Globe,
  Upload,
  Plus,
  X,
  Settings,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SelectedAsset {
  id: string;
  type: "email" | "landing-page" | "template";
  name: string;
  description: string;
  config?: {
    template?: string;
    style?: string;
    advanced?: boolean;
  };
}

interface AssetSelectorProps {
  selectedAssets: SelectedAsset[];
  onAssetsChange: (assets: SelectedAsset[]) => void;
  isFormValid?: boolean;
}

interface AssetCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  status: "available" | "premium" | "coming-soon";
  onClick: () => void;
  isSelected: boolean;
}

// Asset Card Component
function AssetCard({
  icon,
  title,
  description,
  features,
  status,
  onClick,
  isSelected,
}: AssetCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "premium":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          badgeColor: "bg-yellow-100 text-yellow-800",
          icon: "⭐",
        };
      case "coming-soon":
        return {
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          badgeColor: "bg-gray-100 text-gray-800",
          icon: "🚀",
        };
      default:
        return {
          bgColor: isSelected ? "bg-blue-50" : "bg-white",
          borderColor: isSelected ? "border-blue-300" : "border-gray-200",
          badgeColor: "bg-green-100 text-green-800",
          icon: "✓",
        };
    }
  };

  const config = getStatusConfig();
  const isDisabled = status === "coming-soon";

  return (
    <div
      className={cn(
        "relative border-2 rounded-lg p-5 transition-all duration-200 cursor-pointer hover:shadow-md",
        config.bgColor,
        config.borderColor,
        isDisabled && "opacity-60 cursor-not-allowed",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
      )}
      onClick={!isDisabled ? onClick : undefined}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3">
        <Badge className={cn(config.badgeColor, "text-xs")}>
          {status === "available"
            ? "Available"
            : status === "premium"
              ? "Premium"
              : "Coming Soon"}
        </Badge>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">
            {icon}
          </div>
          {isSelected && (
            <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
          )}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>

      {/* Features */}
      <div className="mb-4 space-y-1">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-xs text-gray-500 mt-0.5">•</span>
            <span className="text-xs text-gray-600">{feature}</span>
          </div>
        ))}
      </div>

      {/* Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          if (!isDisabled) onClick();
        }}
        disabled={isDisabled}
        className={cn(
          "w-full h-8 text-xs font-medium transition-all",
          isSelected
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700",
          isDisabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {isDisabled ? (
          <>
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </>
        ) : isSelected ? (
          <>
            <CheckCircle className="w-3 h-3 mr-1" />
            Selected
          </>
        ) : (
          <>
            <Plus className="w-3 h-3 mr-1" />
            Add Asset
          </>
        )}
      </Button>
    </div>
  );
}

// Asset Configuration Dialog
function AssetConfigDialog({
  asset,
  isOpen,
  onClose,
  onSave,
}: {
  asset: SelectedAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: SelectedAsset) => void;
}) {
  const [config, setConfig] = useState(asset?.config || {});

  if (!asset) return null;

  const getConfigContent = () => {
    switch (asset.type) {
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Email Template Style
              </label>
              <select
                value={config.template || "modern"}
                onChange={(e) =>
                  setConfig({ ...config, template: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="modern">Modern Minimal</option>
                <option value="corporate">Corporate</option>
                <option value="creative">Creative & Colorful</option>
                <option value="minimalist">Minimalist</option>
                <option value="professional">Professional Business</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Color Scheme
              </label>
              <select
                value={config.style || "default"}
                onChange={(e) =>
                  setConfig({ ...config, style: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="default">Default (Brand Colors)</option>
                <option value="cool">Cool Blues</option>
                <option value="warm">Warm Oranges</option>
                <option value="neutral">Neutral Grays</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  The AI Email Generator will create personalized emails for your
                  campaign with subject lines, body copy, and CTAs optimized for
                  your selected audiences.
                </p>
              </div>
            </div>
          </div>
        );

      case "landing-page":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Landing Page Type
              </label>
              <select
                value={config.template || "product"}
                onChange={(e) =>
                  setConfig({ ...config, template: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="product">Product Launch</option>
                <option value="webinar">Webinar Registration</option>
                <option value="lead-form">Lead Capture Form</option>
                <option value="case-study">Case Study</option>
                <option value="demo">Demo/Free Trial</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Design Style
              </label>
              <select
                value={config.style || "modern"}
                onChange={(e) =>
                  setConfig({ ...config, style: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="modern">Modern Minimal</option>
                <option value="bold">Bold & Vibrant</option>
                <option value="elegant">Elegant & Premium</option>
                <option value="conversion">Conversion Focused</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  Create a custom landing page optimized for conversions. The AI
                  will match the page content to your campaign messaging and
                  target audience.
                </p>
              </div>
            </div>
          </div>
        );

      case "template":
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Template Type
              </label>
              <select
                value={config.template || "html"}
                onChange={(e) =>
                  setConfig({ ...config, template: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="html">HTML Email Template</option>
                <option value="markdown">Markdown Format</option>
                <option value="figma">Figma Design</option>
                <option value="salesforce">Salesforce Campaign</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  Upload your existing template or template framework, and we'll
                  integrate it with your campaign configuration.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {asset.type === "email" && <Mail className="w-5 h-5" />}
            {asset.type === "landing-page" && <Globe className="w-5 h-5" />}
            {asset.type === "template" && <Upload className="w-5 h-5" />}
            Configure {asset.name}
          </DialogTitle>
          <DialogDescription>{asset.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">{getConfigContent()}</div>

        <div className="flex gap-3">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              onSave({ ...asset, config });
              onClose();
            }}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Asset Selector Component
export function AssetSelector({
  selectedAssets,
  onAssetsChange,
  isFormValid = true,
}: AssetSelectorProps) {
  const [configAsset, setConfigAsset] = useState<SelectedAsset | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  const assetOptions = [
    {
      id: "email-gen",
      type: "email" as const,
      icon: "✉️",
      title: "AI Email Generator",
      description:
        "Generate personalized emails with AI-powered subject lines and body copy",
      features: [
        "AI-generated subject lines & preview text",
        "Personalized body copy for each recipient",
        "Dynamic content blocks",
        "Compliance checking (CAN-SPAM)",
      ],
      status: "available" as const,
    },
    {
      id: "landing-page",
      type: "landing-page" as const,
      icon: "🌐",
      title: "Landing Page Builder",
      description:
        "Create conversion-optimized landing pages matched to your campaign",
      features: [
        "Drag-and-drop editor or AI-generated layouts",
        "Mobile responsive design",
        "Lead capture forms",
        "Built-in analytics & A/B testing",
      ],
      status: "available" as const,
    },
    {
      id: "template-upload",
      type: "template" as const,
      icon: "📄",
      title: "Upload Template",
      description: "Upload your existing email or page templates",
      features: [
        "Support for HTML, Markdown & Figma",
        "Automated variable insertion",
        "Integration with campaign data",
        "Version control & backup",
      ],
      status: "available" as const,
    },
  ];

  const handleAssetToggle = (option: (typeof assetOptions)[0]) => {
    const isSelected = selectedAssets.some((a) => a.id === option.id);

    if (isSelected) {
      onAssetsChange(selectedAssets.filter((a) => a.id !== option.id));
    } else {
      const newAsset: SelectedAsset = {
        id: option.id,
        type: option.type,
        name: option.title,
        description: option.description,
        config: {},
      };
      onAssetsChange([...selectedAssets, newAsset]);
    }
  };

  const handleConfigureAsset = (asset: SelectedAsset) => {
    setConfigAsset(asset);
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = (updatedAsset: SelectedAsset) => {
    onAssetsChange(
      selectedAssets.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)),
    );
  };

  const handleRemoveAsset = (assetId: string) => {
    onAssetsChange(selectedAssets.filter((a) => a.id !== assetId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
            5
          </span>
          <h3 className="text-sm font-semibold text-gray-900">
            Add Campaign Assets (Optional)
          </h3>
        </div>
        <p className="text-xs text-gray-600">
          Enhance your campaign with AI-generated emails, landing pages, or your
          own templates
        </p>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assetOptions.map((option) => {
          const isSelected = selectedAssets.some((a) => a.id === option.id);
          return (
            <AssetCard
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              features={option.features}
              status={option.status}
              isSelected={isSelected}
              onClick={() => handleAssetToggle(option)}
            />
          );
        })}
      </div>

      {/* Selected Assets Summary */}
      {selectedAssets.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Selected Assets ({selectedAssets.length})
          </h4>
          <div className="space-y-2">
            {selectedAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-100"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {asset.name}
                  </p>
                  {asset.config && Object.keys(asset.config).length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      ✓ Configured
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleConfigureAsset(asset)}
                    className="h-8 px-2 text-xs"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Configure
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAsset(asset.id)}
                    className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <p className="font-medium mb-1">Adding Assets</p>
            <p>
              Assets are optional but highly recommended for maximizing campaign
              effectiveness. Each asset type can be customized with specific
              configurations. All assets will be integrated with your campaign
              data and target audience selections.
            </p>
          </div>
        </div>
      </div>

      {/* Config Dialog */}
      <AssetConfigDialog
        asset={configAsset}
        isOpen={configDialogOpen}
        onClose={() => {
          setConfigDialogOpen(false);
          setConfigAsset(null);
        }}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
