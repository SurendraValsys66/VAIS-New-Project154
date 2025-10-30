import React, { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Download,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Users,
  Maximize,
  Building,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Star,
  ExternalLink,
  Copy,
  Zap,
  TrendingUp,
  Globe,
  MessageCircle,
  CheckCircle,
  Clock,
  Activity,
  Brain,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Briefcase,
  BadgeCheck,
  MoreVertical,
  X,
  Lock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { cn, Link } from "@/lib/utils";
import { FloatingStatsWidget } from "@/components/ui/floating-stats-widget";
import { useToast } from "@/hooks/use-toast";

interface ProspectData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  jobTitle: string;
  jobLevel: string;
  jobFunction: string;
  department?: string;
  companyName: string;
  companyDomain: string;
  companySize: string;
  industry: string;
  revenue: string;
  country: string;
  city: string;
  state?: string;
  profileImageUrl?: string;
  engagementScore: number;
  intentScore: number;
  intentSignal: string;
  lastActivity: Date;
  recentActivities: string[];
  matchedTopics: string[];
  confidenceScore: number;
  yearsAtCompany?: number;
  totalExperience?: number;
  previousCompanies?: string[];
  education?: string;
  skills?: string[];
  socialMedia?: {
    twitter?: string;
    github?: string;
  };
  selected: boolean;
}

const sampleProspectData: ProspectData[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@autodesk.com",
    phone: "+1-415-555-0123",
    linkedinUrl: "https://linkedin.com/in/sarahjohnson",
    jobTitle: "Senior Product Manager",
    jobLevel: "Senior",
    jobFunction: "Product",
    department: "AutoCAD Division",
    companyName: "Autodesk",
    companyDomain: "autodesk.com",
    companySize: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "San Francisco",
    state: "CA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 92,
    intentScore: 87,
    intentSignal: "Very Strong",
    lastActivity: new Date("2024-01-15"),
    recentActivities: [
      "Downloaded whitepaper",
      "Attended webinar",
      "Visited pricing page",
    ],
    matchedTopics: ["3D Modeling", "CAD Software", "Product Development"],
    confidenceScore: 95,
    yearsAtCompany: 3,
    totalExperience: 8,
    previousCompanies: ["Adobe", "Salesforce"],
    education: "Stanford University - MBA",
    skills: ["Product Strategy", "3D Design", "Team Leadership"],
    socialMedia: {
      twitter: "@sarahj_pm",
    },
    selected: false,
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    fullName: "Michael Chen",
    email: "m.chen@bentley.com",
    phone: "+1-610-555-0187",
    linkedinUrl: "https://linkedin.com/in/michaelchen-eng",
    jobTitle: "Director of Engineering",
    jobLevel: "Director",
    jobFunction: "Engineering",
    department: "Infrastructure Solutions",
    companyName: "Bentley Systems",
    companyDomain: "bentley.com",
    companySize: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$500M - $1B",
    country: "USA",
    city: "Exton",
    state: "PA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 88,
    intentScore: 91,
    intentSignal: "Very Strong",
    lastActivity: new Date("2024-01-14"),
    recentActivities: ["Visited pricing page", "Downloaded case study"],
    matchedTopics: ["Infrastructure", "CAD", "BIM"],
    confidenceScore: 92,
    yearsAtCompany: 5,
    totalExperience: 12,
    previousCompanies: ["Autodesk", "Google"],
    education: "MIT - BS Computer Science",
    skills: ["Cloud Architecture", "DevOps", "Leadership"],
    selected: false,
  },
];

export default function FavoritesProspect() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof ProspectData>("fullName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<ProspectData | null>(
    null,
  );
  const itemsPerPage = 10;

  const [columnVisibility, setColumnVisibility] = useState({
    prospect: true,
    company: true,
    jobTitle: true,
    jobFunction: true,
    revenue: true,
    mainIndustry: true,
    country: true,
    contactInfo: true,
    actions: true,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("prospect:favorites");
      setFavorites(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {}
  }, []);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string, name?: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("prospect:favorites", JSON.stringify(next));
      } catch {}
      toast({
        title: exists ? "Removed from favorites" : "Added to favorites",
        description: name ? `${name}` : undefined,
      });
      return next;
    });
  };

  const handleCopy = (value: string, label?: string) => {
    try {
      navigator.clipboard.writeText(value);
      toast({
        title: "Copied",
        description: label
          ? `${label} copied to clipboard`
          : "Copied to clipboard",
      });
    } catch {}
  };

  const maskEmail = (email: string) => {
    const [user, domain] = email.split("@");
    if (!domain || !user) return "••••••";
    const maskedUser = `${user[0]}${"*".repeat(Math.max(user.length - 1, 3))}`;
    return `${maskedUser}@${domain}`;
  };

  const maskPhone = (phone?: string) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    let digitIdx = 0;
    return phone
      .split("")
      .map((ch) => {
        if (/\d/.test(ch)) {
          const remaining = digits.length - digitIdx;
          const out = remaining <= 2 ? digits[digitIdx] : "*";
          digitIdx++;
          return out;
        }
        return ch;
      })
      .join("");
  };

  const maskLinkedInText = (url?: string) => {
    if (!url) return "LinkedIn (masked)";
    try {
      const u = new URL(url);
      return `${u.hostname}/•••••••`;
    } catch {
      return "LinkedIn (masked)";
    }
  };

  const sizeToHeadcount = (size: string) => {
    switch (size) {
      case "1-10":
        return "1 to 10 employees";
      case "11-50":
        return "11 to 50 employees";
      case "51-200":
        return "51 to 200 employees";
      case "201-500":
        return "201 to 500 employees";
      case "501-1000":
        return "501 to 1,000 employees";
      case "1001-5000":
        return "1,001 to 5,000 employees";
      case "5001-10000":
        return "5,001 to 10,000 employees";
      case "10001-50000":
        return "10,001 to 50,000 employees";
      case "50001+":
        return "50,001+ employees";
      default:
        return size;
    }
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

  const getEngagementColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-green-400";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  const columns = [
    { key: "prospect", label: "Prospect" },
    { key: "company", label: "Company" },
    { key: "jobTitle", label: "Job Title" },
    { key: "jobFunction", label: "Job Function" },
    { key: "revenue", label: "Revenue" },
    { key: "mainIndustry", label: "Main Industry" },
    { key: "country", label: "Country" },
    { key: "contactInfo", label: "Contact Info" },
    { key: "actions", label: "Actions" },
  ] as const;

  const toggleColumn = (columnKey: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const data = useMemo(() => {
    return sampleProspectData.filter((prospect) => isFavorite(prospect.id));
  }, [favorites]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof ProspectData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleToggleFullscreen = async () => {
    const el = containerRef.current ?? document.documentElement;
    try {
      if (!document.fullscreenElement) {
        // @ts-ignore
        await el.requestFullscreen?.();
      } else {
        await document.exitFullscreen();
      }
    } catch (_e) {
      setIsFullScreen((prev) => {
        const next = !prev;
        const node = containerRef.current;
        if (node) {
          if (next) node.classList.add("app-fullscreen");
          else node.classList.remove("app-fullscreen");
        }
        return next;
      });
    }
  };

  if (data.length === 0) {
    return (
      <TooltipProvider>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/find-prospect">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                        aria-label="Back"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Back</TooltipContent>
                </Tooltip>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Star className="w-6 h-6 mr-3 text-valasys-orange" />
                    Favorites Prospect
                  </h1>
                  <div className="text-sm text-gray-600 mt-1">
                    Your saved favorite prospects
                  </div>
                </div>
              </div>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-12 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">
                  No favorites yet
                </h2>
                <p className="text-gray-500 mb-6">
                  Add prospects to favorites from the Prospect Results page to
                  view them here
                </p>
                <Link to="/prospect-results">
                  <Button className="bg-valasys-orange hover:bg-valasys-orange-light">
                    Browse Prospects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div
          ref={containerRef}
          className={cn("space-y-6", isFullScreen && "app-fullscreen")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/find-prospect">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-valasys-orange" />
                  Favorites Prospect
                </h1>
                <div className="text-sm text-gray-600 mt-1">
                  Your saved favorite prospects
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <FloatingStatsWidget className="w-full lg:w-auto" />
            </div>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Columns"
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <div className="p-2">
                        <h4 className="text-sm font-medium mb-3">Columns</h4>
                        <div className="space-y-2">
                          {columns.map((column) => (
                            <div
                              key={column.key}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                </div>
                                <label
                                  htmlFor={`column-${column.key}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {column.label}
                                </label>
                              </div>
                              <Switch
                                id={`column-${column.key}`}
                                checked={
                                  columnVisibility[
                                    column.key as keyof typeof columnVisibility
                                  ]
                                }
                                onCheckedChange={() =>
                                  toggleColumn(
                                    column.key as keyof typeof columnVisibility,
                                  )
                                }
                                className="data-[state=checked]:bg-valasys-orange"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleFullscreen}
                    aria-label={
                      isFullScreen ? "Exit Full Screen" : "Full Screen"
                    }
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Total Favorites:{" "}
                  <span className="font-medium">{data.length}</span> • Page:{" "}
                  <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
              </div>

              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-valasys-gray-50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            paginatedData.length > 0 &&
                            selectedItems.length === paginatedData.length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      {columnVisibility.prospect && (
                        <TableHead className="cursor-pointer">
                          <div
                            className="flex items-center gap-2"
                            onClick={() => handleSort("fullName")}
                          >
                            Prospect
                            {sortField === "fullName" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.company && (
                        <TableHead className="cursor-pointer">
                          <div
                            className="flex items-center gap-2"
                            onClick={() => handleSort("companyName")}
                          >
                            Company
                            {sortField === "companyName" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.jobTitle && (
                        <TableHead className="cursor-pointer">
                          <div
                            className="flex items-center gap-2"
                            onClick={() => handleSort("jobTitle")}
                          >
                            Job Title
                            {sortField === "jobTitle" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.jobFunction && (
                        <TableHead className="cursor-pointer">
                          <div
                            className="flex items-center gap-2"
                            onClick={() => handleSort("jobFunction")}
                          >
                            Job Function
                            {sortField === "jobFunction" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.revenue && (
                        <TableHead className="cursor-pointer">
                          <div
                            className="flex items-center gap-2"
                            onClick={() => handleSort("revenue")}
                          >
                            Revenue
                            {sortField === "revenue" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.mainIndustry && (
                        <TableHead className="cursor-pointer">
                          <div
                            className="flex items-center gap-2"
                            onClick={() => handleSort("industry")}
                          >
                            Main Industry
                            {sortField === "industry" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.country && (
                        <TableHead className="cursor-pointer">
                          <div
                            className="flex items-center gap-2"
                            onClick={() => handleSort("country")}
                          >
                            Country
                            {sortField === "country" &&
                              (sortDirection === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.contactInfo && (
                        <TableHead>Contact Info</TableHead>
                      )}
                      {columnVisibility.actions && (
                        <TableHead className="text-right">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((prospect) => (
                      <TableRow key={prospect.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(prospect.id)}
                            onCheckedChange={(checked) =>
                              handleSelectItem(prospect.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        {columnVisibility.prospect && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={prospect.profileImageUrl}
                                  alt={prospect.fullName}
                                />
                                <AvatarFallback>
                                  {prospect.firstName[0]}
                                  {prospect.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {prospect.fullName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {prospect.jobLevel}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.company && (
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">
                                {prospect.companyName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {prospect.companySize}
                              </div>
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.jobTitle && (
                          <TableCell>
                            <div className="text-sm">{prospect.jobTitle}</div>
                          </TableCell>
                        )}
                        {columnVisibility.jobFunction && (
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {prospect.jobFunction}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.revenue && (
                          <TableCell>
                            <div className="text-sm">{prospect.revenue}</div>
                          </TableCell>
                        )}
                        {columnVisibility.mainIndustry && (
                          <TableCell>
                            <div className="text-sm">{prospect.industry}</div>
                          </TableCell>
                        )}
                        {columnVisibility.country && (
                          <TableCell>
                            <div className="text-sm">{prospect.country}</div>
                          </TableCell>
                        )}
                        {columnVisibility.contactInfo && (
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="View details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        )}
                        {columnVisibility.actions && (
                          <TableCell className="text-right">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    toggleFavorite(
                                      prospect.id,
                                      prospect.fullName,
                                    )
                                  }
                                  aria-label="Remove favorite"
                                >
                                  <Star
                                    className="w-4 h-4 text-yellow-500"
                                    fill="currentColor"
                                  />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Remove from favorites
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
