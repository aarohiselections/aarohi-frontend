// src/context/SearchContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  openGlobalSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openGlobalSearch = () => {
    setIsSearchOpen(true);
  };

  return (
    <SearchContext.Provider value={{ openGlobalSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useGlobalSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useGlobalSearch must be used within SearchProvider");
  }
  return context;
};
