import React, { useState, useMemo, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Settings2,
  RefreshCw,
  Users,
  Target,
  Maximize,
  BarChart3,
  Building,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Calendar,
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
  Lock,
  Brain,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Briefcase,
  BadgeCheck,
  MoreVertical,
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
import { markStepCompleted } from "@/lib/masteryStorage";
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

  // Engagement & Intent Data
  engagementScore: number;
  intentScore: number;
  intentSignal: string;
  lastActivity: Date;
  recentActivities: string[];
  matchedTopics: string[];
  confidenceScore: number;

  // Additional Information
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

// Enhanced sample data for prospects
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
    intentSignal: "Super Strong",
    lastActivity: new Date("2024-01-12"),
    recentActivities: ["Requested demo", "Downloaded trial", "Contacted sales"],
    matchedTopics: ["Infrastructure Design", "BIM", "Engineering Software"],
    confidenceScore: 93,
    yearsAtCompany: 5,
    totalExperience: 12,
    previousCompanies: ["Siemens", "ANSYS"],
    education: "MIT - MS Engineering",
    skills: ["Software Architecture", "Team Management", "Infrastructure"],
    socialMedia: {
      github: "mchen-dev",
    },
    selected: false,
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Rodriguez",
    fullName: "Emma Rodriguez",
    email: "emma.rodriguez@dassault.fr",
    phone: "+33-1-55-55-0123",
    linkedinUrl: "https://linkedin.com/in/emmarodriguez",
    jobTitle: "VP of Sales",
    jobLevel: "VP",
    jobFunction: "Sales",
    department: "Global Sales",
    companyName: "Dassault Systèmes",
    companyDomain: "3ds.com",
    companySize: "10001-50000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "France",
    city: "Vélizy-Villacoublay",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 85,
    intentScore: 89,
    intentSignal: "Strong",
    lastActivity: new Date("2024-01-10"),
    recentActivities: [
      "Viewed competitor analysis",
      "Shared content",
      "Attended conference",
    ],
    matchedTopics: ["PLM Software", "CATIA", "Digital Manufacturing"],
    confidenceScore: 90,
    yearsAtCompany: 7,
    totalExperience: 15,
    previousCompanies: ["SAP", "Oracle"],
    education: "HEC Paris - MBA",
    skills: ["Enterprise Sales", "PLM", "Strategic Partnerships"],
    selected: false,
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Kim",
    fullName: "David Kim",
    email: "david.kim@siemens.com",
    phone: "+49-89-555-0199",
    linkedinUrl: "https://linkedin.com/in/davidkim-plm",
    jobTitle: "Chief Technology Officer",
    jobLevel: "C-Level",
    jobFunction: "Engineering",
    department: "PLM Software Division",
    companyName: "Siemens PLM Software",
    companyDomain: "siemens.com",
    companySize: "50001+",
    industry: "Software and IT Services",
    revenue: "$10B+",
    country: "Germany",
    city: "Munich",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 94,
    intentScore: 86,
    intentSignal: "Very Strong",
    lastActivity: new Date("2024-01-14"),
    recentActivities: [
      "Strategic planning session",
      "Industry report download",
      "Partnership inquiry",
    ],
    matchedTopics: ["Digital Transformation", "Industry 4.0", "Manufacturing"],
    confidenceScore: 92,
    yearsAtCompany: 6,
    totalExperience: 18,
    previousCompanies: ["PTC", "Autodesk"],
    education: "Carnegie Mellon - PhD Computer Science",
    skills: ["Digital Manufacturing", "IoT", "Strategic Vision"],
    selected: false,
  },
  {
    id: "5",
    firstName: "Jennifer",
    lastName: "Taylor",
    fullName: "Jennifer Taylor",
    email: "j.taylor@ansys.com",
    phone: "+1-724-555-0156",
    linkedinUrl: "https://linkedin.com/in/jennifertaylor",
    jobTitle: "Senior Marketing Manager",
    jobLevel: "Senior",
    jobFunction: "Marketing",
    department: "Product Marketing",
    companyName: "ANSYS",
    companyDomain: "ansys.com",
    companySize: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Canonsburg",
    state: "PA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 79,
    intentScore: 82,
    intentSignal: "Medium",
    lastActivity: new Date("2024-01-08"),
    recentActivities: [
      "Content engagement",
      "Email opens",
      "Social media activity",
    ],
    matchedTopics: ["Simulation Software", "FEA", "CFD"],
    confidenceScore: 85,
    yearsAtCompany: 4,
    totalExperience: 9,
    previousCompanies: ["Altair", "MSC Software"],
    education: "University of Michigan - MBA Marketing",
    skills: ["Product Marketing", "Demand Generation", "Technical Marketing"],
    selected: false,
  },
  {
    id: "6",
    firstName: "Robert",
    lastName: "Williams",
    fullName: "Robert Williams",
    email: "robert.williams@ptc.com",
    phone: "+1-781-555-0134",
    linkedinUrl: "https://linkedin.com/in/robertwilliams",
    jobTitle: "Engineering Manager",
    jobLevel: "Manager",
    jobFunction: "Engineering",
    department: "Creo Development",
    companyName: "PTC",
    companyDomain: "ptc.com",
    companySize: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Boston",
    state: "MA",
    profileImageUrl: "/api/placeholder/40/40",
    engagementScore: 83,
    intentScore: 78,
    intentSignal: "Medium",
    lastActivity: new Date("2024-01-11"),
    recentActivities: [
      "Technical documentation",
      "Beta testing",
      "User feedback",
    ],
    matchedTopics: ["CAD Development", "Parametric Design", "PLM Integration"],
    confidenceScore: 87,
    yearsAtCompany: 8,
    totalExperience: 14,
    previousCompanies: ["SolidWorks", "Autodesk"],
    education: "Boston University - MS Mechanical Engineering",
    skills: ["Software Development", "CAD Systems", "Team Leadership"],
    selected: false,
  },
];

// Generate additional prospects to reach 50 records
const FIRST_NAMES = [
  "Alex",
  "Priya",
  "Liam",
  "Noah",
  "Olivia",
  "Ava",
  "Ethan",
  "Mia",
  "Isabella",
  "Sophia",
  "Mason",
  "Charlotte",
  "Amelia",
  "Harper",
  "Benjamin",
  "Evelyn",
  "Lucas",
  "Abigail",
  "Henry",
  "Emily",
];
const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];
const COMPANY_POOL = [
  {
    name: "Autodesk",
    domain: "autodesk.com",
    size: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "San Francisco",
  },
  {
    name: "Bentley Systems",
    domain: "bentley.com",
    size: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$500M - $1B",
    country: "USA",
    city: "Exton",
  },
  {
    name: "Dassault Systèmes",
    domain: "3ds.com",
    size: "10001-50000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "France",
    city: "V��lizy-Villacoublay",
  },
  {
    name: "Siemens PLM Software",
    domain: "siemens.com",
    size: "50001+",
    industry: "Software and IT Services",
    revenue: "$10B+",
    country: "Germany",
    city: "Munich",
  },
  {
    name: "ANSYS",
    domain: "ansys.com",
    size: "1001-5000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Canonsburg",
  },
  {
    name: "PTC",
    domain: "ptc.com",
    size: "5001-10000",
    industry: "Software and IT Services",
    revenue: "$1B - $10B",
    country: "USA",
    city: "Boston",
  },
];
function generateAdditionalProspects(count: number): ProspectData[] {
  const roles = [
    { title: "Senior Product Manager", level: "Senior", func: "Product" },
    {
      title: "Director of Engineering",
      level: "Director",
      func: "Engineering",
    },
    { title: "VP of Sales", level: "VP", func: "Sales" },
    { title: "Engineering Manager", level: "Manager", func: "Engineering" },
    { title: "Senior Marketing Manager", level: "Senior", func: "Marketing" },
  ];
  const intentSignals = [
    "Super Strong",
    "Very Strong",
    "Strong",
    "Medium",
    "Weak",
  ];
  const out: ProspectData[] = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const company = COMPANY_POOL[i % COMPANY_POOL.length];
    const role = roles[i % roles.length];
    const id = String(100 + i);
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@${company.domain}`;
    const engagement = 60 + ((i * 7) % 41);
    const intent = 60 + ((i * 11) % 41);
    const confidence = 70 + ((i * 9) % 26);
    const intentSignal = intentSignals[(i * 5 + 2) % intentSignals.length];
    out.push({
      id,
      firstName: first,
      lastName: last,
      fullName: `${first} ${last}`,
      email,
      phone: "+1-415-555-0" + String((i % 9000) + 1000),
      linkedinUrl: `https://linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
      jobTitle: role.title,
      jobLevel: role.level,
      jobFunction: role.func,
      department: undefined,
      companyName: company.name,
      companyDomain: company.domain,
      companySize: company.size,
      industry: company.industry,
      revenue: company.revenue,
      country: company.country,
      city: company.city,
      state: undefined,
      profileImageUrl: "/api/placeholder/40/40",
      engagementScore: engagement,
      intentScore: intent,
      intentSignal,
      lastActivity: new Date(Date.now() - (i % 20) * 86400000),
      recentActivities: [
        "Viewed product page",
        "Downloaded whitepaper",
        "Attended webinar",
      ].slice(0, (i % 3) + 1),
      matchedTopics: [
        "3D Modeling",
        "CAD Software",
        "Product Development",
        "PLM",
      ].slice(0, (i % 4) + 1),
      confidenceScore: confidence,
      yearsAtCompany: (i % 7) + 1,
      totalExperience: (i % 15) + 5,
      previousCompanies: ["Adobe", "Salesforce", "Oracle"].slice(
        0,
        (i % 3) + 1,
      ),
      education: undefined,
      skills: ["Product Strategy", "CAD Systems", "Leadership"].slice(
        0,
        (i % 3) + 1,
      ),
      socialMedia: {},
      selected: false,
    });
  }
  return out;
}

const desiredProspects = 50;
const extraNeeded = Math.max(0, desiredProspects - sampleProspectData.length);
const initialProspects: ProspectData[] = [
  ...sampleProspectData,
  ...generateAdditionalProspects(extraNeeded),
];

export default function ProspectResults() {
  const [data, setData] = useState<ProspectData[]>(initialProspects);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] =
    useState<keyof ProspectData>("engagementScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<ProspectData | null>(
    null,
  );
  const [filters, setFilters] = useState({
    jobFunction: "",
    jobLevel: "",
    company: "",
    country: "",
    revenue: "",
    engagementRange: { min: 0, max: 100 },
  });

  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("prospect:favorites");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("prospect:favorites", JSON.stringify(favorites));
      // Dispatch event to notify sidebar of favorites update
      window.dispatchEvent(new CustomEvent("app:favorites-updated"));
    } catch {}
  }, [favorites]);

  const isFavorite = (id: string) => favorites.includes(id);
  const toggleFavorite = (id: string, name?: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
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

  // Helpers to mask contact info
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
      return `${u.hostname}/•••��••`;
    } catch {
      return "LinkedIn (masked)";
    }
  };

  const [columnVisibility, setColumnVisibility] = useState({
    prospect: true,
    company: true,
    jobTitle: true,
    jobFunction: true,
    revenue: true,
    mainIndustry: true,
    country: true,
    contactInfo: true,
    actions: false,
  });

  const dummyProfile = useMemo(
    () => ({
      email: "prospect@example.com",
      phones: ["+1 555 012 3456", "+1 555 987 6543"],
      seniority: "Executive",
      department: "Customer Service",
      contactLocation: "Gurgaon, Haryana, India",
      company: {
        name: "Acme Corp",
        domain: "acme.com",
        location: "Seattle, Washington, United States",
        categories: ["Technology, Information & Media", "Software Development"],
        revenue: "$1B to $10B",
        headcount: "100,001+ Employee headcount",
        description:
          "Acme is guided by four principles: customer obsession rather than competitor focus, passion for invention, and operational excellence.",
      },
      specialties: [
        "ecommerce",
        "internet of things platform",
        "operations",
        "retail",
      ],
      technologies: [
        "aptitude",
        "oracle general ledger",
        "tms",
        "sap",
        "workiva",
        "blockchain",
        "coinbase",
        "ripple",
        "dash",
        "anaplan",
        "blackline",
        "ibm cognos tm1",
        "oracle hyperion",
        "sap fico",
        "wdesk",
        "auditboard",
        "access compliance",
        "contractor compliance",
        "ibm openpages",
        "metricstream",
        "resolver",
        "sag grc",
        "enablon",
        "adver",
        "agc",
      ],
    }),
    [],
  );

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

  const revenueOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.revenue))).sort(),
    [data],
  );

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesJobFunction =
        !filters.jobFunction || item.jobFunction === filters.jobFunction;
      const matchesJobLevel =
        !filters.jobLevel || item.jobLevel === filters.jobLevel;
      const matchesCompany =
        !filters.company || item.companyName === filters.company;
      const matchesCountry =
        !filters.country || item.country === filters.country;
      const matchesRevenue =
        !filters.revenue || item.revenue === filters.revenue;
      const matchesEngagement =
        item.engagementScore >= filters.engagementRange.min &&
        item.engagementScore <= filters.engagementRange.max;

      return (
        matchesSearch &&
        matchesJobFunction &&
        matchesJobLevel &&
        matchesCompany &&
        matchesCountry &&
        matchesRevenue &&
        matchesEngagement
      );
    });
  }, [data, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, sortField, sortDirection]);

  // Pagination with Premium page
  const actualTotalPages = Math.ceil(sortedData.length / itemsPerPage);
  const totalPages = actualTotalPages + 1; // +1 for premium page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  const isPremiumPage = currentPage > actualTotalPages;

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

  const getEngagementColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-green-400";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
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

  const PremiumOverlay = () => (
    <div className="relative">
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">
            AI spotted a 15% growth in IT accounts — upgrade for full breakdown.
          </span>
        </div>
      </div>

      <Card className="max-w-lg mx-auto bg-white border-t-4 border-t-valasys-orange shadow-2xl">
        <CardContent className="p-6 sm:p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-valasys-orange to-orange-400 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Want more premium insights?
            </h3>
            <p className="text-gray-600 text-lg">
              Unlock this feature with a quick upgrade.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-700 font-medium">
              You've seen 20% of insights. Upgrade to unlock the rest.
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-valasys-orange to-orange-400 h-3 rounded-full transition-all duration-300"
                style={{ width: "20%" }}
              />
            </div>
          </div>

          <Button className="w-full h-14 bg-gradient-to-r from-valasys-orange to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <ArrowUp className="w-5 h-5 mr-3" />
            Upgrade Plans
          </Button>

          <div className="pt-2">
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              See what's included in Premium →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    );
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

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div
          ref={containerRef}
          className={cn("space-y-6", isFullScreen && "app-fullscreen")}
        >
          {/* Header */}
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
                  <Users className="w-6 h-6 mr-3 text-valasys-orange" />
                  Prospect Results
                </h1>
                <div className="text-sm text-gray-600 mt-1">
                  Showing prospects matching your search criteria
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <FloatingStatsWidget className="w-full lg:w-auto" />
            </div>
          </div>

          {/* Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              {/* Search and Quick Filters */}
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
                  Total Prospects:{" "}
                  <span className="font-medium">{filteredData.length}</span>
                  /2,847 • Page:{" "}
                  <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search prospects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.jobFunction || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      jobFunction: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Job Function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Functions</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.jobLevel || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      jobLevel: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Job Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="C-Level">C-Level</SelectItem>
                    <SelectItem value="VP">VP</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.revenue || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      revenue: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Revenue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Revenues</SelectItem>
                    {revenueOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.country || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      country: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                  </SelectContent>
                </Select>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() =>
                        setFilters({
                          jobFunction: "",
                          jobLevel: "",
                          company: "",
                          country: "",
                          revenue: "",
                          engagementRange: { min: 0, max: 100 },
                        })
                      }
                      variant="outline"
                      size="icon"
                      aria-label="Reset filters"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle className="text-lg">Prospect Results</CardTitle>
                  <Badge variant="secondary" className="bg-gray-100">
                    {selectedItems.length} Selected
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 font-medium">
                    Total items shows
                  </span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                      <SelectItem value="1000">1000</SelectItem>
                    </SelectContent>
                  </Select>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="bg-valasys-orange hover:bg-valasys-orange/90"
                        disabled={selectedItems.length === 0 || isPremiumPage}
                        onClick={() =>
                          markStepCompleted("prospectDetailsDownloaded")
                        }
                        size="icon"
                        aria-label={`Export ${selectedItems.length}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden relative">
                {isPremiumPage && (
                  <div className="absolute inset-0 z-30 bg-white/10 backdrop-blur-sm">
                    <div className="h-full flex items-center justify-center p-8">
                      <PremiumOverlay />
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 pl-6">
                        <Checkbox
                          checked={
                            selectedItems.length === paginatedData.length &&
                            paginatedData.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      {columnVisibility.prospect && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("fullName")}
                        >
                          <div className="flex items-center justify-between">
                            Prospect
                            <div className="ml-2">
                              {sortField === "fullName" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.company && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("companyName")}
                        >
                          <div className="flex items-center justify-between">
                            Company
                            <div className="ml-2">
                              {sortField === "companyName" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.jobTitle && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("jobTitle")}
                        >
                          <div className="flex items-center justify-between">
                            Job Title
                            <div className="ml-2">
                              {sortField === "jobTitle" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.jobFunction && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("jobFunction")}
                        >
                          <div className="flex items-center justify-between">
                            Job Function
                            <div className="ml-2">
                              {sortField === "jobFunction" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.revenue && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("revenue")}
                        >
                          <div className="flex items-center justify-between">
                            Revenue
                            <div className="ml-2">
                              {sortField === "revenue" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.mainIndustry && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("industry")}
                        >
                          <div className="flex items-center justify-between">
                            Main Industry
                            <div className="ml-2">
                              {sortField === "industry" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.country && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("country")}
                        >
                          <div className="flex items-center justify-between">
                            Country
                            <div className="ml-2">
                              {sortField === "country" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.contactInfo && (
                        <TableHead>Contact Info</TableHead>
                      )}
                      {columnVisibility.actions && (
                        <TableHead className="w-16">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPremiumPage
                      ? Array.from({ length: 10 }, (_, index) => (
                          <TableRow key={`premium-${index}`}>
                            <TableCell className="pl-6">
                              <Checkbox disabled />
                            </TableCell>
                            {columnVisibility.prospect && (
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-gray-200 text-gray-400">
                                      PR
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium text-gray-400">
                                      Premium Prospect {index + 1}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Title hidden
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            )}
                            {columnVisibility.company && (
                              <TableCell>
                                <div className="font-medium text-gray-400 flex items-center">
                                  <Building className="w-4 h-4 mr-1 text-gray-300" />
                                  Premium Company
                                </div>
                                <div className="text-sm text-gray-400">
                                  Industry hidden
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Size • Revenue hidden
                                </div>
                              </TableCell>
                            )}
                            {columnVisibility.jobTitle && (
                              <TableCell>
                                <div className="text-sm text-gray-400">
                                  Premium Title
                                </div>
                              </TableCell>
                            )}
                            {columnVisibility.jobFunction && (
                              <TableCell>
                                <div className="text-sm text-gray-400">
                                  Premium Function
                                </div>
                              </TableCell>
                            )}
                            {columnVisibility.revenue && (
                              <TableCell>
                                <div className="text-sm text-gray-400">
                                  Premium Revenue
                                </div>
                              </TableCell>
                            )}
                            {columnVisibility.mainIndustry && (
                              <TableCell>
                                <div className="text-sm text-gray-400">
                                  Premium Industry
                                </div>
                              </TableCell>
                            )}
                            {columnVisibility.country && (
                              <TableCell>
                                <div className="text-sm text-gray-400">
                                  Premium Country
                                </div>
                              </TableCell>
                            )}
                            {columnVisibility.contactInfo && (
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm">
                                    <Mail className="w-3 h-3 mr-1 text-gray-300" />
                                    <span className="text-gray-400">
                                      Email hidden
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-400">
                                    <Phone className="w-3 h-3 mr-1 text-gray-300" />
                                    Phone hidden
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Linkedin className="w-3 h-3 mr-1 text-blue-400" />
                                    <span className="text-gray-400">
                                      LinkedIn hidden
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs text-gray-400">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    Location hidden
                                  </div>
                                </div>
                              </TableCell>
                            )}
                            {columnVisibility.actions && (
                              <TableCell>
                                <Button variant="ghost" size="sm" disabled>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      : paginatedData.map((prospect) => (
                          <TableRow
                            key={prospect.id}
                            className={cn(
                              "hover:bg-blue-50/50 transition-colors",
                              selectedItems.includes(prospect.id) &&
                                "bg-blue-50",
                            )}
                          >
                            <TableCell className="pl-6">
                              <Checkbox
                                checked={selectedItems.includes(prospect.id)}
                                onCheckedChange={(checked) =>
                                  handleSelectItem(
                                    prospect.id,
                                    checked as boolean,
                                  )
                                }
                              />
                            </TableCell>

                            {/* Prospect Info */}
                            {columnVisibility.prospect && (
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={prospect.profileImageUrl}
                                      alt={prospect.fullName}
                                    />
                                    <AvatarFallback className="bg-valasys-orange text-white">
                                      {prospect.firstName[0]}
                                      {prospect.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {prospect.fullName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {prospect.jobTitle}
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-1 py-0"
                                      >
                                        {prospect.jobLevel}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-1 py-0"
                                      >
                                        {prospect.jobFunction}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        aria-label={
                                          isFavorite(prospect.id)
                                            ? "Remove favorite"
                                            : "Add favorite"
                                        }
                                        onClick={() =>
                                          toggleFavorite(
                                            prospect.id,
                                            prospect.fullName,
                                          )
                                        }
                                      >
                                        <Star
                                          className={cn(
                                            "w-4 h-4",
                                            isFavorite(prospect.id)
                                              ? "text-yellow-500"
                                              : "text-gray-500",
                                          )}
                                          fill={
                                            isFavorite(prospect.id)
                                              ? "currentColor"
                                              : "none"
                                          }
                                        />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {isFavorite(prospect.id)
                                        ? "Unfavorite"
                                        : "Add to favorites"}
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            )}

                            {/* Company Info */}
                            {columnVisibility.company && (
                              <TableCell>
                                <div>
                                  <div className="font-medium text-gray-900 flex items-center">
                                    <Building className="w-4 h-4 mr-1 text-gray-400" />
                                    {prospect.companyName}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {prospect.industry}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {prospect.companySize} • {prospect.revenue}
                                  </div>
                                </div>
                              </TableCell>
                            )}

                            {/* Job Title */}
                            {columnVisibility.jobTitle && (
                              <TableCell>
                                <div className="text-sm text-gray-900">
                                  {prospect.jobTitle}
                                </div>
                              </TableCell>
                            )}

                            {/* Job Function */}
                            {columnVisibility.jobFunction && (
                              <TableCell>
                                <div className="text-sm text-gray-900">
                                  {prospect.jobFunction}
                                </div>
                              </TableCell>
                            )}

                            {/* Revenue */}
                            {columnVisibility.revenue && (
                              <TableCell>
                                <div className="text-sm text-gray-900">
                                  {prospect.revenue}
                                </div>
                              </TableCell>
                            )}

                            {/* Main Industry */}
                            {columnVisibility.mainIndustry && (
                              <TableCell>
                                <div className="text-sm text-gray-900">
                                  {prospect.industry}
                                </div>
                              </TableCell>
                            )}

                            {/* Country */}
                            {columnVisibility.country && (
                              <TableCell>
                                <div className="text-sm text-gray-900">
                                  {prospect.country}
                                </div>
                              </TableCell>
                            )}

                            {/* Contact Info (masked) */}
                            {columnVisibility.contactInfo && (
                              <TableCell>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center text-sm">
                                      <Mail className="w-3 h-3 mr-1 text-gray-400" />
                                      <a
                                        href={`mailto:${prospect.email}`}
                                        className="text-blue-600 hover:underline truncate max-w-[180px]"
                                      >
                                        {maskEmail(prospect.email)}
                                      </a>
                                    </div>
                                    {prospect.phone && (
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                        {maskPhone(prospect.phone)}
                                      </div>
                                    )}
                                    {prospect.linkedinUrl && (
                                      <div className="flex items-center text-sm">
                                        <Linkedin className="w-3 h-3 mr-1 text-blue-600" />
                                        <a
                                          href={prospect.linkedinUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline truncate max-w-[180px]"
                                        >
                                          {maskLinkedInText(
                                            prospect.linkedinUrl,
                                          )}
                                        </a>
                                      </div>
                                    )}
                                    <div className="flex items-center text-xs text-gray-500">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {prospect.city}, {prospect.country}
                                    </div>
                                  </div>
                                  <Sheet>
                                    <SheetTrigger asChild>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            aria-label="View details"
                                            onClick={() =>
                                              setSelectedProspect(prospect)
                                            }
                                          >
                                            <Eye className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          View details
                                        </TooltipContent>
                                      </Tooltip>
                                    </SheetTrigger>
                                    <SheetContent
                                      side="right"
                                      className="sm:max-w-md md:max-w-lg lg:max-w-xl w-[90vw] h-screen overflow-y-auto"
                                    >
                                      <SheetHeader>
                                        <SheetTitle className="flex items-center justify-between">
                                          <div className="flex items-center space-x-3">
                                            <Avatar className="h-12 w-12">
                                              <AvatarImage
                                                src={prospect.profileImageUrl}
                                                alt={prospect.fullName}
                                              />
                                              <AvatarFallback className="bg-valasys-orange text-white">
                                                {prospect.firstName[0]}
                                                {prospect.lastName[0]}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <div className="text-xl font-bold">
                                                {prospect.fullName}
                                              </div>
                                              <div className="text-sm text-gray-600 font-normal">
                                                {prospect.jobTitle} at{" "}
                                                {prospect.companyName}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              variant="secondary"
                                              className={cn(
                                                "border",
                                                getIntentSignalColor(
                                                  prospect.intentSignal,
                                                ),
                                              )}
                                            >
                                              {prospect.intentSignal}
                                            </Badge>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  aria-label={
                                                    isFavorite(prospect.id)
                                                      ? "Remove favorite"
                                                      : "Add favorite"
                                                  }
                                                  onClick={() =>
                                                    toggleFavorite(
                                                      prospect.id,
                                                      prospect.fullName,
                                                    )
                                                  }
                                                >
                                                  <Star
                                                    className={cn(
                                                      "w-4 h-4",
                                                      isFavorite(prospect.id)
                                                        ? "text-yellow-500"
                                                        : "text-gray-500",
                                                    )}
                                                    fill={
                                                      isFavorite(prospect.id)
                                                        ? "currentColor"
                                                        : "none"
                                                    }
                                                  />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                {isFavorite(prospect.id)
                                                  ? "Unfavorite"
                                                  : "Add to favorites"}
                                              </TooltipContent>
                                            </Tooltip>
                                          </div>
                                        </SheetTitle>
                                        <SheetDescription>
                                          Detailed prospect information and
                                          engagement data
                                        </SheetDescription>
                                      </SheetHeader>

                                      <div className="space-y-6">
                                        <div className="space-y-3">
                                          <a
                                            href={prospect.linkedinUrl || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm text-blue-600 hover:underline"
                                          >
                                            <Linkedin className="w-4 h-4 mr-2" />{" "}
                                            LinkedIn profile
                                          </a>
                                          <div className="space-y-2">
                                            {prospect.phone && (
                                              <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center">
                                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                  <span>{prospect.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                          handleCopy(
                                                            prospect.phone,
                                                            "Phone",
                                                          )
                                                        }
                                                        aria-label="Copy phone"
                                                      >
                                                        <Copy className="w-4 h-4" />
                                                      </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      Copy
                                                    </TooltipContent>
                                                  </Tooltip>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <Button
                                                        size="icon"
                                                        asChild
                                                        aria-label="Call"
                                                      >
                                                        <a
                                                          href={`tel:${prospect.phone}`}
                                                        >
                                                          <Phone className="w-4 h-4" />
                                                        </a>
                                                      </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      Call
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </div>
                                              </div>
                                            )}
                                            <div className="flex items-center justify-between text-sm">
                                              <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                <a
                                                  href={`mailto:${prospect.email}`}
                                                  className="text-blue-600 hover:underline"
                                                >
                                                  {prospect.email}
                                                </a>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      variant="outline"
                                                      size="icon"
                                                      onClick={() =>
                                                        handleCopy(
                                                          prospect.email,
                                                          "Email",
                                                        )
                                                      }
                                                      aria-label="Copy email"
                                                    >
                                                      <Copy className="w-4 h-4" />
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    Copy
                                                  </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      size="icon"
                                                      onClick={() =>
                                                        (window.location.href = `mailto:${prospect.email}`)
                                                      }
                                                      aria-label="Send email"
                                                    >
                                                      <Mail className="w-4 h-4" />
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    Email
                                                  </TooltipContent>
                                                </Tooltip>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4">
                                          <div>
                                            <div className="text-xs uppercase text-gray-500">
                                              Seniority
                                            </div>
                                            <div className="text-sm">
                                              {prospect.jobLevel}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-xs uppercase text-gray-500">
                                              Department
                                            </div>
                                            <div className="text-sm">
                                              {prospect.department || "N/A"}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-xs uppercase text-gray-500">
                                              Location
                                            </div>
                                            <div className="text-sm">
                                              {prospect.city},{" "}
                                              {prospect.country}
                                            </div>
                                          </div>
                                        </div>

                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-sm">
                                              Contact Information
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                              <div className="flex items-center justify-between w-full text-sm">
                                                <div className="flex items-center min-w-0">
                                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                  <a
                                                    href={`mailto:${prospect.email}`}
                                                    className="text-blue-600 hover:underline truncate"
                                                  >
                                                    {prospect.email}
                                                  </a>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                          handleCopy(
                                                            prospect.email,
                                                            "Email",
                                                          )
                                                        }
                                                        aria-label="Copy email"
                                                      >
                                                        <Copy className="w-4 h-4" />
                                                      </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      Copy
                                                    </TooltipContent>
                                                  </Tooltip>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <Button
                                                        size="icon"
                                                        onClick={() =>
                                                          (window.location.href = `mailto:${prospect.email}`)
                                                        }
                                                        aria-label="Send email"
                                                      >
                                                        <Mail className="w-4 h-4" />
                                                      </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      Email
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </div>
                                              </div>
                                              {prospect.phone && (
                                                <div className="flex items-center justify-between w-full text-sm">
                                                  <div className="flex items-center min-w-0">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                    <a
                                                      href={`tel:${prospect.phone}`}
                                                      className="hover:underline truncate"
                                                    >
                                                      {prospect.phone}
                                                    </a>
                                                  </div>
                                                  <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <Button
                                                          variant="outline"
                                                          size="icon"
                                                          onClick={() =>
                                                            handleCopy(
                                                              prospect.phone,
                                                              "Phone",
                                                            )
                                                          }
                                                          aria-label="Copy phone"
                                                        >
                                                          <Copy className="w-4 h-4" />
                                                        </Button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        Copy
                                                      </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <Button
                                                          size="icon"
                                                          asChild
                                                          aria-label="Call"
                                                        >
                                                          <a
                                                            href={`tel:${prospect.phone}`}
                                                          >
                                                            <Phone className="w-4 h-4" />
                                                          </a>
                                                        </Button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        Call
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </div>
                                                </div>
                                              )}
                                              {prospect.linkedinUrl && (
                                                <div className="flex items-center justify-between w-full text-sm">
                                                  <div className="flex items-center min-w-0">
                                                    <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                                                    <a
                                                      href={
                                                        prospect.linkedinUrl
                                                      }
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-blue-600 hover:underline flex items-center truncate"
                                                    >
                                                      LinkedIn Profile
                                                      <ExternalLink className="w-3 h-3 ml-1" />
                                                    </a>
                                                  </div>
                                                  <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <Button
                                                          variant="outline"
                                                          size="icon"
                                                          onClick={() =>
                                                            handleCopy(
                                                              prospect.linkedinUrl,
                                                              "LinkedIn URL",
                                                            )
                                                          }
                                                          aria-label="Copy LinkedIn URL"
                                                        >
                                                          <Copy className="w-4 h-4" />
                                                        </Button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        Copy
                                                      </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <Button
                                                          size="icon"
                                                          asChild
                                                          aria-label="Open LinkedIn"
                                                        >
                                                          <a
                                                            href={
                                                              prospect.linkedinUrl
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                          >
                                                            <ExternalLink className="w-4 h-4" />
                                                          </a>
                                                        </Button>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        Open
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </div>
                                                </div>
                                              )}
                                              <div className="flex items-center text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>
                                                  {prospect.city},{" "}
                                                  {prospect.country}
                                                </span>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>

                                        <Card>
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-sm">
                                              Professional Details
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                              <div className="flex items-center p-3 border rounded-lg">
                                                <div className="w-8 h-8 mr-3 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                                  <Briefcase className="w-4 h-4" />
                                                </div>
                                                <div>
                                                  <div className="text-xs uppercase text-gray-500">
                                                    Role
                                                  </div>
                                                  <div className="font-medium">
                                                    {prospect.jobTitle}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center p-3 border rounded-lg">
                                                <div className="w-8 h-8 mr-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                                  <Globe className="w-4 h-4" />
                                                </div>
                                                <div>
                                                  <div className="text-xs uppercase text-gray-500">
                                                    Department
                                                  </div>
                                                  <div>
                                                    {prospect.department ||
                                                      "N/A"}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center p-3 border rounded-lg">
                                                <div className="w-8 h-8 mr-3 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                  <BadgeCheck className="w-4 h-4" />
                                                </div>
                                                <div>
                                                  <div className="text-xs uppercase text-gray-500">
                                                    Level
                                                  </div>
                                                  <Badge variant="outline">
                                                    {prospect.jobLevel}
                                                  </Badge>
                                                </div>
                                              </div>
                                              <div className="flex items-center p-3 border rounded-lg">
                                                <div className="w-8 h-8 mr-3 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                                  <Settings2 className="w-4 h-4" />
                                                </div>
                                                <div>
                                                  <div className="text-xs uppercase text-gray-500">
                                                    Function
                                                  </div>
                                                  <Badge variant="outline">
                                                    {prospect.jobFunction}
                                                  </Badge>
                                                </div>
                                              </div>
                                              <div className="flex items-center p-3 border rounded-lg">
                                                <div className="w-8 h-8 mr-3 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                                                  <Building className="w-4 h-4" />
                                                </div>
                                                <div>
                                                  <div className="text-xs uppercase text-gray-500">
                                                    Company
                                                  </div>
                                                  <div>
                                                    {prospect.companyName}
                                                  </div>
                                                </div>
                                              </div>
                                              {prospect.yearsAtCompany && (
                                                <div className="flex items-center p-3 border rounded-lg">
                                                  <div className="w-8 h-8 mr-3 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4" />
                                                  </div>
                                                  <div className="w-full">
                                                    <div className="text-xs uppercase text-gray-500">
                                                      Tenure
                                                    </div>
                                                    <div>
                                                      {prospect.yearsAtCompany}{" "}
                                                      years at company
                                                    </div>
                                                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                      <div
                                                        className="h-2 bg-valasys-orange"
                                                        style={{
                                                          width: `${Math.min(100, prospect.yearsAtCompany * 10)}%`,
                                                        }}
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </CardContent>
                                        </Card>

                                        <Card>
                                          <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                              <CardTitle className="text-sm flex items-center gap-2">
                                                <Building className="w-4 h-4" />{" "}
                                                Company
                                              </CardTitle>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            <div className="text-sm text-gray-700">
                                              {prospect.companyName} is a
                                              prominent organization in the{" "}
                                              {prospect.industry} sector.
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                              <div className="flex items-center text-sm text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>
                                                  {prospect.city},{" "}
                                                  {prospect.country}
                                                </span>
                                              </div>
                                              <div className="flex items-center text-sm text-gray-700">
                                                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                                                <a
                                                  href={`https://${prospect.companyDomain}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600 hover:underline"
                                                >
                                                  View company page
                                                </a>
                                              </div>
                                              <div className="flex items-center text-sm text-gray-700">
                                                <BarChart3 className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>
                                                  {prospect.revenue} in revenue
                                                </span>
                                              </div>
                                              <div className="flex items-center text-sm text-gray-700">
                                                <Users className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>
                                                  {sizeToHeadcount(
                                                    prospect.companySize,
                                                  )}
                                                </span>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    </SheetContent>
                                  </Sheet>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                <div className="text-sm text-gray-600">
                  {isPremiumPage ? (
                    <span className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-valasys-orange" />
                      <span>Premium insights available with upgrade</span>
                    </span>
                  ) : (
                    <span>
                      Showing {startIndex + 1} to{" "}
                      {Math.min(startIndex + itemsPerPage, sortedData.length)}{" "}
                      of {sortedData.length} prospects
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      const isPremiumPageNum = pageNum > actualTotalPages;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            isPremiumPageNum ? "px-3 h-8" : "w-8 h-8 p-0",
                            pageNum === currentPage &&
                              "bg-valasys-orange hover:bg-valasys-orange/90",
                          )}
                        >
                          {isPremiumPageNum ? (
                            <div className="flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span className="text-xs">Premium</span>
                            </div>
                          ) : (
                            pageNum
                          )}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="text-gray-500">...</span>
                    )}
                    {totalPages > 5 && (
                      <Button
                        variant={
                          totalPages === currentPage ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className={cn(
                          "px-3 h-8",
                          totalPages === currentPage &&
                            "bg-valasys-orange hover:bg-valasys-orange/90",
                        )}
                      >
                        <div className="flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span className="text-xs">Premium</span>
                        </div>
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
