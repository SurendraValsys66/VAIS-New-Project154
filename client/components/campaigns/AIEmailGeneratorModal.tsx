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
import {
  Download,
  Send,
  FileText,
  Upload,
  Sparkles,
  X,
  Edit2,
  Trash2,
  Mail,
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

type ViewType = "input" | "preview" | "edit";

interface GeneratedEmail {
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
  const [view, setView] = useState<ViewType>("input");
  const [productDescription, setProductDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(
    null
  );
  const [editedEmail, setEditedEmail] = useState<GeneratedEmail | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Generate email content (mock AI)
  const generateEmail = () => {
    if (!productDescription.trim()) {
      alert("Please enter a product description");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const primaryJobTitle = jobTitles[0] || "Professional";
      const primaryIndustry = industries[0] || "Your Industry";

      const email: GeneratedEmail = {
        subject: `Transform Your ${primaryIndustry} with ${campaignName}: ${productDescription.substring(0, 30)}...`,
        body: `Dear ${jobLevels[0] || "Manager"},

I hope this message finds you well. I'm reaching out because I came across your profile and believe you'd be an excellent fit for what we're offering.

At ${campaignName}, we've developed something that addresses a key challenge in ${jobFunctions[0] || "your function"}: "${productDescription}"

What makes our solution unique:
• Specifically designed for ${jobTitles.slice(0, 2).join(" and ")} professionals
• Proven to deliver results in ${primaryIndustry}
• Tailored for ${jobLevels.join(", ")} level professionals

${
  uploadedFiles.length > 0
    ? `I've also attached relevant materials (${uploadedFiles.map((f) => f.name).join(", ")}) that showcase how this works in practice.`
    : ""
}

Would you be open to a brief conversation about how this could benefit your team? I can share specific case studies from similar organizations in ${geolocations.slice(0, 1).join(", ")}.

Looking forward to connecting.

Best regards,
[Your Name]
${campaignName}`,
      };

      setGeneratedEmail(email);
      setEditedEmail(email);
      setView("preview");
      setIsGenerating(false);
    }, 1500);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        const validTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "image/jpeg",
          "image/png",
          "image/gif",
        ];
        return validTypes.includes(file.type);
      });
      setUploadedFiles([...uploadedFiles, ...validFiles]);
    }
  };

  // Handle drag and drop
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

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((file) => {
        const validTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "image/jpeg",
          "image/png",
          "image/gif",
        ];
        return validTypes.includes(file.type);
      });
      setUploadedFiles([...uploadedFiles, ...validFiles]);
    }
  };

  // Download email
  const downloadEmail = (format: "pdf" | "docx") => {
    if (!editedEmail) return;

    const content = `${editedEmail.subject}\n\n${editedEmail.body}`;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute(
      "download",
      `email_draft.${format === "pdf" ? "pdf" : "docx"}`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Send email (mock)
  const sendEmail = () => {
    alert("Email sent successfully!");
    onClose();
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setView("input");
    setProductDescription("");
    setUploadedFiles([]);
    setGeneratedEmail(null);
    setEditedEmail(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-blue-600" />
            AI Email Generator
          </DialogTitle>
          <DialogDescription>
            {view === "input" && "Describe your product and let AI generate a professional email"}
            {view === "preview" && "Review your generated email"}
            {view === "edit" && "Edit your email before sending"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* INPUT VIEW */}
          {view === "input" && (
            <div className="space-y-4">
              {/* Product Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Product Description *
                </label>
                <Textarea
                  placeholder="Describe your product or service in detail. Include key features, benefits, and unique value propositions..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="min-h-32 text-sm"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Attach Supporting Files (Optional)
                </label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-gray-50 hover:border-blue-300",
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      Drag files here or{" "}
                      <label
                        htmlFor="file-upload"
                        className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                      >
                        browse
                      </label>
                    </p>
                    <p className="text-xs text-gray-600">
                      Supports PDF, Word, PowerPoint, and Images (max 10 MB each)
                    </p>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-xs text-gray-700">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
                onClick={generateEmail}
                disabled={!productDescription.trim() || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Email...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Email
                  </>
                )}
              </Button>
            </div>
          )}

          {/* PREVIEW VIEW */}
          {view === "preview" && generatedEmail && (
            <div className="space-y-4">
              {/* Email Preview */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                {/* Subject */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    SUBJECT
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {editedEmail?.subject}
                  </p>
                </div>

                {/* Body */}
                <div className="bg-gray-50 rounded p-3 max-h-48 overflow-y-auto">
                  <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {editedEmail?.body}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {/* Edit Button */}
                <Button
                  onClick={() => setView("edit")}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>

                {/* Download Button - Dropdown would go here */}
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => downloadEmail("docx")}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>

                {/* Send Button */}
                <Button
                  onClick={sendEmail}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </div>
          )}

          {/* EDIT VIEW */}
          {view === "edit" && editedEmail && (
            <div className="space-y-4">
              {/* Subject Edit */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={editedEmail.subject}
                  onChange={(e) =>
                    setEditedEmail({ ...editedEmail, subject: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Body Edit */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Body
                </label>
                <Textarea
                  value={editedEmail.body}
                  onChange={(e) =>
                    setEditedEmail({ ...editedEmail, body: e.target.value })
                  }
                  className="min-h-48 text-sm"
                />
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setView("preview")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setView("preview")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </Button>
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
