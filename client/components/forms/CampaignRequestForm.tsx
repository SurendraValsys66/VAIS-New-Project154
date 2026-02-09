import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Form validation schema
const campaignFormSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  jobTitles: z.array(z.string()).min(1, "At least one job title is required"),
  jobFunctions: z
    .array(z.string())
    .min(1, "At least one job function is required"),
  jobLevels: z.array(z.string()).min(1, "At least one job level is required"),
  geolocations: z.array(z.string()).min(1, "At least one location is required"),
  employeeSize: z.string().min(1, "Employee size is required"),
  revenue: z.string().min(1, "Revenue is required"),
  industries: z.array(z.string()).min(1, "At least one industry is required"),
  talFile: z.any().optional(),
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

const revenueOptions = [
  "Under $1M",
  "$1M - $10M",
  "$10M - $50M",
  "$50M - $100M",
  "$100M - $500M",
  "$500M - $1B",
  "Over $1B",
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
}

function MultiSelect({
  options,
  selected,
  onSelectedChange,
  placeholder,
  searchPlaceholder = "Search...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleUnselect = (item: string) => {
    onSelectedChange(selected.filter((i) => i !== item));
  };

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
  geolocations: string[];
  industries: string[];
  campaignName: string;
  employeeSize: string;
  revenue: string;
  userHasFullPermission?: boolean;
}

type CampaignStatus = "pending" | "accepted" | "declined";

function DeliverablesDialog({
  jobTitles,
  jobFunctions,
  geolocations,
  industries,
  campaignName,
  employeeSize,
  revenue,
  userHasFullPermission = true,
}: DeliverablesDialogProps) {
  const [open, setOpen] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus>("pending");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Region mappings
  const regionMap: { [key: string]: string } = {
    "United States": "NAMER",
    Canada: "NAMER",
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

  const regionInfo: {
    [key: string]: {
      color: string;
      bgColor: string;
      borderColor: string;
      description: string;
      countries: string[];
    };
  } = {
    NAMER: {
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "North America & Mexico",
      countries: ["United States", "Canada", "Mexico"],
    },
    EMEA: {
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Europe, Middle East & Africa",
      countries: ["United Kingdom", "Germany", "France"],
    },
    APAC: {
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Asia Pacific",
      countries: ["Australia", "India", "Singapore", "Japan"],
    },
    LATAM: {
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      description: "Latin America",
      countries: ["Mexico", "Brazil"],
    },
    MENA: {
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      description: "Middle East & North Africa",
      countries: [],
    },
  };

  // Calculate deliverables by region
  const regionDeliverables: { [key: string]: number } = {
    NAMER: 0,
    EMEA: 0,
    APAC: 0,
    LATAM: 0,
    MENA: 0,
  };

  const regionBreakdown: { [key: string]: string[] } = {
    NAMER: [],
    EMEA: [],
    APAC: [],
    LATAM: [],
    MENA: [],
  };

  // Calculate based on selections
  geolocations.forEach((geo) => {
    const region = regionMap[geo] || "MENA";
    const baseCount = Math.max(
      jobTitles.length * jobFunctions.length * (industries.length || 1) * 15,
      150,
    );
    regionDeliverables[region] += baseCount + Math.floor(Math.random() * 200);
    regionBreakdown[region].push(geo);
  });

  // If no selections, show default counts
  if (geolocations.length === 0) {
    regionDeliverables.NAMER = 1250;
    regionDeliverables.EMEA = 980;
    regionDeliverables.APAC = 750;
    regionDeliverables.LATAM = 450;
    regionDeliverables.MENA = 320;
  }

  const totalDeliverables = Object.values(regionDeliverables).reduce(
    (a, b) => a + b,
    0,
  );

  // Generate Database Reach data by Job Level
  const jobLevelList = [
    "C-Level",
    "Vice President",
    "Director",
    "Manager",
    "Staff",
  ];
  const generateJobLevelData = () => {
    const data: { [key: string]: { [key: string]: number } } = {};

    jobLevelList.forEach((level) => {
      data[level] = {
        [geolocations[0] || "Geo1"]:
          Math.floor(Math.random() * 50) +
          (geolocations.includes(geolocations[0]) ? 50 : 0),
        [geolocations[1] || "Geo2"]:
          Math.floor(Math.random() * 50) +
          (geolocations.includes(geolocations[1]) ? 50 : 0),
      };
    });

    return data;
  };

  const jobLevelData = generateJobLevelData();

  // Calculate Job Level total count
  const jobLevelTotal = jobLevelList.reduce(
    (sum, level) =>
      sum +
      ((jobLevelData[level]?.[geolocations[0] || "Geo1"] || 0) +
        (jobLevelData[level]?.[geolocations[1] || "Geo2"] || 0)),
    0,
  );

  // Generate Database Reach data by Employee Size
  const employeeSizeList = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001-5000",
    "5001-10,000",
    "10,000+",
  ];
  const generateEmployeeSizeData = () => {
    const data: { [key: string]: { [key: string]: number } } = {};

    employeeSizeList.forEach((size) => {
      const isSelectedSize = size === employeeSize;
      data[size] = {
        [geolocations[0] || "Geo1"]: isSelectedSize
          ? Math.floor(Math.random() * 200) + 100
          : 0,
        [geolocations[1] || "Geo2"]: isSelectedSize
          ? Math.floor(Math.random() * 200) + 100
          : 0,
      };
    });

    return data;
  };

  const employeeSizeData = generateEmployeeSizeData();

  // Calculate Employee Size total count
  const employeeSizeTotal = employeeSizeList.reduce(
    (sum, size) =>
      sum +
      ((employeeSizeData[size]?.[geolocations[0] || "Geo1"] || 0) +
        (employeeSizeData[size]?.[geolocations[1] || "Geo2"] || 0)),
    0,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs bg-orange-500 text-white border-orange-500 hover:bg-orange-600 flex items-center gap-2"
      >
        <Info className="w-4 h-4" />
        Check Deliverables
      </Button>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Deliverables Overview
          </DialogTitle>
          <DialogDescription className="text-base mt-1">
            {campaignName || "Your Campaign"} - Database Reach Analysis &
            Campaign Summary
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Database Reach Tabs */}
          <Tabs defaultValue="job-level" className="w-full">
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
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-gray-50">
                          {geolocations[0] || "Geography 1"}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-gray-50">
                          {geolocations[1] || "Geography 2"}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-blue-50 font-bold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobLevelList.map((level, index) => {
                        const geo1 =
                          jobLevelData[level]?.[geolocations[0] || "Geo1"] || 0;
                        const geo2 =
                          jobLevelData[level]?.[geolocations[1] || "Geo2"] || 0;
                        const total = geo1 + geo2;
                        return (
                          <tr
                            key={level}
                            className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                          >
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                              {level}
                            </td>
                            <td className="px-6 py-3 text-sm text-center text-gray-600">
                              {geo1}
                            </td>
                            <td className="px-6 py-3 text-sm text-center text-gray-600">
                              {geo2}
                            </td>
                            <td className="px-6 py-3 text-sm text-center font-bold text-blue-600">
                              {total}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gradient-to-r from-blue-100 to-blue-50 border-t-2 border-blue-200 font-bold">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          Total
                        </td>
                        <td className="px-6 py-3 text-sm text-center text-gray-900">
                          {jobLevelList.reduce(
                            (sum, level) =>
                              sum +
                              (jobLevelData[level]?.[
                                geolocations[0] || "Geo1"
                              ] || 0),
                            0,
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-center text-gray-900">
                          {jobLevelList.reduce(
                            (sum, level) =>
                              sum +
                              (jobLevelData[level]?.[
                                geolocations[1] || "Geo2"
                              ] || 0),
                            0,
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-center text-blue-700">
                          {jobLevelList.reduce(
                            (sum, level) =>
                              sum +
                              ((jobLevelData[level]?.[
                                geolocations[0] || "Geo1"
                              ] || 0) +
                                (jobLevelData[level]?.[
                                  geolocations[1] || "Geo2"
                                ] || 0)),
                            0,
                          )}
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
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-gray-50">
                          {geolocations[0] || "Geography 1"}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-gray-50">
                          {geolocations[1] || "Geography 2"}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 bg-emerald-50 font-bold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeSizeList.map((size, index) => {
                        const geo1 =
                          employeeSizeData[size]?.[geolocations[0] || "Geo1"] ||
                          0;
                        const geo2 =
                          employeeSizeData[size]?.[geolocations[1] || "Geo2"] ||
                          0;
                        const total = geo1 + geo2;
                        return (
                          <tr
                            key={size}
                            className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-emerald-50 transition-colors`}
                          >
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                              {size}
                            </td>
                            <td className="px-6 py-3 text-sm text-center text-gray-600">
                              {geo1}
                            </td>
                            <td className="px-6 py-3 text-sm text-center text-gray-600">
                              {geo2}
                            </td>
                            <td className="px-6 py-3 text-sm text-center font-bold text-emerald-600">
                              {total}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-t-2 border-emerald-200 font-bold">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          Total
                        </td>
                        <td className="px-6 py-3 text-sm text-center text-gray-900">
                          {employeeSizeList.reduce(
                            (sum, size) =>
                              sum +
                              (employeeSizeData[size]?.[
                                geolocations[0] || "Geo1"
                              ] || 0),
                            0,
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-center text-gray-900">
                          {employeeSizeList.reduce(
                            (sum, size) =>
                              sum +
                              (employeeSizeData[size]?.[
                                geolocations[1] || "Geo2"
                              ] || 0),
                            0,
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm text-center text-emerald-700">
                          {employeeSizeList.reduce(
                            (sum, size) =>
                              sum +
                              ((employeeSizeData[size]?.[
                                geolocations[0] || "Geo1"
                              ] || 0) +
                                (employeeSizeData[size]?.[
                                  geolocations[1] || "Geo2"
                                ] || 0)),
                            0,
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>

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
                    <p className="font-medium text-green-900">Campaign Accepted</p>
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
                    <p className="font-medium text-red-900">Campaign Declined</p>
                    <p className="text-sm text-red-700 mt-1">
                      This campaign has been marked as declined. You can start a new campaign request.
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
                  These are estimated counts based on current database. Final numbers may vary slightly
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
                  All deliverables include verified contact information and professional background
                </span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>

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
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

export default function CampaignRequestForm() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      campaignName: "",
      jobTitles: [],
      jobFunctions: [],
      jobLevels: [],
      geolocations: [],
      employeeSize: "",
      revenue: "",
      industries: [],
    },
  });

  const onSubmit = (data: CampaignFormData) => {
    console.log("Form submitted:", data);
    console.log("Uploaded file:", uploadedFile);
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
      values.employeeSize &&
      values.revenue
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
                Campaign name, company size & revenue
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
                        Employee Size
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select employee size range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employeeSizeOptions.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Revenue
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select revenue range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {revenueOptions.map((revenue) => (
                            <SelectItem key={revenue} value={revenue}>
                              {revenue}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  geolocations={form.watch("geolocations")}
                  industries={form.watch("industries")}
                  campaignName={form.watch("campaignName")}
                  employeeSize={form.watch("employeeSize")}
                  revenue={form.watch("revenue")}
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
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
