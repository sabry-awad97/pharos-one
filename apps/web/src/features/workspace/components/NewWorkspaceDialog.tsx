/**
 * NewWorkspaceDialog component
 * Modal for creating new workspace tabs from templates
 */

import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@pharos-one/ui/components/dialog";
import { Button } from "@pharos-one/ui/components/button";
import { Input } from "@pharos-one/ui/components/input";
import {
  WORKSPACE_TEMPLATES,
  type WorkspaceTemplate,
} from "../constants/workspace-templates";

export interface NewWorkspaceDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Handler for dialog close */
  onOpenChange: (open: boolean) => void;
  /** Handler for template selection */
  onSelectTemplate: (template: WorkspaceTemplate) => void;
}

/**
 * Dialog for creating new workspace tabs
 * Shows 6 workspace templates in grid layout with custom name input option
 */
export function NewWorkspaceDialog({
  open,
  onOpenChange,
  onSelectTemplate,
}: NewWorkspaceDialogProps) {
  const [customName, setCustomName] = useState("");

  const handleTemplateClick = (template: WorkspaceTemplate) => {
    onSelectTemplate(template);
    setCustomName("");
  };

  const handleCustomOpen = () => {
    if (customName.trim()) {
      // For custom workspace, use dashboard as default template
      const defaultTemplate = WORKSPACE_TEMPLATES[0];
      onSelectTemplate({
        ...defaultTemplate,
        label: customName.trim(),
      });
      setCustomName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <DialogTitle>New Workspace</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2.5">
              Choose Workspace Type
            </p>
            <div className="grid grid-cols-3 gap-2">
              {WORKSPACE_TEMPLATES.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className="p-3.5 border-[1.5px] border-border rounded-md cursor-pointer transition-all bg-background hover:border-primary hover:bg-accent/30 text-left"
                  >
                    <div className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-semibold text-foreground mb-0.5">
                      {template.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      {template.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 border border-border rounded-md bg-muted/30 flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Or enter workspace name / load from session…"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCustomOpen();
                }
              }}
              className="flex-1 border-0 bg-transparent text-xs h-7 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              size="sm"
              onClick={handleCustomOpen}
              disabled={!customName.trim()}
              className="h-7 px-3 text-[11px]"
            >
              Open
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
