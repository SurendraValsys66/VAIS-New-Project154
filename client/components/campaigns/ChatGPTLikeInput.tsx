import React, { useRef, useEffect, useState } from "react";
import {
  FileText,
  Paperclip,
  Send,
  X,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatGPTLikeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  uploadedFiles: File[];
  onFileUpload: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const iconProps = "w-3 h-3";

  switch (extension) {
    case "pdf":
      return <File className={cn(iconProps, "text-red-600")} />;
    case "csv":
      return <FileSpreadsheet className={cn(iconProps, "text-green-600")} />;
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className={cn(iconProps, "text-green-600")} />;
    case "docx":
    case "doc":
      return <FileText className={cn(iconProps, "text-blue-600")} />;
    case "pptx":
    case "ppt":
      return <File className={cn(iconProps, "text-orange-600")} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <File className={cn(iconProps, "text-purple-600")} />;
    default:
      return <FileText className={cn(iconProps, "text-gray-600")} />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

export function ChatGPTLikeInput({
  value,
  onChange,
  onSubmit,
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  isLoading = false,
  disabled = false,
  placeholder = "Write or paste your email prompt here…",
}: ChatGPTLikeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-expand textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 56), 240); // 2 lines min, ~10 lines max
    textarea.style.height = newHeight + "px";
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (value.trim() && !isLoading && !disabled) {
        onSubmit();
      }
    }
    // Enter key creates a new line (default behavior)
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validExtensions = ["pdf", "doc", "docx", "ppt", "pptx", "csv", "xls", "xlsx"];
      const maxFileSize = 5 * 1024 * 1024; // 5 MB

      const validFiles = files.filter((file) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        if (!validExtensions.includes(fileExtension)) {
          return false;
        }
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" exceeds 5 MB limit`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        onFileUpload(validFiles);
      }

      // Reset input
      e.target.value = "";
    }
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-3">
      {/* Attached Files - Chips */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-xs"
            >
              {getFileIcon(file.name)}
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium truncate max-w-[120px]">
                  {file.name}
                </span>
                <span className="text-gray-500 text-xs">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                className="ml-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div
        className={cn(
          "relative bg-white border rounded-2xl transition-all duration-200",
          isFocused
            ? "border-blue-400 shadow-lg shadow-blue-500/10"
            : "border-gray-200 shadow-sm hover:shadow-md",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <div className="flex items-end gap-2 p-3">
          {/* Textarea */}
          <div className="flex-1 flex items-center">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full bg-transparent resize-none outline-none text-sm leading-relaxed",
                "placeholder-gray-400 text-gray-900",
                "min-h-14 max-h-60 overflow-y-auto",
                disabled && "cursor-not-allowed"
              )}
              style={{
                height: "56px", // Initial height (2 lines)
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Paperclip Icon */}
            <button
              onClick={handlePaperclipClick}
              disabled={isLoading || disabled}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isLoading || disabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              )}
              title="Attach files (.csv, .xlsx, .xls, .pdf, .docx - Max 5MB)"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Submit Button */}
            <button
              onClick={() => {
                if (value.trim() && !isLoading && !disabled) {
                  onSubmit();
                }
              }}
              disabled={!value.trim() || isLoading || disabled}
              className={cn(
                "p-2 rounded-lg transition-all duration-200 flex-shrink-0",
                value.trim() && !isLoading && !disabled
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
              title={
                value.trim()
                  ? "Send (or Ctrl+Enter / Cmd+Enter)"
                  : "Enter a prompt to send"
              }
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.csv,.xls,.xlsx"
      />

      {/* Helper Text */}
      <p className="text-xs text-gray-500 px-1">
        Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 text-gray-700 font-mono text-xs">Ctrl</kbd>
        <span className="mx-0.5">+</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 text-gray-700 font-mono text-xs">Enter</kbd>
        to submit, or just press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 text-gray-700 font-mono text-xs">Enter</kbd> for a new line
      </p>
    </div>
  );
}
