import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  Truck,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  FileText,
  FolderOpen,
  Save,
  Printer,
  LogOut,
  Pin,
  PinOff,
  Copy,
  Columns,
  Pill,
  Search,
  Bell,
  User,
  Settings,
  RotateCcw,
  Maximize2,
  Minus,
  Square,
  ArrowRight,
  Clock,
  Star,
  Home,
  Zap,
  AlertTriangle,
  Hash,
  Shield,
  RefreshCw,
  Download,
  Filter,
  Edit2,
  Trash2,
  Check,
  Layers,
  SplitSquareHorizontal,
  Layout,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Tab {
  id: string;
  label: string;
  icon: any;
  module: string;
  unsaved: boolean;
  pinned: boolean;
  color: string;
}

interface RecentWorkspace {
  id: string;
  label: string;
  icon: any;
  time: string;
  branch: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const W = {
  bg: "#f3f3f3",
  surface: "#ffffff",
  surfaceAlt: "#f9f9f9",
  surfaceHov: "#f0f0f0",
  border: "#e0e0e0",
  borderLight: "#ebebeb",
  accent: "#0078d4",
  accentHover: "#106ebe",
  accentLight: "#cce4f7",
  accentMid: "#0067bb",
  text: "#1a1a1a",
  textSub: "#616161",
  textMuted: "#919191",
  success: "#107c10",
  danger: "#a4262c",
  warn: "#7a5e00",
  tabActive: "#ffffff",
  tabInactive: "#ececec",
  tabHov: "#f5f5f5",
  menuBg: "#ffffff",
  menuBorder: "#d1d1d1",
  menuShadow: "0 4px 16px rgba(0,0,0,.14), 0 1px 4px rgba(0,0,0,.1)",
};

const seg: React.CSSProperties = {
  fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
};

const INITIAL_TABS: Tab[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    module: "dashboard",
    unsaved: false,
    pinned: false,
    color: "#0078d4",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    module: "inventory",
    unsaved: false,
    pinned: true,
    color: "#107c10",
  },
  {
    id: "pos-t1",
    label: "POS – Terminal 1",
    icon: ShoppingCart,
    module: "pos",
    unsaved: false,
    pinned: false,
    color: "#6b69d6",
  },
  {
    id: "pos-t2",
    label: "POS – Terminal 2",
    icon: ShoppingCart,
    module: "pos",
    unsaved: true,
    pinned: false,
    color: "#6b69d6",
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart2,
    module: "reports",
    unsaved: false,
    pinned: false,
    color: "#c43501",
  },
  {
    id: "purchases",
    label: "Purchase Orders",
    icon: Truck,
    module: "purchases",
    unsaved: false,
    pinned: false,
    color: "#b8860b",
  },
];

const RECENT_WORKSPACES: RecentWorkspace[] = [
  {
    id: "r1",
    label: "Inventory – March",
    icon: Package,
    time: "10 min ago",
    branch: "Main Store",
  },
  {
    id: "r2",
    label: "Sale Session #840",
    icon: ShoppingCart,
    time: "32 min ago",
    branch: "Terminal 1",
  },
  {
    id: "r3",
    label: "Monthly Report Q1",
    icon: BarChart2,
    time: "Yesterday",
    branch: "Finance",
  },
  {
    id: "r4",
    label: "Supplier – MedSupply",
    icon: Truck,
    time: "2 days ago",
    branch: "Procurement",
  },
];

const WORKSPACE_TEMPLATES = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    desc: "Overview, KPIs and alerts",
  },
  {
    id: "inventory",
    icon: Package,
    label: "Inventory",
    desc: "Drug catalog and stock levels",
  },
  {
    id: "pos",
    icon: ShoppingCart,
    label: "Point of Sale",
    desc: "New checkout terminal session",
  },
  {
    id: "reports",
    icon: BarChart2,
    label: "Reports",
    desc: "Analytics, charts and exports",
  },
  {
    id: "purchases",
    icon: Truck,
    label: "Purchase Orders",
    desc: "Supplier orders and receipts",
  },
  {
    id: "customers",
    icon: User,
    label: "Customers",
    desc: "Patient profiles and loyalty",
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────────
export function PharmacyTabs() {
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS);
  const [activeId, setActiveId] = useState("dashboard");
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [newWsOpen, setNewWsOpen] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{
    tabId: string;
    x: number;
    y: number;
  } | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [activeMenuBar, setActiveMenuBar] = useState<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  // How many tabs fit before overflow (show at most 5 in bar, rest in overflow)
  const VISIBLE_COUNT = 5;
  const visibleTabs = tabs.slice(0, VISIBLE_COUNT);
  const overflowTabs = tabs.slice(VISIBLE_COUNT);

  const closeTab = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeId === id && remaining.length > 0)
      setActiveId(remaining[remaining.length - 1].id);
    setCtxMenu(null);
  };

  const togglePin = (id: string) => {
    setTabs(tabs.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));
    setCtxMenu(null);
  };

  const duplicateTab = (id: string) => {
    const src = tabs.find((t) => t.id === id);
    if (!src) return;
    const newTab: Tab = {
      ...src,
      id: src.id + "-" + Date.now(),
      label: src.label + " (copy)",
      unsaved: false,
      pinned: false,
    };
    setTabs([...tabs, newTab]);
    setActiveId(newTab.id);
    setCtxMenu(null);
  };

  const addTab = (template: (typeof WORKSPACE_TEMPLATES)[0]) => {
    const newTab: Tab = {
      id: template.id + "-" + Date.now(),
      label: template.label,
      icon: template.icon,
      module: template.id,
      unsaved: false,
      pinned: false,
      color: "#0078d4",
    };
    setTabs([...tabs, newTab]);
    setActiveId(newTab.id);
    setNewWsOpen(false);
  };

  const closeAll = () => {
    closeAnyMenu();
  };
  const closeAnyMenu = () => {
    setFileMenuOpen(false);
    setRecentOpen(false);
    setCtxMenu(null);
    setOverflowOpen(false);
    setActiveMenuBar(null);
  };

  return (
    <div
      style={{
        ...seg,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        background: W.bg,
        color: W.text,
        fontSize: 12,
        userSelect: "none",
        overflow: "hidden",
      }}
      onClick={closeAnyMenu}
    >
      {/* ══ TITLE BAR ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          height: 32,
          background: "#f0f0f0",
          borderBottom: `1px solid #d1d1d1`,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 12px",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 3,
              background: W.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pill style={{ width: 10, height: 10, color: "white" }} />
          </div>
          <span style={{ fontSize: 12, color: "#333" }}>PharmOS</span>
        </div>
        {/* Quick-access toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginLeft: 8,
          }}
        >
          {[
            { icon: Save, t: "Save (Ctrl+S)" },
            { icon: RotateCcw, t: "Undo" },
            { icon: RefreshCw, t: "Refresh" },
          ].map(({ icon: Icon, t }, i) => (
            <button
              key={i}
              title={t}
              style={qaBtn}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#e5e5e5")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "transparent")
              }
            >
              <Icon style={{ width: 11, height: 11 }} />
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        {/* Window controls */}
        {[{ icon: Minus }, { icon: Square }, { icon: X }].map(
          ({ icon: Icon }, i) => (
            <button
              key={i}
              style={
                { ...winBtn, "--hbg": i === 2 ? "#c42b1c" : "#e5e5e5" } as any
              }
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  i === 2 ? "#c42b1c" : "#e5e5e5";
                if (i === 2)
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#333";
              }}
            >
              <Icon style={{ width: 10, height: 10 }} />
            </button>
          ),
        )}
      </div>

      {/* ══ MENU BAR ═══════════════════════════════════════════════════════════ */}
      <div
        style={{
          height: 26,
          background: "#f8f8f8",
          borderBottom: `1px solid #e0e0e0`,
          display: "flex",
          alignItems: "center",
          padding: "0 4px",
          flexShrink: 0,
          gap: 1,
          position: "relative",
          zIndex: 200,
        }}
      >
        {/* FILE menu trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFileMenuOpen(!fileMenuOpen);
            setActiveMenuBar(fileMenuOpen ? null : "file");
            setRecentOpen(false);
          }}
          style={{
            ...menuBarItem,
            background: fileMenuOpen ? W.accent : "transparent",
            color: fileMenuOpen ? "white" : W.text,
          }}
          onMouseEnter={(e) => {
            if (!fileMenuOpen)
              (e.currentTarget as HTMLButtonElement).style.background =
                W.surfaceHov;
          }}
          onMouseLeave={(e) => {
            if (!fileMenuOpen)
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
          }}
        >
          File
        </button>
        {["Edit", "View", "Workspace", "Tools", "Help"].map((m) => (
          <button
            key={m}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuBar(
                activeMenuBar === m.toLowerCase() ? null : m.toLowerCase(),
              );
              setFileMenuOpen(false);
            }}
            style={{
              ...menuBarItem,
              background:
                activeMenuBar === m.toLowerCase()
                  ? W.surfaceHov
                  : "transparent",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                W.surfaceHov)
            }
            onMouseLeave={(e) => {
              if (activeMenuBar !== m.toLowerCase())
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
            }}
          >
            {m}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            paddingRight: 8,
            color: W.textMuted,
            fontSize: 11,
          }}
        >
          <span>Main Branch</span>
          <span style={{ width: 1, height: 12, background: W.border }} />
          <span>Cashier: Dr. Ravi K.</span>
          <span style={{ width: 1, height: 12, background: W.border }} />
          <Clock style={{ width: 11, height: 11 }} />
          <span>Shift 2 · 14:35</span>
        </div>

        {/* ── FILE MENU DROPDOWN ─────────────────────────────────────────── */}
        {fileMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: 280,
              background: W.menuBg,
              border: `1px solid ${W.menuBorder}`,
              boxShadow: W.menuShadow,
              zIndex: 300,
              borderRadius: "0 0 6px 6px",
              overflow: "visible",
            }}
          >
            {/* App header stripe */}
            <div
              style={{
                background: W.accent,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(255,255,255,.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pill style={{ width: 16, height: 16, color: "white" }} />
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  PharmOS
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: "rgba(255,255,255,.75)",
                  }}
                >
                  Pharmacy Management Suite v2.4
                </p>
              </div>
            </div>

            {/* Menu items */}
            <div style={{ padding: "4px 0" }}>
              <MenuItem
                icon={Plus}
                label="New Workspace"
                kbd="Ctrl+T"
                accent
                onClick={() => {
                  setFileMenuOpen(false);
                  setNewWsOpen(true);
                }}
              />
              <MenuItem
                icon={FolderOpen}
                label="Open Workspace…"
                kbd="Ctrl+O"
                onClick={closeAnyMenu}
              />
              <MenuDivider />

              {/* Recent Workspaces with submenu */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setRecentOpen(true)}
                onMouseLeave={() => setRecentOpen(false)}
              >
                <MenuItem icon={Clock} label="Recent Workspaces" arrow />
                {recentOpen && (
                  <div
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: 0,
                      width: 260,
                      background: W.menuBg,
                      border: `1px solid ${W.menuBorder}`,
                      boxShadow: W.menuShadow,
                      borderRadius: 6,
                      padding: "4px 0",
                      zIndex: 400,
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 12px 6px",
                        borderBottom: `1px solid ${W.borderLight}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          color: W.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          fontWeight: 600,
                        }}
                      >
                        Recently Opened
                      </span>
                    </div>
                    {RECENT_WORKSPACES.map((r) => {
                      const Icon = r.icon;
                      return (
                        <div
                          key={r.id}
                          onClick={closeAnyMenu}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "7px 12px",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) =>
                            ((
                              e.currentTarget as HTMLDivElement
                            ).style.background = W.surfaceHov)
                          }
                          onMouseLeave={(e) =>
                            ((
                              e.currentTarget as HTMLDivElement
                            ).style.background = "transparent")
                          }
                        >
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 4,
                              background: W.accentLight,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Icon
                              style={{ width: 13, height: 13, color: W.accent }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 12,
                                fontWeight: 500,
                                color: W.text,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {r.label}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 10,
                                color: W.textMuted,
                              }}
                            >
                              {r.branch} · {r.time}
                            </p>
                          </div>
                          <ArrowRight
                            style={{
                              width: 11,
                              height: 11,
                              color: W.textMuted,
                              flexShrink: 0,
                            }}
                          />
                        </div>
                      );
                    })}
                    <div
                      style={{
                        borderTop: `1px solid ${W.borderLight}`,
                        padding: "5px 12px",
                      }}
                    >
                      <button
                        onClick={closeAnyMenu}
                        style={{
                          fontSize: 11,
                          color: W.accent,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        View all workspaces →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <MenuDivider />
              <MenuItem
                icon={Pin}
                label="Pin Active Tab"
                kbd="Ctrl+P"
                onClick={() => {
                  togglePin(activeId);
                  setFileMenuOpen(false);
                }}
              />
              <MenuItem
                icon={Copy}
                label="Duplicate Tab"
                kbd="Ctrl+D"
                onClick={() => {
                  duplicateTab(activeId);
                  setFileMenuOpen(false);
                }}
              />
              <MenuItem
                icon={SplitSquareHorizontal}
                label="Split View"
                kbd="Ctrl+\\"
                onClick={() => {
                  setSplitView(!splitView);
                  setFileMenuOpen(false);
                }}
              />
              <MenuDivider />
              <MenuItem
                icon={Save}
                label="Save Session"
                kbd="Ctrl+S"
                onClick={closeAnyMenu}
              />
              <MenuItem
                icon={Download}
                label="Export Workspace"
                kbd=""
                onClick={closeAnyMenu}
              />
              <MenuItem
                icon={Printer}
                label="Print"
                kbd="Ctrl+P"
                onClick={closeAnyMenu}
              />
              <MenuDivider />
              <MenuItem
                icon={X}
                label="Close Tab"
                kbd="Ctrl+W"
                danger
                onClick={() => {
                  closeTab(activeId);
                  setFileMenuOpen(false);
                }}
              />
              <MenuItem
                icon={LogOut}
                label="Exit PharmOS"
                kbd="Alt+F4"
                danger
                onClick={closeAnyMenu}
              />
            </div>
          </div>
        )}
      </div>

      {/* ══ TAB BAR ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          height: 36,
          background: "#f0f0f0",
          borderBottom: `1px solid ${W.border}`,
          display: "flex",
          alignItems: "flex-end",
          flexShrink: 0,
          overflow: "hidden",
          position: "relative",
          zIndex: 100,
        }}
      >
        {/* Pinned tabs group indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: "100%",
            borderRight: `1px solid ${W.border}`,
            paddingRight: 2,
          }}
        >
          {tabs
            .filter((t) => t.pinned)
            .map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                active={activeId === tab.id}
                pinned
                onClick={() => {
                  setActiveId(tab.id);
                  closeAnyMenu();
                }}
                onClose={(e) => closeTab(tab.id, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCtxMenu({ tabId: tab.id, x: e.clientX, y: e.clientY });
                }}
              />
            ))}
        </div>

        {/* Regular tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: "100%",
            flex: 1,
            overflow: "hidden",
          }}
        >
          {visibleTabs
            .filter((t) => !t.pinned)
            .map((tab) => (
              <TabItem
                key={tab.id}
                tab={tab}
                active={activeId === tab.id}
                onClick={() => {
                  setActiveId(tab.id);
                  closeAnyMenu();
                }}
                onClose={(e) => closeTab(tab.id, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCtxMenu({ tabId: tab.id, x: e.clientX, y: e.clientY });
                }}
              />
            ))}
        </div>

        {/* Overflow indicator */}
        {overflowTabs.length > 0 && (
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "0 4px",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOverflowOpen(!overflowOpen);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                height: 26,
                padding: "0 8px",
                borderRadius: 4,
                border: `1px solid ${W.border}`,
                background: overflowOpen ? W.surface : W.surfaceHov,
                color: W.textSub,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              <MoreHorizontal style={{ width: 13, height: 13 }} />
              <span
                style={{
                  fontSize: 10,
                  background: W.accent,
                  color: "white",
                  padding: "1px 5px",
                  borderRadius: 10,
                  fontWeight: 600,
                }}
              >
                {overflowTabs.length}
              </span>
            </button>
            {overflowOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  right: 0,
                  width: 220,
                  background: W.menuBg,
                  border: `1px solid ${W.menuBorder}`,
                  boxShadow: W.menuShadow,
                  borderRadius: 6,
                  padding: "4px 0",
                  zIndex: 300,
                }}
              >
                <div
                  style={{
                    padding: "4px 10px 6px",
                    borderBottom: `1px solid ${W.borderLight}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: W.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      fontWeight: 600,
                    }}
                  >
                    More Tabs
                  </span>
                </div>
                {overflowTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <div
                      key={tab.id}
                      onClick={() => {
                        setActiveId(tab.id);
                        setOverflowOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background =
                          W.surfaceHov)
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background =
                          "transparent")
                      }
                    >
                      <Icon
                        style={{
                          width: 13,
                          height: 13,
                          color: tab.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: W.text,
                        }}
                      >
                        {tab.label}
                      </span>
                      {tab.unsaved && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: W.accent,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <button
                        onClick={(e) => closeTab(tab.id, e)}
                        style={{
                          padding: 2,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: W.textMuted,
                          display: "flex",
                        }}
                      >
                        <X style={{ width: 11, height: 11 }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* New Tab button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setNewWsOpen(true);
            closeAnyMenu();
          }}
          title="New Workspace (Ctrl+T)"
          style={{
            width: 32,
            height: 32,
            marginBottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: 4,
            background: "transparent",
            color: W.textSub,
            cursor: "pointer",
            flexShrink: 0,
            alignSelf: "center",
            marginRight: 6,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = W.border;
            (e.currentTarget as HTMLButtonElement).style.color = W.text;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = W.textSub;
          }}
        >
          <Plus style={{ width: 14, height: 14 }} />
        </button>

        {/* Split view toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSplitView(!splitView);
          }}
          title="Split View (Ctrl+\\)"
          style={{
            width: 28,
            height: 28,
            marginRight: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${splitView ? W.accent : W.border}`,
            borderRadius: 4,
            background: splitView ? W.accentLight : "transparent",
            color: splitView ? W.accent : W.textMuted,
            cursor: "pointer",
            flexShrink: 0,
            alignSelf: "center",
          }}
          onMouseEnter={(e) => {
            if (!splitView)
              (e.currentTarget as HTMLButtonElement).style.background =
                W.surfaceHov;
          }}
          onMouseLeave={(e) => {
            if (!splitView)
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
          }}
        >
          <SplitSquareHorizontal style={{ width: 13, height: 13 }} />
        </button>
      </div>

      {/* ══ RIBBON ══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          height: 44,
          background: W.surface,
          borderBottom: `1px solid ${W.border}`,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 12px",
          flexShrink: 0,
        }}
      >
        {activeTab &&
          (() => {
            const Icon = activeTab.icon;
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingRight: 12,
                    borderRight: `1px solid ${W.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: activeTab.color + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      style={{ width: 12, height: 12, color: activeTab.color }}
                    />
                  </div>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: W.text }}
                  >
                    {activeTab.label}
                  </span>
                  {activeTab.unsaved && (
                    <span
                      style={{
                        fontSize: 10,
                        color: W.accent,
                        background: W.accentLight,
                        padding: "1px 6px",
                        borderRadius: 10,
                        fontWeight: 500,
                      }}
                    >
                      ● Unsaved
                    </span>
                  )}
                  {activeTab.pinned && (
                    <span
                      style={{
                        fontSize: 10,
                        color: "#b8860b",
                        background: "#fff4ce",
                        padding: "1px 6px",
                        borderRadius: 10,
                        fontWeight: 500,
                      }}
                    >
                      📌 Pinned
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {getModuleActions(activeTab.module).map(
                    ({ icon: BIcon, label }) => (
                      <button
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          height: 28,
                          padding: "0 10px",
                          borderRadius: 4,
                          border: `1px solid transparent`,
                          background: "transparent",
                          color: W.textSub,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = W.surfaceHov;
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = W.border;
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "transparent";
                        }}
                      >
                        <BIcon style={{ width: 13, height: 13 }} />
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </>
            );
          })()}
        <div style={{ flex: 1 }} />
        {/* Search + user */}
        <div style={{ position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 13,
              height: 13,
              color: W.textMuted,
            }}
          />
          <input
            placeholder="Search modules…"
            style={{
              width: 180,
              height: 28,
              paddingLeft: 28,
              fontSize: 11,
              border: `1px solid ${W.border}`,
              borderRadius: 4,
              background: W.surfaceAlt,
              color: W.text,
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = W.accent)}
            onBlur={(e) => (e.target.style.borderColor = W.border)}
          />
        </div>
        <button
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: 4,
            background: "transparent",
            cursor: "pointer",
            color: W.textMuted,
            position: "relative",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              W.surfaceHov)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "transparent")
          }
        >
          <Bell style={{ width: 15, height: 15 }} />
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 7,
              height: 7,
              background: "#c42b1c",
              borderRadius: "50%",
              border: "1.5px solid white",
            }}
          />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            padding: "2px 8px",
            borderRadius: 4,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              W.surfaceHov)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              "transparent")
          }
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#0078d4,#6b69d6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              color: "white",
            }}
          >
            RK
          </div>
          <span style={{ fontSize: 11, color: W.textSub }}>Dr. Ravi K.</span>
          <ChevronDown style={{ width: 12, height: 12, color: W.textMuted }} />
        </div>
      </div>

      {/* ══ CONTENT AREA ════════════════════════════════════════════════════════ */}
      <div
        style={{ flex: 1, display: "flex", minHeight: 0, overflow: "hidden" }}
      >
        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          <WorkspaceContent
            module={activeTab?.module ?? "dashboard"}
            label={activeTab?.label ?? ""}
            color={activeTab?.color ?? W.accent}
          />
          {splitView && (
            <>
              <div style={{ width: 1, background: W.border, flexShrink: 0 }} />
              <WorkspaceContent
                module="inventory"
                label="Inventory"
                color="#107c10"
                split
              />
            </>
          )}
        </div>
      </div>

      {/* ══ STATUS BAR ════════════════════════════════════════════════════════ */}
      <div
        style={{
          height: 22,
          background: W.accent,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 16,
          flexShrink: 0,
        }}
      >
        {[
          { l: "Tabs Open", v: tabs.length },
          { l: "Pinned", v: tabs.filter((t) => t.pinned).length },
          { l: "Unsaved", v: tabs.filter((t) => t.unsaved).length },
        ].map(({ l, v }) => (
          <span
            key={l}
            style={{ fontSize: 10, color: "rgba(255,255,255,.85)" }}
          >
            <b style={{ color: "white" }}>{l}:</b> {v}
          </span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>
          Ctrl+T New · Ctrl+W Close · Ctrl+Tab Switch · Ctrl+\\ Split
        </span>
      </div>

      {/* ══ TAB CONTEXT MENU ════════════════════════════════════════════════════ */}
      {ctxMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            left: ctxMenu.x,
            top: ctxMenu.y,
            width: 220,
            background: W.menuBg,
            border: `1px solid ${W.menuBorder}`,
            boxShadow: W.menuShadow,
            borderRadius: 6,
            padding: "4px 0",
            zIndex: 500,
          }}
        >
          {(() => {
            const t = tabs.find((x) => x.id === ctxMenu.tabId);
            if (!t) return null;
            const Icon = t.icon;
            return (
              <>
                <div
                  style={{
                    padding: "6px 12px 8px",
                    borderBottom: `1px solid ${W.borderLight}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Icon style={{ width: 14, height: 14, color: t.color }} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: W.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {t.label}
                  </span>
                </div>
                <CtxItem
                  icon={Copy}
                  label="Duplicate Tab"
                  onClick={() => duplicateTab(t.id)}
                />
                <CtxItem
                  icon={t.pinned ? PinOff : Pin}
                  label={t.pinned ? "Unpin Tab" : "Pin Tab"}
                  onClick={() => togglePin(t.id)}
                />
                <CtxItem
                  icon={SplitSquareHorizontal}
                  label="Open in Split View"
                  onClick={() => {
                    setSplitView(true);
                    setCtxMenu(null);
                  }}
                />
                <div
                  style={{
                    height: 1,
                    background: W.borderLight,
                    margin: "3px 0",
                  }}
                />
                <CtxItem
                  icon={X}
                  label="Close Tab"
                  kbd="Ctrl+W"
                  danger
                  onClick={() => closeTab(t.id)}
                />
                <CtxItem
                  icon={Layers}
                  label="Close Other Tabs"
                  danger
                  onClick={() => {
                    setTabs(tabs.filter((x) => x.id === t.id));
                    setActiveId(t.id);
                    setCtxMenu(null);
                  }}
                />
                <CtxItem
                  icon={ChevronRight}
                  label="Close Tabs to Right"
                  danger
                  onClick={() => {
                    const i = tabs.findIndex((x) => x.id === t.id);
                    setTabs(tabs.slice(0, i + 1));
                    setCtxMenu(null);
                  }}
                />
              </>
            );
          })()}
        </div>
      )}

      {/* ══ NEW WORKSPACE DIALOG ════════════════════════════════════════════════ */}
      {newWsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 600,
          }}
          onClick={() => setNewWsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 580,
              background: W.surface,
              borderRadius: 8,
              boxShadow: "0 8px 32px rgba(0,0,0,.2)",
              border: `1px solid ${W.border}`,
              overflow: "hidden",
            }}
          >
            {/* Dialog header */}
            <div
              style={{
                height: 42,
                background: "#f0f0f0",
                borderBottom: `1px solid ${W.border}`,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                gap: 10,
              }}
            >
              <Plus style={{ width: 15, height: 15, color: W.accent }} />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: W.text,
                  flex: 1,
                }}
              >
                New Workspace
              </span>
              <button
                onClick={() => setNewWsOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  borderRadius: 4,
                  background: "transparent",
                  cursor: "pointer",
                  color: W.textMuted,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#fde7e9";
                  (e.currentTarget as HTMLButtonElement).style.color = W.danger;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    W.textMuted;
                }}
              >
                <X style={{ width: 13, height: 13 }} />
              </button>
            </div>
            <div style={{ padding: "16px" }}>
              <p
                style={{
                  fontSize: 11,
                  color: W.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontWeight: 600,
                  margin: "0 0 10px",
                }}
              >
                Choose Workspace Type
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {WORKSPACE_TEMPLATES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.id}
                      onClick={() => addTab(t)}
                      style={{
                        padding: "14px",
                        border: `1.5px solid ${W.border}`,
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all .1s",
                        background: W.surface,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          W.accent;
                        (e.currentTarget as HTMLDivElement).style.background =
                          W.accentLight;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          W.border;
                        (e.currentTarget as HTMLDivElement).style.background =
                          W.surface;
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          background: W.accentLight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Icon
                          style={{ width: 17, height: 17, color: W.accent }}
                        />
                      </div>
                      <p
                        style={{
                          margin: "0 0 3px",
                          fontSize: 12,
                          fontWeight: 600,
                          color: W.text,
                        }}
                      >
                        {t.label}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 10,
                          color: W.textSub,
                          lineHeight: 1.4,
                        }}
                      >
                        {t.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 12px",
                  border: `1px solid ${W.border}`,
                  borderRadius: 6,
                  background: W.surfaceAlt,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FolderOpen
                  style={{ width: 14, height: 14, color: W.textMuted }}
                />
                <input
                  placeholder="Or enter workspace name / load from session…"
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    fontSize: 12,
                    color: W.text,
                    outline: "none",
                  }}
                />
                <button
                  style={{
                    height: 26,
                    padding: "0 12px",
                    background: W.accent,
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 11,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Open
                </button>
              </div>
            </div>
            <div
              style={{
                padding: "10px 16px",
                borderTop: `1px solid ${W.border}`,
                background: W.surfaceAlt,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                onClick={() => setNewWsOpen(false)}
                style={{
                  height: 28,
                  padding: "0 14px",
                  border: `1px solid ${W.border}`,
                  borderRadius: 4,
                  background: W.surface,
                  fontSize: 12,
                  cursor: "pointer",
                  color: W.textSub,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab Item ─────────────────────────────────────────────────────────────────
function TabItem({
  tab,
  active,
  pinned,
  onClick,
  onClose,
  onContextMenu,
}: {
  tab: Tab;
  active: boolean;
  pinned?: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const [hov, setHov] = useState(false);
  const Icon = tab.icon;
  const w = pinned ? 40 : active ? 160 : 140;

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={
        tab.label +
        (tab.unsaved ? " (unsaved)" : "") +
        (tab.pinned ? " (pinned)" : "")
      }
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        height: 36,
        width: pinned ? 40 : undefined,
        minWidth: pinned ? 40 : 120,
        maxWidth: pinned ? 40 : 180,
        padding: pinned ? "0 10px" : "0 10px",
        cursor: "pointer",
        flexShrink: 0,
        background: active ? W.tabActive : hov ? W.tabHov : W.tabInactive,
        borderTop: active ? `2px solid ${tab.color}` : "2px solid transparent",
        borderRight: `1px solid ${W.border}`,
        borderBottom: active
          ? `1px solid ${W.surface}`
          : `1px solid ${W.border}`,
        marginBottom: active ? -1 : 0,
        gap: 6,
        overflow: "hidden",
        transition: "background .1s",
        justifyContent: pinned ? "center" : "flex-start",
      }}
    >
      {/* Drag indicator */}
      {!pinned && hov && !active && (
        <div
          style={{
            position: "absolute",
            left: 3,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            opacity: 0.3,
          }}
        >
          <div
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: W.textMuted,
            }}
          />
          <div
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: W.textMuted,
            }}
          />
          <div
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: W.textMuted,
            }}
          />
        </div>
      )}

      <Icon
        style={{
          width: 13,
          height: 13,
          color: active ? tab.color : W.textSub,
          flexShrink: 0,
        }}
      />

      {!pinned && (
        <span
          style={{
            fontSize: 11,
            fontWeight: active ? 600 : 400,
            color: active ? W.text : W.textSub,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {tab.label}
        </span>
      )}

      {/* Unsaved indicator */}
      {tab.unsaved && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: W.accent,
            flexShrink: 0,
          }}
          title="Unsaved changes"
        />
      )}

      {/* Pin badge */}
      {tab.pinned && !active && (
        <div style={{ position: "absolute", top: 4, right: 4 }}>
          <Pin style={{ width: 8, height: 8, color: W.textMuted }} />
        </div>
      )}

      {/* Close button */}
      {!pinned && (
        <button
          onClick={onClose}
          style={{
            width: 16,
            height: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            borderRadius: 3,
            background: hov || active ? "rgba(0,0,0,.08)" : "transparent",
            cursor: "pointer",
            color: W.textMuted,
            flexShrink: 0,
            padding: 0,
            opacity: hov || active ? 1 : 0,
            transition: "opacity .1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(196,43,28,.15)";
            (e.currentTarget as HTMLButtonElement).style.color = W.danger;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(0,0,0,.08)";
            (e.currentTarget as HTMLButtonElement).style.color = W.textMuted;
          }}
        >
          <X style={{ width: 10, height: 10 }} />
        </button>
      )}
    </div>
  );
}

// ─── Workspace Content ────────────────────────────────────────────────────────
function WorkspaceContent({
  module,
  label,
  color,
  split,
}: {
  module: string;
  label: string;
  color: string;
  split?: boolean;
}) {
  const rows: Record<string, string[][]> = {
    dashboard: [
      ["Today's Sales", "₹14,820", "↑12%"],
      ["Orders", "47", "↑3%"],
      ["Low Stock", "7", "↓"],
      ["Profit", "₹3,940", "↑8%"],
    ],
    inventory: [
      ["Amoxicillin 500mg", "AMX-500", "240", "₹12.50", "In Stock"],
      ["Paracetamol 650mg", "PCT-650", "18", "₹4.20", "Low"],
      ["Metformin 500mg", "MET-500", "302", "₹8.75", "In Stock"],
    ],
    pos: [
      ["Amoxicillin 500mg", "2", "₹12.50", "₹25.00"],
      ["Paracetamol 650mg", "3", "₹4.20", "₹12.60"],
      ["Omeprazole 20mg", "1", "₹15.00", "₹15.00"],
    ],
    reports: [
      ["Revenue – March", "₹4,48,200", "↑18%"],
      ["Gross Profit", "₹1,12,050", "↑11%"],
      ["Top Drug", "Amoxicillin", "—"],
    ],
    purchases: [
      ["PO-2026-0041", "MedSupply Co", "₹28,400", "Pending"],
      ["PO-2026-0040", "PharmGen", "₹11,800", "Received"],
      ["PO-2026-0039", "GeneriCo", "₹9,200", "Received"],
    ],
    customers: [
      ["Priya Nair", "Platinum", "3,890 pts", "Chennai"],
      ["Anjali Sharma", "Gold", "1,240 pts", "Bengaluru"],
      ["Rajesh Kumar", "Silver", "450 pts", "Mumbai"],
    ],
  };
  const colHeaders: Record<string, string[]> = {
    dashboard: ["Metric", "Value", "Change"],
    inventory: ["Drug Name", "SKU", "Stock", "Price", "Status"],
    pos: ["Item", "Qty", "Unit Price", "Total"],
    reports: ["Metric", "Value", "Change"],
    purchases: ["PO Number", "Supplier", "Amount", "Status"],
    customers: ["Name", "Tier", "Loyalty", "Location"],
  };
  const data = rows[module] ?? rows.dashboard;
  const cols = colHeaders[module] ?? colHeaders.dashboard;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: W.bg,
      }}
    >
      {/* Module header */}
      <div
        style={{
          padding: "10px 16px 8px",
          borderBottom: `1px solid ${W.border}`,
          background: W.surface,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: color + "20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Hash style={{ width: 14, height: 14, color: color }} />
        </div>
        <div>
          <p
            style={{ margin: 0, fontSize: 13, fontWeight: 600, color: W.text }}
          >
            {label || "Workspace"}
          </p>
          <p style={{ margin: 0, fontSize: 10, color: W.textMuted }}>
            Last updated: just now
          </p>
        </div>
        <div style={{ flex: 1 }} />
        {!split && (
          <div style={{ display: "flex", gap: 4 }}>
            {[Filter, Download, RefreshCw].map((Icon, i) => (
              <button
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${W.border}`,
                  borderRadius: 4,
                  background: W.surface,
                  cursor: "pointer",
                  color: W.textSub,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.surfaceHov;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    W.surface;
                }}
              >
                <Icon style={{ width: 12, height: 12 }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Data table */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: W.surface,
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: `0 1px 3px rgba(0,0,0,.06)`,
            border: `1px solid ${W.border}`,
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f5f5f5",
                borderBottom: `1px solid ${W.border}`,
              }}
            >
              {cols.map((c) => (
                <th
                  key={c}
                  style={{
                    textAlign: "left",
                    padding: "7px 12px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: W.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${W.borderLight}`,
                  background: i % 2 === 1 ? W.surfaceAlt : W.surface,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background =
                    "#f0f6ff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background =
                    i % 2 === 1 ? W.surfaceAlt : W.surface)
                }
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      color: j === 0 ? W.text : W.textSub,
                      fontWeight: j === 0 ? 500 : 400,
                    }}
                  >
                    {cell.startsWith("↑") ? (
                      <span style={{ color: W.success, fontWeight: 600 }}>
                        {cell}
                      </span>
                    ) : cell.startsWith("↓") ? (
                      <span style={{ color: W.danger, fontWeight: 600 }}>
                        {cell}
                      </span>
                    ) : cell === "In Stock" ? (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 3,
                          background: "#dff6dd",
                          color: W.success,
                          fontWeight: 500,
                        }}
                      >
                        {cell}
                      </span>
                    ) : cell === "Low" ? (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 3,
                          background: "#fff4ce",
                          color: W.warn,
                          fontWeight: 500,
                        }}
                      >
                        {cell}
                      </span>
                    ) : cell === "Pending" ? (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 3,
                          background: "#fff4ce",
                          color: W.warn,
                          fontWeight: 500,
                        }}
                      >
                        {cell}
                      </span>
                    ) : cell === "Received" ? (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 3,
                          background: "#dff6dd",
                          color: W.success,
                          fontWeight: 500,
                        }}
                      >
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Annotation callouts */}
        {!split && (
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {[
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
            ].map(({ title, desc, icon: Icon }) => (
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
        )}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function MenuItem({
  icon: Icon,
  label,
  kbd,
  accent,
  danger,
  arrow,
  onClick,
}: any) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px",
        cursor: "pointer",
        background: hov
          ? danger
            ? "#fde7e9"
            : accent
              ? W.accentLight
              : W.surfaceHov
          : "transparent",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon
          style={{
            width: 14,
            height: 14,
            color: danger ? W.danger : accent ? W.accent : W.textSub,
          }}
        />
      </div>
      <span
        style={{
          flex: 1,
          fontSize: 12,
          color: danger ? W.danger : accent ? W.accent : W.text,
          fontWeight: accent ? 500 : 400,
        }}
      >
        {label}
      </span>
      {kbd && <span style={{ fontSize: 10, color: W.textMuted }}>{kbd}</span>}
      {arrow && (
        <ChevronRight style={{ width: 11, height: 11, color: W.textMuted }} />
      )}
    </div>
  );
}

function MenuDivider() {
  return (
    <div style={{ height: 1, background: W.borderLight, margin: "3px 0" }} />
  );
}

function CtxItem({ icon: Icon, label, kbd, danger, onClick }: any) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 12px",
        cursor: "pointer",
        background: hov ? (danger ? "#fde7e9" : W.surfaceHov) : "transparent",
      }}
    >
      <Icon
        style={{
          width: 13,
          height: 13,
          color: danger ? W.danger : W.textSub,
          flexShrink: 0,
        }}
      />
      <span
        style={{ flex: 1, fontSize: 12, color: danger ? W.danger : W.text }}
      >
        {label}
      </span>
      {kbd && <span style={{ fontSize: 10, color: W.textMuted }}>{kbd}</span>}
    </div>
  );
}

function getModuleActions(module: string) {
  const map: Record<string, { icon: any; label: string }[]> = {
    dashboard: [
      { icon: RefreshCw, label: "Refresh" },
      { icon: Download, label: "Export" },
      { icon: Filter, label: "Filter" },
    ],
    inventory: [
      { icon: Plus, label: "Add Drug" },
      { icon: Edit2, label: "Edit" },
      { icon: Trash2, label: "Delete" },
      { icon: Download, label: "Export" },
    ],
    pos: [
      { icon: Plus, label: "Add Item" },
      { icon: Save, label: "Hold" },
      { icon: Printer, label: "Print" },
      { icon: Check, label: "Checkout" },
    ],
    reports: [
      { icon: Filter, label: "Filter" },
      { icon: Download, label: "Export" },
      { icon: Printer, label: "Print" },
    ],
    purchases: [
      { icon: Plus, label: "New Order" },
      { icon: Edit2, label: "Edit" },
      { icon: Printer, label: "Print" },
    ],
    customers: [
      { icon: Plus, label: "Add Customer" },
      { icon: Filter, label: "Filter" },
      { icon: Download, label: "Export" },
    ],
  };
  return map[module] ?? map.dashboard;
}

const qaBtn: React.CSSProperties = {
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 3,
  background: "transparent",
  cursor: "pointer",
  color: "#555",
};

const winBtn: React.CSSProperties = {
  width: 46,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#333",
  transition: "background .1s",
};

const menuBarItem: React.CSSProperties = {
  height: 26,
  padding: "0 10px",
  border: "none",
  cursor: "pointer",
  fontSize: 12,
  borderRadius: 3,
  background: "transparent",
  color: W.text,
  transition: "background .1s",
};
