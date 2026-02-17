import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Upload,
  X,
  Check,
  ChevronsUpDown,
  FileText,
  Trash2,
  Info,
  Globe,
  Users,
  Target,
  Briefcase,
  Download,
  ChevronRight,
  ChevronDown,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AssetSelector, SelectedAsset } from "../campaigns/AssetSelector";
import { AIEmailGeneratorModal } from "../campaigns/AIEmailGeneratorModal";
import RecommendedCampaignType from "../campaigns/RecommendedCampaignType";

// Form validation schema
const campaignFormSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  jobTitles: z.array(z.string()).min(1, "At least one job title is required"),
  jobFunctions: z
    .array(z.string())
    .min(1, "At least one job function is required"),
  jobLevels: z.array(z.string()).min(1, "At least one job level is required"),
  geolocations: z.array(z.string()).min(1, "At least one location is required"),
  employeeSize: z
    .array(z.string())
    .min(1, "At least one employee size is required"),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  talFile: z.any().optional(),
  campaignAssets: z.array(z.any()).optional().default([]),
});

type CampaignFormData = z.infer<typeof campaignFormSchema>;

// Mock data
const jobTitleOptions = [
  "Software Engineer",
  "Product Manager",
  "Marketing Manager",
  "Sales Director",
  "Data Scientist",
  "UX Designer",
  "DevOps Engineer",
  "Business Analyst",
  "Customer Success Manager",
  "HR Manager",
  "Financial Analyst",
  "Project Manager",
];

const jobFunctionOptions = [
  "Engineering",
  "Product",
  "Marketing",
  "Sales",
  "Data & Analytics",
  "Design",
  "Operations",
  "Business Development",
  "Customer Success",
  "Human Resources",
  "Finance",
  "Management",
];

const jobLevelOptions = ["Entry", "Mid", "Senior", "Director", "VP", "C-Level"];

const geolocationOptions = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "India",
  "Singapore",
  "Japan",
  "Brazil",
  "Mexico",
];

const employeeSizeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Education",
  "Government",
  "Real Estate",
  "Transportation",
  "Energy",
  "Media & Entertainment",
  "Telecommunications",
  "Agriculture",
  "Construction",
];

// Multi-select component
interface MultiSelectProps {
  options: string[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
  showSelectAll?: boolean;
}

function MultiSelect({
  options,
  selected,
  onSelectedChange,
  placeholder,
  searchPlaceholder = "Search...",
  showSelectAll = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleUnselect = (item: string) => {
    onSelectedChange(selected.filter((i) => i !== item));
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onSelectedChange([]);
    } else {
      onSelectedChange([...options]);
    }
  };

  const isAllSelected =
    selected.length === options.length && options.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((item) => (
                <Badge key={item} variant="secondary" className="mr-1 mb-1">
                  {item}
                  <span
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {showSelectAll && (
                <CommandItem
                  onSelect={handleSelectAll}
                  className="font-medium bg-gray-50 hover:bg-blue-50"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isAllSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  Select All
                </CommandItem>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    if (selected.includes(option)) {
                      handleUnselect(option);
                    } else {
                      onSelectedChange([...selected, option]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// File upload component
interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
}

function FileUpload({ onFileChange, file }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors bg-white",
        dragActive ? "border-primary bg-primary/5" : "border-gray-200",
        "hover:border-primary hover:bg-primary/5",
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        accept=".csv,.xlsx,.xls"
        onChange={handleChange}
        className="hidden"
      />

      {file ? (
        <div className="flex items-center justify-center space-x-3">
          <FileText className="h-8 w-8 text-primary" />
          <div className="text-left">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFileChange(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Upload TAL File
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            .csv, .xlsx, .xls — max 3 MB
          </p>
          <label htmlFor="file-upload">
            <Button
              type="button"
              variant="outline"
              asChild
              className="text-orange-500 border-orange-500"
            >
              <span className="cursor-pointer">Choose File</span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
}

// Deliverables Dialog component
interface DeliverablesDialogProps {
  jobTitles: string[];
  jobFunctions: string[];
  jobLevels: string[];
  geolocations: string[];
  industries: string[];
  campaignName: string;
  employeeSize: string[];
  userHasFullPermission?: boolean;
  isFormValid?: boolean;
  selectedAssets?: SelectedAsset[];
}

type CampaignStatus = "pending" | "accepted" | "declined";

function DeliverablesDialog({
  jobTitles,
  jobFunctions,
  jobLevels,
  geolocations,
  industries,
  campaignName,
  employeeSize,
  userHasFullPermission = true,
  isFormValid = true,
  selectedAssets = [],
}: DeliverablesDialogProps) {
  const [open, setOpen] = useState(false);
  const [campaignStatus, setCampaignStatus] =
    useState<CampaignStatus>("pending");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Region mappings
  const regionMap: { [key: string]: string } = {
    "United States": "United States",
    Canada: "Canada",
    Mexico: "LATAM",
    Brazil: "LATAM",
    "United Kingdom": "EMEA",
    Germany: "EMEA",
    France: "EMEA",
    Australia: "APAC",
    India: "APAC",
    Singapore: "APAC",
    Japan: "APAC",
  };

  // Limit geolocations to top 5
  const selectedGeolocations = geolocations.slice(0, 5);

  // Use only selected job levels (no limit)
  const selectedJobLevels =
    jobLevels.length > 0
      ? jobLevels
      : ["C-Level", "Vice President", "Director", "Manager", "Staff"];

  // Generate Database Reach data by Job Level
  const generateJobLevelData = () => {
    const data: { [key: string]: { [key: string]: number } } = {};

    selectedJobLevels.forEach((level) => {
      data[level] = {};
      selectedGeolocations.forEach((geo) => {
        data[level][geo] = Math.floor(Math.random() * 50) + 30;
      });
    });

    return data;
  };

  const jobLevelData = generateJobLevelData();

  // Calculate Job Level total count
  const jobLevelTotal = selectedJobLevels.reduce((sum, level) => {
    const levelTotal = selectedGeolocations.reduce(
      (geoSum, geo) => geoSum + (jobLevelData[level]?.[geo] || 0),
      0,
    );
    return sum + levelTotal;
  }, 0);

  const deliverableColumns = [
    "United States",
    "Canada",
    "LATAM",
    "EMEA",
    "APAC",
  ];

  // Calculate deliverables by region/column
  const monthlyDeliverablesData: {
    [key: string]: { [key: string]: number };
  } = {
    CS: {},
    MQL: {},
    HQL: {},
    BANT: {},
    Webinar: {},
  };

  const deliverableRatios = {
    CS: 1.0,
    MQL: 0.75,
    HQL: 0.45,
    BANT: 0.26,
    Webinar: 0.61,
  };

  // Populate CS counts (Base Reach) based on jobLevelTotal
  // Increase it significantly to match the image's scale
  const baseReachTotal = Math.max(jobLevelTotal * 12, 10000);

  deliverableColumns.forEach((col) => {
    const isSelected = geolocations.some((geo) => regionMap[geo] === col);

    if (isSelected) {
      const regionWeight =
        col === "United States"
          ? 0.46
          : col === "EMEA"
            ? 0.31
            : col === "APAC"
              ? 0.15
              : col === "Canada"
                ? 0.04
                : 0.04;
      const variation = 0.9 + Math.random() * 0.2;
      const count = Math.floor(baseReachTotal * regionWeight * variation);
      monthlyDeliverablesData.CS[col] = Math.max(50, count);
    } else {
      monthlyDeliverablesData.CS[col] = 0;
    }
  });

  // If no geolocations, provide exact image counts as fallback
  if (geolocations.length === 0) {
    monthlyDeliverablesData.CS["United States"] = 7621;
    monthlyDeliverablesData.CS["Canada"] = 620;
    monthlyDeliverablesData.CS["LATAM"] = 570;
    monthlyDeliverablesData.CS["EMEA"] = 5121;
    monthlyDeliverablesData.CS["APAC"] = 2561;
  }

  // Calculate other deliverables based on CS
  Object.keys(deliverableRatios).forEach((type) => {
    if (type === "CS") return;
    const ratio = deliverableRatios[type as keyof typeof deliverableRatios];
    deliverableColumns.forEach((col) => {
      monthlyDeliverablesData[type][col] = Math.floor(
        monthlyDeliverablesData.CS[col] * ratio,
      );
    });
  });

  const getRowTotal = (data: { [key: string]: number }) =>
    Object.values(data).reduce((a, b) => a + b, 0);

  const getColTotal = (
    data: { [key: string]: { [key: string]: number } },
    col: string,
  ) => Object.keys(data).reduce((sum, type) => sum + data[type][col], 0);

  const totalMonthlyCS = getRowTotal(monthlyDeliverablesData.CS);
  const totalDeliverables = totalMonthlyCS;

  // Use only selected employee sizes (no limit)
  const selectedEmployeeSizeList =
    employeeSize && employeeSize.length > 0
      ? employeeSize
      : [
          "1-10",
          "11-50",
          "51-200",
          "201-500",
          "501-1000",
          "1001-5000",
          "5001-10,000",
          "10,000+",
        ];

  // Generate Database Reach data by Employee Size
  const generateEmployeeSizeData = () => {
    const data: { [key: string]: { [key: string]: number } } = {};

    selectedEmployeeSizeList.forEach((size) => {
      data[size] = {};
      selectedGeolocations.forEach((geo) => {
        data[size][geo] = Math.floor(Math.random() * 200) + 100;
      });
    });

    return data;
  };

  const employeeSizeData = generateEmployeeSizeData();

  // Calculate Employee Size total count
  const employeeSizeTotal = selectedEmployeeSizeList.reduce((sum, size) => {
    const sizeTotal = selectedGeolocations.reduce(
      (geoSum, geo) => geoSum + (employeeSizeData[size]?.[geo] || 0),
      0,
    );
    return sum + sizeTotal;
  }, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          disabled={!isFormValid}
          className="text-xs bg-orange-500 text-white border-orange-500 hover:bg-orange-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Info className="w-4 h-4" />
          Check Deliverables
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Deliverables Overview
          </SheetTitle>
          <SheetDescription className="text-base mt-1">
            {campaignName || "Your Campaign"} - Database Reach Analysis &
            Campaign Summary
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Deliverables Overview Tables */}
          <div className="space-y-8">
            {/* Monthly Deliverables */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-[#fde9d9] px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                    Monthly Deliverables
                  </h4>
                  <p className="text-[10px] text-gray-600 font-medium">ESTIMATED MONTHLY DELIVERY VOLUME</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white/50 border-orange-200 text-orange-800 text-[10px] font-bold">
                    PREMIUM PLAN
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-orange-600">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50 uppercase tracking-wider border-r border-gray-100"></th>
                      {deliverableColumns.map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3 text-center text-xs font-bold text-gray-700 bg-gray-50 uppercase tracking-wider border-r border-gray-100"
                        >
                          {col}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 bg-[#fde9d9] uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.keys(monthlyDeliverablesData).map((type) => (
                      <tr key={type} className="hover:bg-orange-50/30 transition-colors group">
                        <td className="px-6 py-3 text-sm font-bold text-gray-900 bg-[#fde9d9] border-r border-gray-200 min-w-[120px]">
                          {type}
                        </td>
                        {deliverableColumns.map((col) => (
                          <td
                            key={col}
                            className="px-6 py-3 text-sm text-center text-gray-600 border-r border-gray-100 group-hover:text-gray-900"
                          >
                            {monthlyDeliverablesData[type][col].toLocaleString()}
                          </td>
                        ))}
                        <td className="px-6 py-3 text-sm text-center font-bold text-gray-900 bg-gray-50">
                          {getRowTotal(monthlyDeliverablesData[type]).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quarterly Deliverables */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                    Quarterly Deliverables
                  </h4>
                  <p className="text-[10px] text-gray-600 font-medium">ESTIMATED 3-MONTH DELIVERY VOLUME</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800 text-[10px] font-bold uppercase">
                    Quarterly Projection
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50 uppercase tracking-wider border-r border-gray-100"></th>
                      {deliverableColumns.map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3 text-center text-xs font-bold text-gray-700 bg-gray-50 uppercase tracking-wider border-r border-gray-100"
                        >
                          {col}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 bg-gray-50 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.keys(monthlyDeliverablesData).map((type) => (
                      <tr key={type} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-3 text-sm font-bold text-gray-900 bg-[#fde9d9] border-r border-gray-200 min-w-[120px]">
                          {type}
                        </td>
                        {deliverableColumns.map((col) => (
                          <td
                            key={col}
                            className="px-6 py-3 text-sm text-center text-gray-600 border-r border-gray-100 group-hover:text-gray-900"
                          >
                            {(
                              monthlyDeliverablesData[type][col] * 3
                            ).toLocaleString()}
                          </td>
                        ))}
                        <td className="px-6 py-3 text-sm text-center font-bold text-gray-900 bg-gray-50">
                          {(
                            getRowTotal(monthlyDeliverablesData[type]) * 3
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Database Reach Tabs */}
          <Tabs defaultValue="job-level" className="w-full mt-8 pt-8 border-t border-gray-100">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="job-level" className="text-sm font-medium">
                Job Level (Total count {jobLevelTotal})
              </TabsTrigger>
              <TabsTrigger
                value="employee-size"
                className="text-sm font-medium"
              >
                Employee Size (Total count {employeeSizeTotal})
              </TabsTrigger>
            </TabsList>

            {/* Job Level Tab */}
            <TabsContent value="job-level" className="mt-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900">
                    Database Reach by Job Level
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Prospect counts distributed across selected geographies
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50">
                          Job Level
                        </th>
                        {selectedGeolocations.map((geo) => (
                          <th
                            key={geo}
                            className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-gray-50"
                          >
                            {geo}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-blue-50 font-bold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedJobLevels.map((level, index) => {
                        const levelTotal = selectedGeolocations.reduce(
                          (sum, geo) => sum + (jobLevelData[level]?.[geo] || 0),
                          0,
                        );
                        return (
                          <tr
                            key={level}
                            className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                          >
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                              {level}
                            </td>
                            {selectedGeolocations.map((geo) => (
                              <td
                                key={geo}
                                className="px-6 py-3 text-sm text-center text-gray-600"
                              >
                                {jobLevelData[level]?.[geo] || 0}
                              </td>
                            ))}
                            <td className="px-6 py-3 text-sm text-center font-bold text-blue-600">
                              {levelTotal}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gradient-to-r from-blue-100 to-blue-50 border-t-2 border-blue-200 font-bold">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          Total
                        </td>
                        {selectedGeolocations.map((geo) => (
                          <td
                            key={geo}
                            className="px-6 py-3 text-sm text-center text-gray-900"
                          >
                            {selectedJobLevels.reduce(
                              (sum, level) =>
                                sum + (jobLevelData[level]?.[geo] || 0),
                              0,
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-3 text-sm text-center text-blue-700">
                          {jobLevelTotal}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Employee Size Tab */}
            <TabsContent value="employee-size" className="mt-4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900">
                    Database Reach by Employee Size
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Prospect counts by company size across selected geographies
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50">
                          Employee Size
                        </th>
                        {selectedGeolocations.map((geo) => (
                          <th
                            key={geo}
                            className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-gray-50"
                          >
                            {geo}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-emerald-50 font-bold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployeeSizeList.map((size, index) => {
                        const sizeTotal = selectedGeolocations.reduce(
                          (sum, geo) =>
                            sum + (employeeSizeData[size]?.[geo] || 0),
                          0,
                        );
                        return (
                          <tr
                            key={size}
                            className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-emerald-50 transition-colors`}
                          >
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                              {size}
                            </td>
                            {selectedGeolocations.map((geo) => (
                              <td
                                key={geo}
                                className="px-6 py-3 text-sm text-center text-gray-600"
                              >
                                {employeeSizeData[size]?.[geo] || 0}
                              </td>
                            ))}
                            <td className="px-6 py-3 text-sm text-center font-bold text-emerald-600">
                              {sizeTotal}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-t-2 border-emerald-200 font-bold">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          Total
                        </td>
                        {selectedGeolocations.map((geo) => (
                          <td
                            key={geo}
                            className="px-6 py-3 text-sm text-center text-gray-900"
                          >
                            {selectedEmployeeSizeList.reduce(
                              (sum, size) =>
                                sum + (employeeSizeData[size]?.[geo] || 0),
                              0,
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-3 text-sm text-center text-emerald-700">
                          {employeeSizeTotal}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Recommended Campaign Type Section */}
          <RecommendedCampaignType
            jobTitles={jobTitles}
            jobFunctions={jobFunctions}
            jobLevels={jobLevels}
            geolocations={geolocations}
            employeeSize={employeeSize}
            industries={industries}
            totalDeliverables={totalDeliverables}
            campaignAssets={selectedAssets}
          />

          {/* Campaign Actions */}
          {userHasFullPermission && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-600" />
                Campaign Decision
              </h3>

              {campaignStatus === "pending" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 mb-4">
                    Do you want to proceed with this campaign?
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      onClick={() => setCampaignStatus("declined")}
                      variant="destructive"
                      className="font-medium"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline Campaign
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowConfirmation(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept Campaign
                    </Button>
                  </div>
                </div>
              )}

              {campaignStatus === "accepted" && (
                <div className="bg-green-50 border border-green-200 rounded p-4 flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">
                      Campaign Accepted
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Our team will contact you shortly with next steps.
                    </p>
                  </div>
                </div>
              )}

              {campaignStatus === "declined" && (
                <div className="bg-red-50 border border-red-200 rounded p-4 flex items-center gap-3">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-900">
                      Campaign Declined
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      This campaign has been marked as declined. You can start a
                      new campaign request.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Important Information */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Info className="w-3 h-3 text-blue-600" />
              Important Information
            </h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-gray-700">
                <ChevronRight className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs">
                  These are estimated counts based on current database. Final
                  numbers may vary slightly
                </span>
              </li>
              <li className="flex gap-2 text-gray-700">
                <ChevronRight className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs">
                  You can export the deliverables in CSV, Excel, or JSON format
                </span>
              </li>
              <li className="flex gap-2 text-gray-700">
                <ChevronRight className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs">
                  All deliverables include verified contact information and
                  professional background
                </span>
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Confirm Campaign Acceptance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Thank you!</p>
                <p className="text-sm text-blue-700 mt-1">
                  Our team will contact you shortly.
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setCampaignStatus("accepted");
                setShowConfirmation(false);
                setOpen(false);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

export default function CampaignRequestForm() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([]);
  const [emailGeneratorOpen, setEmailGeneratorOpen] = useState(false);
  const [landingPageDropdownOpen, setLandingPageDropdownOpen] = useState(false);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignName: "",
      jobTitles: [],
      jobFunctions: [],
      jobLevels: [],
      geolocations: [],
      employeeSize: [],
      industries: [],
      campaignAssets: [],
    },
  });

  const onSubmit = (data: CampaignFormData) => {
    console.log("Form submitted:", data);
    console.log("Uploaded file:", uploadedFile);
    console.log("Selected assets:", selectedAssets);
  };

  const isFormValid = () => {
    const values = form.watch();
    return (
      values.campaignName &&
      values.jobTitles?.length > 0 &&
      values.jobFunctions?.length > 0 &&
      values.jobLevels?.length > 0 &&
      values.geolocations?.length > 0 &&
      values.industries?.length > 0 &&
      values.employeeSize?.length > 0
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Section 1: Campaign Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
                  1
                </span>
                <h3 className="text-sm font-semibold text-gray-900">
                  Campaign Details
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Campaign name and company size
              </p>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="campaignName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Campaign Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter campaign name"
                          {...field}
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employeeSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Employee Size *
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={employeeSizeOptions}
                          selected={field.value}
                          onSelectedChange={field.onChange}
                          placeholder="Select employee size ranges"
                          searchPlaceholder="Search..."
                          showSelectAll={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>

            {/* Section 3: File Upload */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
                  3
                </span>
                <h3 className="text-sm font-semibold text-gray-900">
                  File Upload
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">Upload TAL File</p>

              <FileUpload onFileChange={setUploadedFile} file={uploadedFile} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Section 2: Target Criteria */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
                  2
                </span>
                <h3 className="text-sm font-semibold text-gray-900">
                  Target Criteria
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Select job titles, levels & locations
              </p>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="jobTitles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={jobTitleOptions}
                            selected={field.value}
                            onSelectedChange={field.onChange}
                            placeholder="Select job titles"
                            searchPlaceholder="Search..."
                            showSelectAll={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobFunctions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Job Function *
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={jobFunctionOptions}
                            selected={field.value}
                            onSelectedChange={field.onChange}
                            placeholder="Select job functions"
                            searchPlaceholder="Search..."
                            showSelectAll={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="jobLevels"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Job Level *
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={jobLevelOptions}
                            selected={field.value}
                            onSelectedChange={field.onChange}
                            placeholder="Select levels"
                            showSelectAll={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="geolocations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Geolocation *
                        </FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={geolocationOptions}
                            selected={field.value}
                            onSelectedChange={field.onChange}
                            placeholder="Select locations"
                            searchPlaceholder="Search..."
                            showSelectAll={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="industries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Industry
                      </FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={industryOptions}
                          selected={field.value}
                          onSelectedChange={field.onChange}
                          placeholder="Select industries"
                          searchPlaceholder="Search..."
                          showSelectAll={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 4: Submit Campaign */}
            <div className="bg-gradient-to-b from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-sm font-semibold">
                    4
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Submit Campaign
                  </h3>
                </div>
                <DeliverablesDialog
                  jobTitles={form.watch("jobTitles")}
                  jobFunctions={form.watch("jobFunctions")}
                  jobLevels={form.watch("jobLevels")}
                  geolocations={form.watch("geolocations")}
                  industries={form.watch("industries")}
                  campaignName={form.watch("campaignName")}
                  employeeSize={form.watch("employeeSize")}
                  isFormValid={isFormValid()}
                  selectedAssets={selectedAssets}
                />
              </div>

              <p className="text-xs text-gray-700 mb-3">
                Review and submit your campaign request
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-xs text-blue-800">
                  All required fields have been filled. Click the button below
                  to submit your campaign request.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium h-10"
                disabled={!isFormValid()}
              >
                Submit Campaign Request
              </Button>

              {/* Asset Buttons - Below Submit Button */}
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-3 font-medium">
                  Add Campaign Assets (Optional)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {/* AI Email Generator Button */}
                  <button
                    type="button"
                    onClick={() => setEmailGeneratorOpen(true)}
                    className={cn(
                      "py-2 px-3 rounded-lg text-xs font-medium transition-all border-2 flex items-center justify-center gap-2 hidden",
                      selectedAssets.some((a) => a.id === "email-gen")
                        ? "bg-blue-100 border-blue-500 text-blue-900"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300",
                    )}
                  >
                    <Mail className="w-3 h-3" />
                    <span>AI Email Generator</span>
                    {selectedAssets.some((a) => a.id === "email-gen") && (
                      <Check className="w-3 h-3 ml-auto" />
                    )}
                  </button>

                  {/* Landing Page Dropdown Button */}
                  <Popover
                    open={landingPageDropdownOpen}
                    onOpenChange={setLandingPageDropdownOpen}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "py-2 px-3 rounded-lg text-xs font-medium transition-all border-2 flex items-center justify-center gap-2 w-full",
                          "bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300",
                        )}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Landing Page</span>
                        <ChevronDown className="w-3 h-3 ml-auto" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0">
                      <div className="flex flex-col">
                        {/* Email Template Builder Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setLandingPageDropdownOpen(false);
                            navigate("/templates");
                          }}
                          className="px-4 py-3 text-xs text-left hover:bg-purple-50 border-b border-gray-200 flex items-center gap-2 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-purple-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Email Template Builder
                            </p>
                            <p className="text-xs text-gray-600">
                              Design custom email templates
                            </p>
                          </div>
                        </button>

                        {/* Landing Page Builder Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setLandingPageDropdownOpen(false);
                            navigate("/landing-pages");
                          }}
                          className="px-4 py-3 text-xs text-left hover:bg-purple-50 flex items-center gap-2 transition-colors"
                        >
                          <Globe className="w-4 h-4 text-purple-600" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Landing Page Builder
                            </p>
                            <p className="text-xs text-gray-600">
                              Create conversion-optimized pages
                            </p>
                          </div>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Upload Template Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const templateAsset: SelectedAsset = {
                        id: "template-upload",
                        type: "template",
                        name: "Upload Template",
                        description:
                          "Upload your existing email or page templates",
                        config: {},
                      };
                      if (
                        selectedAssets.some((a) => a.id === templateAsset.id)
                      ) {
                        setSelectedAssets(
                          selectedAssets.filter(
                            (a) => a.id !== templateAsset.id,
                          ),
                        );
                      } else {
                        setSelectedAssets([...selectedAssets, templateAsset]);
                      }
                    }}
                    className={cn(
                      "py-2 px-3 rounded-lg text-xs font-medium transition-all border-2 flex items-center justify-center gap-2 hidden",
                      selectedAssets.some((a) => a.id === "template-upload")
                        ? "bg-amber-100 border-amber-500 text-amber-900"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-amber-300",
                    )}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Template</span>
                    {selectedAssets.some((a) => a.id === "template-upload") && (
                      <Check className="w-3 h-3 ml-auto" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* AI Email Generator Modal */}
      <AIEmailGeneratorModal
        isOpen={emailGeneratorOpen}
        onClose={() => setEmailGeneratorOpen(false)}
        campaignName={form.watch("campaignName")}
        jobTitles={form.watch("jobTitles")}
        jobFunctions={form.watch("jobFunctions")}
        jobLevels={form.watch("jobLevels")}
        geolocations={form.watch("geolocations")}
        industries={form.watch("industries")}
      />
    </Form>
  );
}
