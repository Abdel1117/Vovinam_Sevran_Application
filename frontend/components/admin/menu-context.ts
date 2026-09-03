"use client";

import { createContext, useContext } from "react";

export type MenuContextValue = { ouvrir: () => void };

export const MenuContext = createContext<MenuContextValue>({ ouvrir: () => {} });

export function useMenu(): MenuContextValue {
  return useContext(MenuContext);
}
