import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Truck, BarChart2, Users, Settings, ChevronRight, ChevronLeft, LayoutDashboard, MoreVertical, Store, Search, ChevronDown, Check, User, ExternalLink, PlusSquare, Star, Link, FileText } from 'lucide-react';
import { ViewMode } from '../App';

interface SidebarProps {
  expanded: boolean;
  setExpanded: (exp: boolean) => void;
  activeTabType?: ViewMode;
  openTab: (mode: ViewMode, forceNew?: boolean) => void;
}

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  subItems?: { id: string; label: string; badge?: number | string }[];
};

export default function Sidebar({ expanded, setExpanded, activeTabType, openTab }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'inventory-group': true
  });
  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number } | null>(null);
  const [contextMenuSearch, setContextMenuSearch] = useState('');

  useEffect(() => {
    if (!contextMenu) {
      setContextMenuSearch('');
    }
  }, [contextMenu]);

  const contextMenuItems = [
    { id: 'open', label: 'Open', icon: LayoutDashboard, action: (id: string) => openTab(id) },
    { id: 'open-new', label: 'Open in new tab', icon: PlusSquare, action: (id: string) => openTab(id, true) },
    { id: 'favorite', label: 'Add to Favorites', icon: Star, action: () => {} },
    { id: 'copy', label: 'Copy Link', icon: Link, action: () => {} },
    { id: 'export', label: 'Export Data', icon: FileText, action: () => {} },
  ];

  const filteredContextMenuItems = contextMenuItems.filter(item => 
    item.label.toLowerCase().includes(contextMenuSearch.toLowerCase())
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBranch, setActiveBranch] = useState('main');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const branches = [
    { id: 'main', name: 'Main Pharmacy (Downtown)' },
    { id: 'north', name: 'Northside Clinic' },
    { id: 'east', name: 'Eastwood Branch' },
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
      setBranchDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS (Point of Sale)', icon: ShoppingCart },
    { 
      id: 'inventory-group', 
      label: 'Inventory', 
      icon: Package,
      subItems: [
        { id: 'inventory', label: 'Stock Management', badge: 24 },
        { id: 'categories', label: 'Categories', badge: 12 },
        { id: 'transfers', label: 'Transfers', badge: 2 }
      ]
    },
    { 
      id: 'purchases-group', 
      label: 'Purchases', 
      icon: Truck,
      subItems: [
        { id: 'purchases', label: 'Purchase Orders', badge: 3 },
        { id: 'suppliers', label: 'Suppliers', badge: 8 },
        { id: 'returns', label: 'Returns' }
      ]
    },
    { 
      id: 'reports-group', 
      label: 'Reports', 
      icon: BarChart2,
      subItems: [
        { id: 'sales-reports', label: 'Sales Reports' },
        { id: 'inventory-reports', label: 'Inventory Reports' }
      ]
    },
    { id: 'customers', label: 'Customers', icon: Users, badge: 142 },
  ];

  const filteredNavItems = navItems.map(item => {
    if (!searchQuery) return item;
    
    const query = searchQuery.toLowerCase();
    const itemMatches = item.label.toLowerCase().includes(query);
    
    if (item.subItems) {
      const matchingSubItems = item.subItems.filter(sub => 
        sub.label.toLowerCase().includes(query)
      );
      
      if (itemMatches || matchingSubItems.length > 0) {
        return {
          ...item,
          subItems: itemMatches ? item.subItems : matchingSubItems
        };
      }
      return null;
    }
    
    return itemMatches ? item : null;
  }).filter(Boolean) as NavItem[];

  return (
    <>
      <aside 
        className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md transition-all duration-300 ease-in-out flex flex-col relative ${expanded ? 'w-64' : 'w-14'} shrink-0 z-20`}
      >
        {/* Edge Toggle Handle */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="absolute top-0 -right-1.5 w-3 h-full cursor-col-resize z-50 flex justify-center group/rail"
          title={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <div className="w-[2px] h-full bg-transparent group-hover/rail:bg-indigo-500 transition-colors duration-200 delay-75" />
        </div>

        {/* Branch Selector */}
        <div className="p-2 border-b border-zinc-200 dark:border-zinc-900 relative shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); setBranchDropdownOpen(!branchDropdownOpen); if(!expanded) setExpanded(true); }}
            className="w-full flex items-center justify-between bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-700/60 p-2 rounded-md transition-colors"
            title="Select Branch"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Store className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className={`text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                {branches.find(b => b.id === activeBranch)?.name}
              </span>
            </div>
            {expanded && <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-500 shrink-0" />}
          </button>

          {branchDropdownOpen && expanded && (
            <div className="absolute top-full left-2 right-2 mt-1 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 rounded-md shadow-xl py-1 z-50">
              {branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => { setActiveBranch(branch.id); setBranchDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{branch.name}</span>
                  {activeBranch === branch.id && <Check className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="px-2 pt-3 pb-1 shrink-0">
          <div 
            className={`relative flex items-center bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm rounded-md transition-all ${expanded ? 'px-2.5 py-1.5' : 'p-2 justify-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/60'}`}
            onClick={() => { if (!expanded) setExpanded(true); }}
            title="Search Menu"
          >
            <Search className={`w-4 h-4 text-zinc-500 dark:text-zinc-500 shrink-0 ${expanded ? 'mr-2' : ''}`} />
            {expanded && (
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0 p-0"
              />
            )}
          </div>
        </div>

        <nav className="flex-1 py-2 flex flex-col gap-1 px-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {filteredNavItems.length === 0 ? (
            <div className="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-500 text-center">
              {expanded ? 'No items found' : '-'}
            </div>
          ) : (
            filteredNavItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = !!item.subItems?.length;
              const isOpen = searchQuery ? true : openMenus[item.id];
              
              // Check if any subitem is active to highlight the parent
              const isParentActive = hasSubItems && item.subItems?.some(sub => sub.id === activeTabType);
              const isActive = !hasSubItems && activeTabType === item.id;
              
              // Display badge: explicit badge on item
              let displayBadge = item.badge;

              return (
                <div key={item.id} className="flex flex-col">
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        toggleMenu(item.id);
                        if (!expanded) setExpanded(true);
                      } else {
                        openTab(item.id);
                      }
                    }}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-md transition-colors whitespace-nowrap overflow-hidden ${
                      isActive || isParentActive
                        ? 'bg-indigo-500/10 text-indigo-400' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                    title={!expanded ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <Icon className="w-4 h-4 shrink-0" />
                        {!expanded && displayBadge !== undefined && (
                          <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-indigo-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center border border-zinc-300 dark:border-zinc-950">
                            {displayBadge}
                          </span>
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {displayBadge !== undefined && expanded && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[20px] text-center ${isActive || isParentActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                          {displayBadge}
                        </span>
                      )}
                      {!hasSubItems && expanded && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setContextMenu({ id: item.id, x: e.clientX, y: e.clientY });
                          }}
                          className="p-0.5 text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </div>
                      )}
                      {hasSubItems && expanded && (
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                      )}
                    </div>
                  </button>

                  {/* Sub Items */}
                  {hasSubItems && (
                    <div className={`grid transition-all duration-200 ease-in-out ${isOpen && expanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden flex flex-col gap-1 pl-9 pr-2">
                        {item.subItems!.map(sub => {
                          const isSubActive = activeTabType === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => openTab(sub.id)}
                              className={`group flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                                isSubActive
                                  ? 'text-indigo-400 bg-indigo-500/5 font-medium'
                                  : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
                              }`}
                            >
                              <span className="truncate">{sub.label}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {sub.badge !== undefined && (
                                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[20px] text-center ${isSubActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                                    {sub.badge}
                                  </span>
                                )}
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setContextMenu({ id: sub.id, x: e.clientX, y: e.clientY });
                                  }}
                                  className="p-0.5 text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
        
        <div className="p-2 mt-auto border-t border-zinc-200 dark:border-zinc-900 shrink-0 flex flex-col gap-1">
          <button className="flex items-center gap-3 px-2.5 py-2 rounded-md text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors w-full whitespace-nowrap overflow-hidden">
            <div className="relative flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center border-[1.5px] border-zinc-300 dark:border-zinc-950">
                <Check className="w-2 h-2 text-white" strokeWidth={4} />
              </div>
            </div>
            <span className={`text-sm font-medium transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              Profile
            </span>
          </button>
          <button className="flex items-center gap-3 px-2.5 py-2 rounded-md text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors w-full whitespace-nowrap overflow-hidden">
            <Settings className="w-4 h-4 shrink-0" />
            <span className={`text-sm font-medium transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              Settings
            </span>
          </button>
        </div>
      </aside>

      {/* Context Menu Portal */}
      {contextMenu && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setContextMenu(null)}
          />
          <div 
            className="fixed z-50 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden flex flex-col"
            style={{ 
              top: Math.min(contextMenu.y, window.innerHeight - 250), 
              left: contextMenu.x 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search actions..." 
                  value={contextMenuSearch}
                  onChange={(e) => setContextMenuSearch(e.target.value)}
                  className="w-full bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm rounded-md text-xs py-1.5 pl-8 pr-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-colors"
                  autoFocus
                />
              </div>
            </div>
            <div className="py-1.5 max-h-60 overflow-y-auto custom-scrollbar">
              {filteredContextMenuItems.length > 0 ? (
                filteredContextMenuItems.map(item => (
                  <button 
                    key={item.id}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                    onClick={() => {
                      item.action(contextMenu.id);
                      setContextMenu(null);
                    }}
                  >
                    <item.icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                    <span>{item.label}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-xs text-zinc-500 dark:text-zinc-500 text-center flex flex-col items-center gap-2">
                  <Search className="w-4 h-4 opacity-50" />
                  <span>No actions found</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
