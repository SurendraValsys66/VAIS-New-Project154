import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Search,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn, Link } from "@/lib/utils";

// Types
type CampaignStatus =
  | "Open"
  | "OnProcess"
  | "Completed"
  | "Accepted"
  | "Declined";

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

interface CampaignRequest {
  id: string;
  campaignName: string;
  assignedTeamMember: TeamMember;
  dateRequested: string;
  status: CampaignStatus;
  description?: string;
  jobTitles?: string[];
  industries?: string[];
}

// Mock data
const mockCampaignRequests: CampaignRequest[] = [
  {
    id: "1",
    campaignName: "Q1 Software Engineers Campaign",
    assignedTeamMember: {
      id: "tm1",
      name: "Sarah Johnson",
      initials: "SJ",
      avatar: undefined,
    },
    dateRequested: "2024-01-15",
    status: "Completed",
    description: "Target software engineers in tech companies",
    jobTitles: ["Software Engineer", "Senior Software Engineer"],
    industries: ["Technology"],
  },
  {
    id: "2",
    campaignName: "Healthcare Marketing Push",
    assignedTeamMember: {
      id: "tm2",
      name: "Michael Chen",
      initials: "MC",
      avatar: undefined,
    },
    dateRequested: "2024-01-20",
    status: "OnProcess",
    description: "Marketing campaign for healthcare professionals",
    jobTitles: ["Marketing Manager", "CMO"],
    industries: ["Healthcare"],
  },
  {
    id: "3",
    campaignName: "Financial Services Outreach",
    assignedTeamMember: {
      id: "tm3",
      name: "Emily Rodriguez",
      initials: "ER",
      avatar: undefined,
    },
    dateRequested: "2024-01-25",
    status: "Open",
    description: "Targeting financial service companies",
    jobTitles: ["Financial Analyst", "Finance Director"],
    industries: ["Finance"],
  },
  {
    id: "4",
    campaignName: "Manufacturing VP Outreach",
    assignedTeamMember: {
      id: "tm1",
      name: "Sarah Johnson",
      initials: "SJ",
      avatar: undefined,
    },
    dateRequested: "2024-02-01",
    status: "Accepted",
    description: "Targeting VPs in manufacturing companies",
    jobTitles: ["VP Operations", "VP Manufacturing"],
    industries: ["Manufacturing"],
  },
  {
    id: "5",
    campaignName: "Retail Chain Campaign",
    assignedTeamMember: {
      id: "tm4",
      name: "David Wilson",
      initials: "DW",
      avatar: undefined,
    },
    dateRequested: "2024-02-05",
    status: "Declined",
    description: "Campaign targeting retail chain executives",
    jobTitles: ["Store Manager", "Regional Director"],
    industries: ["Retail"],
  },
];

// Status badge styling
const getStatusBadgeVariant = (status: CampaignStatus) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "OnProcess":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Accepted":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "Declined":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

// Campaign detail view component
interface CampaignDetailViewProps {
  campaign: CampaignRequest;
  isOpen: boolean;
  onClose: () => void;
}

function CampaignDetailView({
  campaign,
  isOpen,
  onClose,
}: CampaignDetailViewProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{campaign.campaignName}</SheetTitle>
          <SheetDescription>
            Campaign details and specifications
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="font-medium mb-2">Campaign Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusBadgeVariant(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date Requested:</span>
                <span>
                  {new Date(campaign.dateRequested).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned To:</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={campaign.assignedTeamMember.avatar} />
                    <AvatarFallback className="text-xs">
                      {campaign.assignedTeamMember.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span>{campaign.assignedTeamMember.name}</span>
                </div>
              </div>
            </div>
          </div>

          {campaign.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {campaign.description}
              </p>
            </div>
          )}

          {campaign.jobTitles && campaign.jobTitles.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Target Job Titles</h4>
              <div className="flex flex-wrap gap-1">
                {campaign.jobTitles.map((title) => (
                  <Badge key={title} variant="outline" className="text-xs">
                    {title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {campaign.industries && campaign.industries.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Target Industries</h4>
              <div className="flex flex-wrap gap-1">
                {campaign.industries.map((industry) => (
                  <Badge key={industry} variant="outline" className="text-xs">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {campaign.status === "Completed" && (
            <div className="pt-4 border-t">
              <Button className="w-full" onClick={() => {}}>
                <Download className="w-4 h-4 mr-2" />
                Download Deliverables
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Delete confirmation dialog
interface DeleteConfirmationProps {
  campaign: CampaignRequest;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmation({
  campaign,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Campaign Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{campaign.campaignName}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main component
export default function CampaignRequestsList() {
  const [campaigns, setCampaigns] =
    useState<CampaignRequest[]>(mockCampaignRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "All">(
    "All",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCampaign, setSelectedCampaign] =
    useState<CampaignRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] =
    useState<CampaignRequest | null>(null);

  const itemsPerPage = 10;

  // Filtered and searched campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.campaignName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        campaign.assignedTeamMember.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  // Handlers
  const handleViewCampaign = (campaign: CampaignRequest) => {
    if (campaign.status === "Completed") {
      setSelectedCampaign(campaign);
    }
  };

  const handleDeleteCampaign = (campaign: CampaignRequest) => {
    if (campaign.status === "Open" || campaign.status === "Declined") {
      setCampaignToDelete(campaign);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (campaignToDelete) {
      setCampaigns(campaigns.filter((c) => c.id !== campaignToDelete.id));
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleDownloadDeliverables = (campaign: CampaignRequest) => {
    if (campaign.status === "Completed") {
      // Simulate download
      console.log("Downloading deliverables for:", campaign.campaignName);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search campaigns or team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as CampaignStatus | "All")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="OnProcess">On Process</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Requests Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  Campaign Name
                  <div className="ml-2">
                    <span className="text-gray-400">↕</span>
                  </div>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  Assigned Team Member
                  <div className="ml-2">
                    <span className="text-gray-400">↕</span>
                  </div>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  Date Requested
                  <div className="ml-2">
                    <span className="text-gray-400">↕</span>
                  </div>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  Status
                  <div className="ml-2">
                    <span className="text-gray-400">↕</span>
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCampaigns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No campaign requests found
                </TableCell>
              </TableRow>
            ) : (
              currentCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    {campaign.status === "Completed" ? (
                      <Link
                        to={`/campaign-overview/${campaign.id}`}
                        className="font-medium text-primary hover:underline cursor-pointer"
                      >
                        {campaign.campaignName}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {campaign.campaignName}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={campaign.assignedTeamMember.avatar} />
                        <AvatarFallback className="text-xs">
                          {campaign.assignedTeamMember.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{campaign.assignedTeamMember.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.dateRequested).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {campaign.status === "Completed" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          title="View campaign overview"
                          className="bg-white hover:bg-blue-50 border border-blue-300 text-blue-600 hover:text-blue-700"
                        >
                          <Link to={`/campaign-overview/${campaign.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCampaign(campaign)}
                          disabled={true}
                          title="Only available for completed campaigns"
                          className="bg-white hover:bg-blue-50 border border-blue-300 text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDeliverables(campaign)}
                        disabled={campaign.status !== "Completed"}
                        title={
                          campaign.status !== "Completed"
                            ? "Only available for completed campaigns"
                            : "Download deliverables"
                        }
                        className="bg-white hover:bg-green-50 border border-green-300 text-green-600 hover:text-green-700"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCampaign(campaign)}
                        disabled={
                          campaign.status !== "Open" &&
                          campaign.status !== "Declined"
                        }
                        title={
                          campaign.status !== "Open" &&
                          campaign.status !== "Declined"
                            ? "Only available for open or declined campaigns"
                            : "Delete campaign"
                        }
                        className="bg-white hover:bg-red-50 border border-red-300 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredCampaigns.length)} of{" "}
            {filteredCampaigns.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1),
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Campaign Detail View */}
      {selectedCampaign && (
        <CampaignDetailView
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {campaignToDelete && (
        <DeleteConfirmation
          campaign={campaignToDelete}
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setCampaignToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
