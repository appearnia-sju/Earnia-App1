import React, { createContext, useContext, useState, useEffect } from "react";
import { NGO, Post, Theme } from "../types";
import * as storage from "../utils/storage";

interface AppContextType {
  ngos: NGO[];
  posts: Post[];
  theme: Theme;
  toggleTheme: () => void;
  refreshData: () => void;
  isAdmin: boolean;
  setAdmin: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("earnia_theme");
    return (saved as Theme) || "light";
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("earnia_admin_logged") === "true";
  });

  const refreshData = () => {
    setNgos(storage.getNGOs());
    setPosts(storage.getPosts());
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem("earnia_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const setAdmin = (val: boolean) => {
    setIsAdmin(val);
    localStorage.setItem("earnia_admin_logged", val.toString());
  };

  return (
    <AppContext.Provider value={{ ngos, posts, theme, toggleTheme, refreshData, isAdmin, setAdmin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
