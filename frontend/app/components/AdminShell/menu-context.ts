"use client";

import { createContext, useContext } from "react";

export type MenuContextValue = { open: () => void };

export const MenuContext = createContext<MenuContextValue>({ open: () => {} });

export function useMenu(): MenuContextValue {
  return useContext(MenuContext);
}
