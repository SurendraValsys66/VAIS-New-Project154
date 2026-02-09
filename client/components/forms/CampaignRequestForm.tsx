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
            <Button type="button" variant="outline" asChild className="text-orange-500 border-orange-500">
              <span className="cursor-pointer">Choose File</span>
            </Button>
          </label>
        </div>
      )}
    </div>
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
              <p className="text-xs text-gray-600 mb-4">
                Upload TAL File
              </p>

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
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                >
                  Clear Differences
                </Button>
              </div>

              <p className="text-xs text-gray-700 mb-3">
                Review and submit your campaign request
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-xs text-blue-800">
                  All required fields have been filled. Click the button below to submit your campaign request.
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
