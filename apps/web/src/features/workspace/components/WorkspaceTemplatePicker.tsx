/**
 * WorkspaceTemplatePicker component
 * Modal for selecting a workspace template
 */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@pharos-one/ui/components/dialog";
import { Button } from "@pharos-one/ui/components/button";
import { Checkbox } from "@pharos-one/ui/components/checkbox";
import { Badge } from "@pharos-one/ui/components/badge";
import { Layers } from "lucide-react";
import { WORKSPACE_TEMPLATES } from "../constants/workspace-templates";
import type { WorkspaceTemplate } from "../constants/workspace-templates";

export interface WorkspaceTemplatePickerProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when a template is selected */
  onSelect: (templateId: string) => void;
  /** Callback when skip button is clicked */
  onSkip: () => void;
  /** Whether "don't show again" is checked */
  dontShowAgain: boolean;
  /** Callback when "don't show again" checkbox changes */
  onDontShowAgainChange: (checked: boolean) => void;
}

/**
 * Workspace template picker modal
 * Shows a grid of template cards for quick workspace setup
 */
export const WorkspaceTemplatePicker = React.forwardRef<
  HTMLDivElement,
  WorkspaceTemplatePickerProps
>(({ open, onSelect, onSkip, dontShowAgain, onDontShowAgainChange }, ref) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkip()}>
      <DialogContent className="sm:max-w-[720px]" ref={ref}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <DialogTitle>Choose a workspace template</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Select a template to quickly set up your workspace with commonly
            used tabs
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2.5">
              Workspace Templates
            </p>
            <div className="grid grid-cols-2 gap-3">
              {WORKSPACE_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => onSelect(template.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {/* Don't show again checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(checked) =>
                onDontShowAgainChange(checked === true)
              }
              data-testid="dont-show-again-checkbox"
            />
            <label
              htmlFor="dont-show-again"
              className="text-xs text-muted-foreground cursor-pointer select-none"
            >
              Don't show this again
            </label>
          </div>

          {/* Action buttons */}
          <Button
            variant="outline"
            onClick={onSkip}
            data-testid="skip-button"
            className="text-xs"
          >
            Skip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
WorkspaceTemplatePicker.displayName = "WorkspaceTemplatePicker";

/**
 * Template card component
 */
interface TemplateCardProps {
  template: WorkspaceTemplate;
  onSelect: () => void;
}

const TemplateCard = React.forwardRef<HTMLButtonElement, TemplateCardProps>(
  ({ template, onSelect }, ref) => {
    const Icon = template.icon;

    return (
      <button
        ref={ref}
        onClick={onSelect}
        data-testid={`template-card-${template.id}`}
        className="p-3.5 border-[1.5px] border-border rounded-md cursor-pointer transition-all bg-background hover:border-primary hover:bg-accent/30 text-left"
      >
        {/* Icon and Title */}
        <div className="flex items-start gap-3 mb-2">
          <div className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground mb-0.5">
              {template.label}
            </p>
            <p className="text-[10px] text-muted-foreground leading-snug">
              {template.description}
            </p>
          </div>
        </div>

        {/* Tab preview - horizontal badges */}
        {template.tabs.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">
              Includes
            </p>
            <div className="flex flex-wrap gap-1">
              {template.tabs.map((tab, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-5 font-normal"
                >
                  {tab.label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for custom template */}
        {template.tabs.length === 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-[10px] text-muted-foreground italic">
              Build your own workspace
            </p>
          </div>
        )}
      </button>
    );
  },
);
TemplateCard.displayName = "TemplateCard";
