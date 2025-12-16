import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EmailTemplate, ContentBlock } from "./types";
import { BlocksPanel } from "./BlocksPanel";
import { SettingsPanel } from "./SettingsPanel";
import { BlockRenderer } from "./BlockRenderer";
import { EmailPreview } from "./EmailPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createEmptyTemplate,
  saveTemplateToLocalStorage,
  getTemplatesFromLocalStorage,
  deleteTemplateFromLocalStorage,
} from "./utils";
import {
  Save,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDrop } from "react-dnd";

interface EmailBuilderProps {
  templateId?: string;
  onBack?: () => void;
}

export const EmailBuilder: React.FC<EmailBuilderProps> = ({
  templateId,
  onBack,
}) => {
  const [template, setTemplate] = useState<EmailTemplate>(() => {
    if (templateId) {
      const existing = getTemplatesFromLocalStorage().find(
        (t) => t.id === templateId,
      );
      return existing || createEmptyTemplate();
    }
    return createEmptyTemplate();
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);
  const [templateSubject, setTemplateSubject] = useState(template.subject);
  const [undoStack, setUndoStack] = useState<EmailTemplate[]>([]);
  const [redoStack, setRedoStack] = useState<EmailTemplate[]>([]);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const updated = {
        ...template,
        name: templateName,
        subject: templateSubject,
      };
      setTemplate(updated);
    }, 500);
    return () => clearTimeout(timer);
  }, [templateName, templateSubject]);

  const selectedBlock =
    template.blocks.find((b) => b.id === selectedBlockId) || null;

  const handleAddBlock = useCallback((block: ContentBlock) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: [...prev.blocks, block],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleUpdateBlock = useCallback((block: ContentBlock) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === block.id ? block : b)),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const handleDeleteBlock = useCallback(() => {
    if (selectedBlockId) {
      setTemplate((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((b) => b.id !== selectedBlockId),
        updatedAt: new Date().toISOString(),
      }));
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  const handleMoveBlock = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragBlock = template.blocks[dragIndex];
      const newBlocks = [...template.blocks];
      newBlocks.splice(dragIndex, 1);
      newBlocks.splice(hoverIndex, 0, dragBlock);
      setTemplate((prev) => ({
        ...prev,
        blocks: newBlocks,
        updatedAt: new Date().toISOString(),
      }));
    },
    [template.blocks],
  );

  const handleSaveTemplate = () => {
    const updated = {
      ...template,
      name: templateName,
      subject: templateSubject,
      updatedAt: new Date().toISOString(),
    };
    setTemplate(updated);
    saveTemplateToLocalStorage(updated);
    setShowSaveDialog(false);
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const newUndo = [...undoStack];
      const prevTemplate = newUndo.pop()!;
      setRedoStack([...redoStack, template]);
      setTemplate(prevTemplate);
      setUndoStack(newUndo);
    }
  }, [undoStack, redoStack, template]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const newRedo = [...redoStack];
      const nextTemplate = newRedo.pop()!;
      setUndoStack([...undoStack, template]);
      setTemplate(nextTemplate);
      setRedoStack(newRedo);
    }
  }, [undoStack, redoStack, template]);

  return (
    <DashboardLayout>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            {onBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <div className="flex-1 max-w-md">
              <div className="text-sm text-gray-600 mb-1">New template</div>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name"
                className="font-semibold text-lg border-0 px-0 focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                Unsaved changes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className={previewMode ? "bg-valasys-orange text-white" : ""}
            >
              <Eye className="w-4 h-4 mr-1" />
              {previewMode ? "Edit" : "Preview & test"}
            </Button>
            <Button
              onClick={() => setShowSaveDialog(true)}
              className="gap-2 bg-valasys-orange hover:bg-valasys-orange/90 text-white"
            >
              <Save className="w-4 h-4" />
              Save & exit
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {previewMode ? (
            <div className="flex-1">
              <EmailPreview template={template} />
            </div>
          ) : (
            <>
              {/* Left Sidebar - Blocks Panel with Selected Blocks */}
              <div className="flex flex-col w-72 bg-white border-r border-gray-200 overflow-hidden">
                {/* Blocks/Sections/Saved Tabs */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  <BlocksPanel onAddBlock={handleAddBlock} />
                </div>
              </div>

              {/* Center - Editor Canvas */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-2xl mx-auto">
                  {/* Template Settings */}
                  <div className="bg-white border border-gray-200 rounded-t-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject" className="text-xs font-medium text-gray-700">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          value={templateSubject}
                          onChange={(e) => setTemplateSubject(e.target.value)}
                          placeholder="Email subject"
                          className="text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bgColor" className="text-xs font-medium text-gray-700">
                          Background
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="bgColor"
                            type="color"
                            value={template.backgroundColor}
                            onChange={(e) =>
                              setTemplate({
                                ...template,
                                backgroundColor: e.target.value,
                              })
                            }
                            className="text-sm w-12 h-10"
                          />
                          <Input
                            type="text"
                            value={template.backgroundColor}
                            onChange={(e) =>
                              setTemplate({
                                ...template,
                                backgroundColor: e.target.value,
                              })
                            }
                            className="text-sm flex-1"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blocks Canvas */}
                  <div
                    style={{
                      backgroundColor: template.backgroundColor,
                      padding: `${template.padding}px`,
                    }}
                    className="bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-sm min-h-96"
                  >
                    {template.blocks.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-8 h-8 text-gray-300" />
                          </div>
                        </div>
                        <p className="mb-2 text-gray-600 font-medium">Drop content here</p>
                        <p className="text-sm text-gray-400">
                          Add blocks from the left sidebar to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {template.blocks.map((block) => (
                          <div key={block.id}>
                            <BlockRenderer
                              block={block}
                              isSelected={selectedBlockId === block.id}
                              onBlockUpdate={handleUpdateBlock}
                              onBlockSelect={setSelectedBlockId}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Settings Panel */}
              <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
                <SettingsPanel
                  block={selectedBlock}
                  onBlockUpdate={handleUpdateBlock}
                  onBlockDelete={handleDeleteBlock}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
            <DialogDescription>
              Save this email template for future use
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="save-name">Template Name</Label>
              <Input
                id="save-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Welcome Email"
              />
            </div>
            <div>
              <Label htmlFor="save-subject">Email Subject</Label>
              <Input
                id="save-subject"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                placeholder="e.g., Welcome to Valasys"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplate}
              className="bg-valasys-orange hover:bg-valasys-orange/90 text-white"
            >
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </DndProvider>
    </DashboardLayout>
  );
};
