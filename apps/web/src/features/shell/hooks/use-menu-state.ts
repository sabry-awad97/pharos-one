/**
 * Menu state management hook
 * Provides state and operations for the application menu bar
 */

import { useState, useCallback } from "react";
import type { MenuType } from "../types";

/**
 * Return type for useMenuState hook
 */
export interface UseMenuStateReturn {
  /** Currently active menu (null if none) */
  activeMenu: MenuType | null;
  /** Open a specific menu */
  openMenu: (menu: MenuType) => void;
  /** Close the currently open menu */
  closeMenu: () => void;
  /** Toggle a menu (open if closed, close if open) */
  toggleMenu: (menu: MenuType) => void;
  /** Check if a specific menu is open */
  isMenuOpen: (menu: MenuType) => boolean;
}

/**
 * Hook for coordinating menu state across the menu bar
 * Ensures only one menu can be open at a time
 *
 * @returns Menu state and control functions
 *
 * @example
 * ```tsx
 * const { activeMenu, toggleMenu } = useMenuState();
 *
 * <MenuBar
 *   activeMenu={activeMenu}
 *   onMenuClick={toggleMenu}
 * />
 * ```
 */
export function useMenuState(): UseMenuStateReturn {
  const [activeMenu, setActiveMenu] = useState<MenuType | null>(null);

  const openMenu = useCallback((menu: MenuType) => {
    setActiveMenu(menu);
  }, []);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const toggleMenu = useCallback((menu: MenuType) => {
    setActiveMenu((current) => (current === menu ? null : menu));
  }, []);

  const isMenuOpen = useCallback(
    (menu: MenuType) => activeMenu === menu,
    [activeMenu],
  );

  return {
    activeMenu,
    openMenu,
    closeMenu,
    toggleMenu,
    isMenuOpen,
  };
}
