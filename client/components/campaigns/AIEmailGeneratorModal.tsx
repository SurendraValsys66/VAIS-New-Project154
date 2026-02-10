import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatGPTLikeInput } from "./ChatGPTLikeInput";

interface AIEmailGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignName: string;
  jobTitles: string[];
  jobFunctions: string[];
  jobLevels: string[];
  geolocations: string[];
  industries: string[];
}

interface EmailMode {
  id: "professional" | "friendly" | "data-driven";
  title: string;
  description: string;
  subject: string;
  body: string;
}

export function AIEmailGeneratorModal({
  isOpen,
  onClose,
  campaignName,
  jobTitles,
  jobFunctions,
  jobLevels,
  geolocations,
  industries,
}: AIEmailGeneratorModalProps) {
  const [productDescription, setProductDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmails, setGeneratedEmails] = useState<EmailMode[]>([]);
  const [editingEmails, setEditingEmails] = useState<{
    [key: string]: EmailMode;
  }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract key details from product description
  const extractProductDetails = (description: string) => {
    // Extract product name (first few words)
    const productNameMatch = description.match(/^([^.!?\n]+)/);
    const productName = productNameMatch
      ? productNameMatch[1].trim().substring(0, 50)
      : "our product";

    // Extract key features (sentences with "features", "benefits", "helps", "enables")
    const features = description
      .split(/[.!?]/)
      .filter((sentence) => {
        const lower = sentence.toLowerCase();
        return (
          lower.includes("feature") ||
          lower.includes("benefit") ||
          lower.includes("help") ||
          lower.includes("enable") ||
          lower.includes("improve") ||
          lower.includes("reduce") ||
          lower.includes("increase") ||
          lower.includes("save")
        );
      })
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 3);

    // Check if description mentions ROI, efficiency, cost
    const mentionsROI =
      description.toLowerCase().includes("roi") ||
      description.toLowerCase().includes("return") ||
      description.toLowerCase().includes("revenue");
    const mentionsEfficiency =
      description.toLowerCase().includes("efficient") ||
      description.toLowerCase().includes("productivity") ||
      description.toLowerCase().includes("faster") ||
      description.toLowerCase().includes("streamline");
    const mentionsCost =
      description.toLowerCase().includes("cost") ||
      description.toLowerCase().includes("price") ||
      description.toLowerCase().includes("budget") ||
      description.toLowerCase().includes("save");

    return {
      productName,
      features,
      mentionsROI,
      mentionsEfficiency,
      mentionsCost,
    };
  };

  // Generate 3 email modes
  const generateEmails = () => {
    if (!productDescription.trim()) {
      alert("Please enter a product description");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const primaryJobTitle = jobTitles[0] || "Professional";
      const primaryFunction = jobFunctions[0] || "your function";
      const primaryLevel = jobLevels[0] || "Manager";
      const primaryIndustry = industries[0] || "Your Industry";

      const details = extractProductDetails(productDescription);

      // Build feature list for emails
      const featureList =
        details.features.length > 0
          ? details.features
              .map((f) => `• ${f.trim()}`)
              .join("\n")
          : `• ${details.productName} streamlines ${primaryFunction}\n• Improves team productivity\n• Reduces manual work`;

      const attachmentNote =
        uploadedFiles.length > 0
          ? `\n\nI've attached detailed information about how we deliver these benefits.`
          : "";

      const emails: EmailMode[] = [
        {
          id: "professional",
          title: "Professional Mode",
          description: "Formal, business-focused approach",
          subject: `${details.productName} for ${primaryJobTitle}s - Strategic Opportunity`,
          body: `Dear ${primaryLevel},

I hope this message finds you well. I'm reaching out because your role in ${primaryFunction} at a leading ${primaryIndustry} organization aligns perfectly with the solutions we've developed.

We've created ${details.productName} specifically to address the operational challenges facing ${primaryJobTitle}s like yourself. Based on our research and implementation across leading ${primaryIndustry} organizations, we've consistently delivered:

${featureList}

Our clients have experienced measurable improvements in efficiency, cost management, and team productivity. The implementation is straightforward, with dedicated support throughout the process.

I'd welcome the opportunity to discuss how ${details.productName} could support your team's objectives for ${new Date().getFullYear()}.${attachmentNote}

Best regards,
[Your Name]`,
        },
        {
          id: "friendly",
          title: "Friendly Mode",
          description: "Conversational, approachable tone",
          subject: `Quick thought on ${details.productName} for ${primaryJobTitle}s`,
          body: `Hi ${primaryLevel},

I came across your profile and thought of you immediately. Here's why – you're a ${primaryJobTitle} managing ${primaryFunction} in ${primaryIndustry}, and I think you'd really appreciate what we've built.

Most ${primaryJobTitle}s tell us they're stuck with the same pain points: too much manual work, not enough time for strategy, and tools that don't quite fit their needs. Sound familiar?

That's exactly why we created ${details.productName}. Here's what it actually does:

${featureList}

The best part? It actually works the way you want it to. No complicated implementation, no learning curve. Just solid functionality that makes your job easier.

I'd love to grab 15 minutes with you to show how this could transform your workflow. Are you free next week?${attachmentNote}

Cheers,
[Your Name]`,
        },
        {
          id: "data-driven",
          title: "Data-Driven Mode",
          description: "Statistics and insights focused",
          subject: `${details.productName}: How ${primaryIndustry} ${primaryJobTitle}s Are Gaining Competitive Advantage`,
          body: `Hello ${primaryLevel},

Our recent analysis of ${primaryIndustry} organizations revealed a critical insight: ${primaryJobTitle}s who adopt modern solutions for ${primaryFunction} gain a measurable competitive advantage.

Here's what the data shows:

${details.mentionsCost ? "💰 Cost Impact:" : "📊 Key Benefits:"}
${featureList}

Our analysis across 100+ ${primaryIndustry} organizations implementing ${details.productName} found:
  • 35-45% reduction in manual work hours
  • 60% faster project completion times
  • 80%+ user adoption within the first month
  • 3:1 ROI within the first year

What's driving these results? ${details.productName} was purpose-built for ${primaryJobTitle}s in ${primaryIndustry}. It eliminates friction and enables strategic focus.

The organizations pulling ahead aren't waiting – they're implementing solutions like ${details.productName} now. Would you be interested in seeing how this applies to your specific situation?${attachmentNote}

Let me know your availability for a brief conversation.

Best regards,
[Your Name]`,
        },
      ];

      setGeneratedEmails(emails);
      const initialEditingState: { [key: string]: EmailMode } = {};
      emails.forEach((email) => {
        initialEditingState[email.id] = email;
      });
      setEditingEmails(initialEditingState);
      setIsGenerating(false);
    }, 1500);
  };

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Copy email to clipboard
  const copyEmail = (emailId: string) => {
    const email = editingEmails[emailId];
    if (!email) return;

    const content = `${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(content);
    setCopiedId(emailId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Update edited email
  const updateEmailField = (
    emailId: string,
    field: "subject" | "body",
    value: string,
  ) => {
    setEditingEmails((prev) => ({
      ...prev,
      [emailId]: {
        ...prev[emailId],
        [field]: value,
      },
    }));
  };

  // Remove file
  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setProductDescription("");
    setUploadedFiles([]);
    setGeneratedEmails([]);
    setEditingEmails({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-blue-600" />
            AI Email Generator
          </DialogTitle>
          <DialogDescription>
            Create professional emails in 3 different styles - Professional,
            Friendly, and Data-Driven
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* INPUT SECTION */}
          <div className="space-y-4">
            {/* Campaign Context */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Campaign:</span> {campaignName}{" "}
                | <span className="font-semibold">Target:</span>{" "}
                {jobTitles.slice(0, 2).join(", ")} in{" "}
                {industries.slice(0, 1).join(", ")}
              </p>
            </div>

            {/* ChatGPT-like Input */}
            <ChatGPTLikeInput
              value={productDescription}
              onChange={setProductDescription}
              onSubmit={generateEmails}
              uploadedFiles={uploadedFiles}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
              isLoading={isGenerating}
              disabled={false}
              placeholder="Describe your product or service in detail. Include key features, benefits, and unique value propositions..."
            />
          </div>

          {/* GENERATED EMAILS SECTION - TABS */}
          {generatedEmails.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Generated Email Samples
              </h3>
              <p className="text-sm text-gray-600">
                Click inside the email to edit. Use the copy button to copy the
                entire email.
              </p>

              <Tabs defaultValue="professional" className="w-full">
                {/* Tabs List */}
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                    value="professional"
                    className="text-sm font-medium"
                  >
                    Professional
                  </TabsTrigger>
                  <TabsTrigger value="friendly" className="text-sm font-medium">
                    Friendly
                  </TabsTrigger>
                  <TabsTrigger
                    value="data-driven"
                    className="text-sm font-medium"
                  >
                    Data-Driven
                  </TabsTrigger>
                </TabsList>

                {/* Tabs Content */}
                {generatedEmails.map((emailMode) => {
                  const editingEmail = editingEmails[emailMode.id];
                  const modeColors: {
                    [key: string]: { badge: string; border: string };
                  } = {
                    professional: {
                      badge: "bg-blue-100 text-blue-800",
                      border: "border-blue-200",
                    },
                    friendly: {
                      badge: "bg-green-100 text-green-800",
                      border: "border-green-200",
                    },
                    "data-driven": {
                      badge: "bg-purple-100 text-purple-800",
                      border: "border-purple-200",
                    },
                  };

                  const colors = modeColors[emailMode.id];

                  return (
                    <TabsContent
                      key={emailMode.id}
                      value={emailMode.id}
                      className="mt-4"
                    >
                      <div
                        className={cn(
                          "border-2 rounded-lg overflow-hidden",
                          colors.border,
                        )}
                      >
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                          <div>
                            <div
                              className={cn(
                                "inline-block px-2 py-1 rounded text-xs font-medium mb-2",
                                colors.badge,
                              )}
                            >
                              {emailMode.title}
                            </div>
                            <p className="text-xs text-gray-600">
                              {emailMode.description}
                            </p>
                          </div>
                          <Button
                            onClick={() => copyEmail(emailMode.id)}
                            size="sm"
                            variant={
                              copiedId === emailMode.id ? "default" : "outline"
                            }
                            className={cn(
                              "gap-1 ml-2",
                              copiedId === emailMode.id
                                ? "bg-green-600 hover:bg-green-700"
                                : "",
                            )}
                          >
                            {copiedId === emailMode.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Email Content */}
                        <div className="p-4 space-y-3">
                          {/* Subject */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              SUBJECT
                            </p>
                            <input
                              type="text"
                              value={editingEmail?.subject || ""}
                              onChange={(e) =>
                                updateEmailField(
                                  emailMode.id,
                                  "subject",
                                  e.target.value,
                                )
                              }
                              className="w-full text-sm font-medium text-gray-900 border-0 bg-transparent focus:outline-none border-b-2 border-gray-200 hover:border-gray-300 focus:border-blue-500 pb-1"
                            />
                          </div>

                          {/* Body */}
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">
                              MESSAGE
                            </p>
                            <Textarea
                              value={editingEmail?.body || ""}
                              onChange={(e) =>
                                updateEmailField(
                                  emailMode.id,
                                  "body",
                                  e.target.value,
                                )
                              }
                              className="min-h-32 text-sm resize-none border border-gray-200 rounded focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end border-t pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
