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
import {
  Copy,
  Sparkles,
  X,
  FileText,
  Paperclip,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

      const emails: EmailMode[] = [
        {
          id: "professional",
          title: "Professional Mode",
          description: "Formal, business-focused approach",
          subject: `Transforming ${primaryIndustry}: ${campaignName} Solution for ${primaryJobTitle}s`,
          body: `Dear ${primaryLevel},

I hope this message finds you well. I'm reaching out because your expertise in ${primaryFunction} at a leading ${primaryIndustry} organization makes you an ideal prospect for our latest initiative.

At ${campaignName}, we have developed a comprehensive solution specifically designed to address the unique challenges faced by ${primaryJobTitle} professionals like yourself. Our platform has helped over 500+ organizations improve operational efficiency by 40% while reducing costs.

Key Benefits:
• Industry-specific best practices tailored for ${primaryIndustry}
• Seamless integration with existing workflows
• Dedicated support from domain experts
• Measurable ROI within 90 days

${uploadedFiles.length > 0 ? `I have attached relevant materials that demonstrate our proven approach in organizations similar to yours.` : ""}

I would welcome the opportunity to discuss how we can help you achieve your strategic objectives for ${new Date().getFullYear()}.

Best regards,
[Your Name]
${campaignName}`,
        },
        {
          id: "friendly",
          title: "Friendly Mode",
          description: "Conversational, approachable tone",
          subject: `Quick thought - ${campaignName} for ${primaryJobTitle}s`,
          body: `Hi there!

I came across your profile and thought of you immediately. Here's why – you work in ${primaryFunction} in ${primaryIndustry}, and that's exactly the kind of leader we're trying to help right now.

Here's the situation: most ${primaryJobTitle}s spend way too much time on repetitive tasks instead of doing the strategic work that actually moves the needle. It's frustrating, right?

That's where ${campaignName} comes in. We've built something that specifically tackles this problem. Our platform helps teams like yours:

✓ Save 10+ hours per week on manual work
✓ Collaborate better across teams
✓ Get real insights that actually matter

The best part? You can get started in minutes – no complicated setup or learning curve.

${uploadedFiles.length > 0 ? `I've attached a quick overview showing how this works in practice.` : ""}

Would you be open to a quick 15-minute chat next week? I promise it'll be worth your time.

Cheers,
[Your Name]
${campaignName}`,
        },
        {
          id: "data-driven",
          title: "Data-Driven Mode",
          description: "Statistics and insights focused",
          subject: `Data shows ${primaryJobTitle}s in ${primaryIndustry} are saving 40% with ${campaignName}`,
          body: `Hello ${primaryLevel},

According to recent industry research, ${primaryJobTitle}s in ${primaryIndustry} waste an average of 15 hours per week on manual ${primaryFunction} processes. That's over 750 hours annually per professional.

The numbers tell an interesting story:

📊 Our research across 500+ ${primaryIndustry} organizations revealed:
  • 40% reduction in operational costs
  • 3x faster project delivery
  • 85% improvement in team productivity
  • 92% user adoption rate within 30 days

These aren't theoretical benefits. They're what ${campaignName} clients are experiencing right now.

Why the difference? Our platform is built specifically for ${primaryJobTitle}s who need to:
  1. Eliminate repetitive tasks in ${primaryFunction}
  2. Improve decision-making with real-time data
  3. Scale operations without adding headcount

${uploadedFiles.length > 0 ? `I've attached case studies showing exactly how similar organizations in your space achieved these results.` : ""}

The evidence is clear. Would you be interested in seeing how these metrics could apply to your organization?

Let me know when you're available for a quick conversation.

Best regards,
[Your Name]
${campaignName}`,
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
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validExtensions = [
        "pdf",
        "doc",
        "docx",
        "ppt",
        "pptx",
        "jpg",
        "jpeg",
        "png",
        "gif",
        "xls",
        "xlsx",
        "csv",
      ];

      const validFiles = files.filter((file) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        return validExtensions.includes(fileExtension);
      });

      if (validFiles.length > 0) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
      }

      e.target.value = "";
    }
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
    value: string
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
            {/* Product Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Description *
              </label>
              <div className="relative">
                <Textarea
                  placeholder="Describe your product or service in detail. Include key features, benefits, and unique value propositions..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="min-h-24 text-sm pr-10"
                />
                {/* Pin Icon for File Attachment */}
                <input
                  type="file"
                  id="file-upload"
                  key={`file-input-${uploadedFiles.length}`}
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-3 left-3 cursor-pointer text-gray-500 hover:text-blue-600 transition-colors"
                  title="Attach files"
                >
                  <Paperclip className="w-5 h-5" />
                </label>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-900">
                  ✓ Attached Files ({uploadedFiles.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-green-200 text-xs"
                    >
                      <FileText className="w-3 h-3 text-green-600" />
                      <span className="text-gray-700 truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign Context */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Campaign:</span> {campaignName}{" "}
                | <span className="font-semibold">Target:</span>{" "}
                {jobTitles.slice(0, 2).join(", ")} in{" "}
                {industries.slice(0, 1).join(", ")}
              </p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateEmails}
              disabled={!productDescription.trim() || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Emails...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Email
                </>
              )}
            </Button>
          </div>

          {/* GENERATED EMAILS SECTION */}
          {generatedEmails.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Generated Email Samples
              </h3>
              <p className="text-sm text-gray-600">
                Click inside the email to edit. Use the copy button to copy the
                entire email.
              </p>

              {/* Email Modes Grid */}
              <div className="grid grid-cols-1 gap-4">
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
                    <div
                      key={emailMode.id}
                      className={cn(
                        "border-2 rounded-lg overflow-hidden",
                        colors.border
                      )}
                    >
                      {/* Header */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div>
                          <div className={cn("inline-block px-2 py-1 rounded text-xs font-medium mb-2", colors.badge)}>
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
                              : ""
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
                                e.target.value
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
                                e.target.value
                              )
                            }
                            className="min-h-32 text-sm resize-none border border-gray-200 rounded focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
