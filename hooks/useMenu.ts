// React & React Native Imports
import { useContext } from "react";

// Context Imports
import { MenuContext } from "@/context/MenuContext";

export const useMenu = () => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used within an MenuProvider");
  }

  return context;
};