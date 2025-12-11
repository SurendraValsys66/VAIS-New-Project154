import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ratingEmojis = [
  {
    value: 1,
    label: "Very Dissatisfied",
    gif: "https://cdn.builder.io/o/assets%2Ff9a15ea1ed2e4a49812760317a321a66%2F0f494860515e4ea8b119bf8a87a3a604?alt=media&token=8f58c95d-f3d5-47f5-9175-9695960d477a&apiKey=f9a15ea1ed2e4a49812760317a321a66",
  },
  {
    value: 2,
    label: "Dissatisfied",
    gif: "https://cdn.builder.io/o/assets%2Ff9a15ea1ed2e4a49812760317a321a66%2F159a388fa499458aa678a359ddcfd6be?alt=media&token=7bff03eb-2b43-4829-9e95-a58e3768ef87&apiKey=f9a15ea1ed2e4a49812760317a321a66",
  },
  {
    value: 3,
    label: "Neutral",
    gif: "https://cdn.builder.io/o/assets%2Ff9a15ea1ed2e4a49812760317a321a66%2F7909ba7ecd4d4178951f1c721472172f?alt=media&token=0a419fc2-274f-4ce5-b0f4-e22442572b60&apiKey=f9a15ea1ed2e4a49812760317a321a66",
  },
  {
    value: 4,
    label: "Satisfied",
    gif: "https://cdn.builder.io/o/assets%2Ff9a15ea1ed2e4a49812760317a321a66%2Fead231d28664412e85e3d27393b50511?alt=media&token=8b1c2a7e-101f-4174-8d43-24917fdd8cda&apiKey=f9a15ea1ed2e4a49812760317a321a66",
  },
  {
    value: 5,
    label: "Very Satisfied",
    gif: "https://cdn.builder.io/o/assets%2Ff9a15ea1ed2e4a49812760317a321a66%2Fc3469c9a8c544795832c09459f70e473?alt=media&token=40f0a4db-707d-4a66-8858-b780198c8c07&apiKey=f9a15ea1ed2e4a49812760317a321a66",
  },
];

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [rating, setRating] = useState<number | null>(3);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const gifRefs = useRef<Record<number, HTMLImageElement | null>>({});
  const { toast } = useToast();

  const handleSendFeedback = () => {
    if (!rating || !comment.trim()) {
      alert("Please provide a rating and comment");
      return;
    }

    console.log("Feedback submitted:", { rating, comment });
    setRating(3);
    setComment("");
    onOpenChange(false);

    // Show success toast
    toast({
      title: "Thank you for your feedback!",
      description:
        "We appreciate your input and will use it to improve our service.",
    });
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById(
      "feedback-textarea",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = comment.substring(start, end);
    let newText = comment;
    let cursorPos = start;

    switch (format) {
      case "bold":
        newText =
          comment.substring(0, start) +
          `**${selectedText}**` +
          comment.substring(end);
        cursorPos = start + 2 + selectedText.length + 2;
        break;
      case "italic":
        newText =
          comment.substring(0, start) +
          `*${selectedText}*` +
          comment.substring(end);
        cursorPos = start + 1 + selectedText.length + 1;
        break;
      case "strikethrough":
        newText =
          comment.substring(0, start) +
          `~~${selectedText}~~` +
          comment.substring(end);
        cursorPos = start + 2 + selectedText.length + 2;
        break;
      case "link":
        newText =
          comment.substring(0, start) +
          `[${selectedText || "link"}](url)` +
          comment.substring(end);
        cursorPos = start + 1 + (selectedText || "link").length + 3;
        break;
      case "list":
        newText =
          comment.substring(0, start) +
          `\n- ${selectedText}\n` +
          comment.substring(end);
        cursorPos = start + 3 + selectedText.length;
        break;
      case "ordered-list":
        newText =
          comment.substring(0, start) +
          `\n1. ${selectedText}\n` +
          comment.substring(end);
        cursorPos = start + 4 + selectedText.length;
        break;
      case "code":
        newText =
          comment.substring(0, start) +
          `\`${selectedText}\`` +
          comment.substring(end);
        cursorPos = start + 1 + selectedText.length + 1;
        break;
    }

    setComment(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-white">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 -mx-6 px-6">
          <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
        </div>

        <div className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-3 text-center">
            <h3 className="text-lg font-bold text-gray-900">
              We love to hear from you! How's your experience with the{" "}
              <span className="text-valasys-orange">Valasys AI Score</span>?
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your feedback helps us improve our service.
              <br />
              Please share your thoughts and suggestions below.
            </p>

            {/* GIF Rating */}
            <div className="flex justify-center items-center gap-2 py-4">
              {ratingEmojis.map((item) => (
                <div
                  key={item.value}
                  className="flex flex-col items-center gap-1"
                >
                  <button
                    onClick={() => setRating(item.value)}
                    onMouseEnter={() => setHoveredRating(item.value)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className={cn(
                      "transition-all duration-200 transform relative flex items-center justify-center",
                      rating === item.value
                        ? "scale-125"
                        : "scale-100 hover:scale-110",
                      rating === item.value &&
                        "p-1.5 bg-valasys-orange rounded-full",
                    )}
                    title={item.label}
                    type="button"
                  >
                    <img
                      ref={(el) => {
                        if (el) gifRefs.current[item.value] = el;
                      }}
                      src={item.gif}
                      alt={item.label}
                      className={cn(
                        "w-8 h-8 rounded-full object-cover transition-all duration-200",
                        rating === item.value || hoveredRating === item.value
                          ? "opacity-100 drop-shadow-lg"
                          : "opacity-70",
                      )}
                    />
                    {(rating === item.value ||
                      hoveredRating === item.value) && (
                      <div className="absolute inset-0 rounded-full ring-2 ring-offset-1 ring-valasys-orange pointer-events-none" />
                    )}
                  </button>
                  <span className="text-xs text-gray-600 text-center max-w-[60px] leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
              <FormatButton
                icon={Bold}
                onClick={() => insertFormatting("bold")}
                title="Bold"
              />
              <FormatButton
                icon={Italic}
                onClick={() => insertFormatting("italic")}
                title="Italic"
              />
              <FormatButton
                icon={Strikethrough}
                onClick={() => insertFormatting("strikethrough")}
                title="Strikethrough"
              />
              <FormatButton
                icon={Link}
                onClick={() => insertFormatting("link")}
                title="Link"
              />
              <FormatButton
                icon={List}
                onClick={() => insertFormatting("list")}
                title="Bullet List"
              />
              <FormatButton
                icon={ListOrdered}
                onClick={() => insertFormatting("ordered-list")}
                title="Ordered List"
              />
              <FormatButton
                icon={Code}
                onClick={() => insertFormatting("code")}
                title="Code"
              />
            </div>

            {/* Textarea */}
            <textarea
              id="feedback-textarea"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none min-h-32"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendFeedback}
            className="w-full bg-valasys-orange hover:bg-valasys-orange/90 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Send Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface FormatButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  title: string;
}

function FormatButton({ icon: Icon, onClick, title }: FormatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700 hover:text-gray-900"
      title={title}
      type="button"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
