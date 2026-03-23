/**
 * CopyWrapper Component
 * Generic wrapper that adds copy-to-clipboard functionality to any content
 *
 * ARCHITECTURE: Composable wrapper with hover-triggered copy button
 * - Uses framer-motion for smooth animations
 * - Icon morphs from Copy to Check with animation
 * - Tooltip feedback on copy
 * - Uses useCopyToClipboard hook
 * - Theme variables for all colors
 *
 * DESIGN: Professional, subtle interaction
 * - Copy button appears on hover
 * - Smooth fade-in animation
 * - Icon transition with scale effect
 * - Success feedback with checkmark
 *
 * USAGE:
 * ```typescript
 * <CopyWrapper value="Text to copy">
 *   <span>Hoverable content</span>
 * </CopyWrapper>
 * ```
 */

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@pharos-one/ui/lib/utils";

/**
 * Props for CopyWrapper component
 */
export interface CopyWrapperProps {
  /**
   * The text value to copy to clipboard
   */
  value: string;

  /**
   * Content to wrap (will show copy button on hover)
   */
  children: React.ReactNode;

  /**
   * Optional className for the wrapper
   */
  className?: string;

  /**
   * Optional className for the copy button
   */
  buttonClassName?: string;

  /**
   * Button size (default: "sm")
   */
  size?: "xs" | "sm" | "md";

  /**
   * Position of the copy button (default: "right")
   */
  position?: "right" | "left";
}

/**
 * Size configurations for the copy button
 */
const sizeConfig = {
  xs: {
    button: "w-4 h-4",
    icon: "w-2.5 h-2.5",
  },
  sm: {
    button: "w-5 h-5",
    icon: "w-3 h-3",
  },
  md: {
    button: "w-6 h-6",
    icon: "w-3.5 h-3.5",
  },
};

/**
 * Generic copy wrapper component
 *
 * Features:
 * - Hover to reveal copy button
 * - Smooth fade-in/out animations
 * - Icon morphs from Copy to Check
 * - Scale animation on copy
 * - Auto-hides after 2 seconds
 * - Accessible with aria labels
 * - Theme variables for colors
 *
 * @example
 * ```typescript
 * <CopyWrapper value="Product Name">
 *   <span className="font-medium">Product Name</span>
 * </CopyWrapper>
 * ```
 */
export function CopyWrapper({
  value,
  children,
  className,
  buttonClassName,
  size = "sm",
  position = "right",
}: CopyWrapperProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copy(value);
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn("relative inline-flex items-center gap-1.5", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {position === "left" && (
        <AnimatePresence>
          {(isHovered || copied) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={handleCopy}
              className={cn(
                "flex items-center justify-center rounded border border-transparent transition-colors",
                copied
                  ? "text-primary bg-primary/10 border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border",
                config.button,
                buttonClassName,
              )}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Check className={config.icon} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Copy className={config.icon} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {children}

      {position === "right" && (
        <AnimatePresence>
          {(isHovered || copied) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: 4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={handleCopy}
              className={cn(
                "flex items-center justify-center rounded border border-transparent transition-colors",
                copied
                  ? "text-primary bg-primary/10 border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border",
                config.button,
                buttonClassName,
              )}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Check className={config.icon} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Copy className={config.icon} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
