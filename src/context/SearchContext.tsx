// src/context/SearchContext.tsx
import { createContext, useContext, ReactNode } from "react";

interface SearchContextType {
  openGlobalSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const openGlobalSearch = () => {
    window.dispatchEvent(new CustomEvent("openGlobalSearch"));
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
