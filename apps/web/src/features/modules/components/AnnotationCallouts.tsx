/**
 * AnnotationCallouts component
 * Displays informational cards about tab features
 * Matches PharmacyTabs.tsx annotation callouts (lines 2177-2250)
 */

import {
  Layers,
  AlertTriangle,
  SplitSquareHorizontal,
  Layout,
} from "lucide-react";

// Color constants matching old implementation
const W = {
  surface: "#ffffff",
  border: "#e0e0e0",
  accent: "#0078d4",
  accentLight: "#cce4f7",
  text: "#1a1a1a",
  textSub: "#616161",
};

const CALLOUTS = [
  {
    title: "Tab Switching",
    desc: "Click any tab to switch workspace. State is preserved per tab.",
    icon: Layers,
  },
  {
    title: "Unsaved Indicator",
    desc: "Blue dot appears on tab when workspace has unsaved changes.",
    icon: AlertTriangle,
  },
  {
    title: "Split View",
    desc: "Use Ctrl+\\ or the split icon to view two workspaces side-by-side.",
    icon: SplitSquareHorizontal,
  },
  {
    title: "Right-Click Menu",
    desc: "Right-click any tab for Pin, Duplicate, Close, and split options.",
    icon: Layout,
  },
];

/**
 * Annotation callouts showing feature information
 * Only shown when not in split view
 */
export function AnnotationCallouts() {
  return (
    <div
      style={{
        marginTop: 12,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
      }}
    >
      {CALLOUTS.map(({ title, desc, icon: Icon }) => (
        <div
          key={title}
          style={{
            padding: "8px 10px",
            background: W.surface,
            border: `1px solid ${W.border}`,
            borderRadius: 6,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              background: W.accentLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon style={{ width: 12, height: 12, color: W.accent }} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 600,
                color: W.text,
              }}
            >
              {title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                color: W.textSub,
                lineHeight: 1.4,
              }}
            >
              {desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
