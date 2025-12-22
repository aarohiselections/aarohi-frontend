// // src/layouts/AppLayout.tsx
// import { useState, useEffect, useRef } from "react";
// import {
//   Outlet,
//   Link,
//   useNavigate,
//   useLocation,
//   createSearchParams,
// } from "react-router-dom";
// import { Search, X } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { motion, AnimatePresence } from "framer-motion";
// import { useGlobalSearch } from "@/context/SearchContext";

// const AppLayout = () => {
//   const { openGlobalSearch } = useGlobalSearch();
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [globalSearch, setGlobalSearch] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   // Close overlay when route changes (e.g. after navigating to collections)
//   useEffect(() => {
//     setIsSearchOpen(false);
//   }, [location.pathname]);

//   // Auto‑focus when overlay opens
//   useEffect(() => {
//     if (isSearchOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isSearchOpen]);

//   const openSearch = () => {
//     setGlobalSearch("");
//     setIsSearchOpen(true);
//   };

//   const handleSubmit = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     const trimmed = globalSearch.trim();
//     // Navigate to /collections with ?search=...
//     navigate({
//       pathname: "/collections",
//       search: trimmed ? `?${createSearchParams({ search: trimmed })}` : "",
//     });
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header */}
//       <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
//         <div className="container mx-auto px-3 sm:px-4 py-2 flex items-center justify-between">
//           <Link to="/" className="font-bold text-lg sm:text-xl">
//             Aarohi Selections
//           </Link>

//           <div className="flex items-center gap-2">
//             <Link to="/collections" className="hidden sm:inline text-sm">
//               Collections
//             </Link>

//             {/* Global search icon (mobile + desktop) */}
//             <Button
//               variant="outline"
//               size="icon"
//               className="rounded-full"
//               onClick={openSearch}
//               aria-label="Search"
//             >
//               <Search className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Fullscreen search overlay */}
//       <AnimatePresence>
//         {isSearchOpen && (
//           <motion.div
//             key="global-search"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-40 bg-background/95 backdrop-blur"
//           >
//             <div className="h-full flex flex-col">
//               {/* Top bar with close button */}
//               <div className="flex items-center justify-between px-4 py-3 border-b border-border">
//                 <span className="text-sm font-medium sm:text-base">
//                   Search products
//                 </span>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsSearchOpen(false)}
//                   aria-label="Close search"
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>

//               {/* Centered search bar */}
//               <form
//                 onSubmit={handleSubmit}
//                 className="flex-1 flex items-center justify-center px-4"
//               >
//                 <div className="w-full max-w-xl relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                   <Input
//                     ref={inputRef}
//                     type="text"
//                     placeholder="Search sarees, fabrics, colors..."
//                     value={globalSearch}
//                     onChange={(e) => setGlobalSearch(e.target.value)}
//                     className="pl-10 pr-24 h-12 text-base sm:text-lg"
//                   />
//                   <Button
//                     type="submit"
//                     className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-4 text-sm sm:text-base"
//                   >
//                     Search
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Page content */}
//       <main className="flex-1">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AppLayout;
import { useState, useEffect, useRef } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  createSearchParams,
} from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const AppLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Listen for global search event from Header
  useEffect(() => {
    const handleOpenSearch = () => {
      setGlobalSearch("");
      setIsSearchOpen(true);
    };
    window.addEventListener("openGlobalSearch", handleOpenSearch);
    return () =>
      window.removeEventListener("openGlobalSearch", handleOpenSearch);
  }, []);

  // Close overlay when route changes
  useEffect(() => {
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Auto-focus when overlay opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = globalSearch.trim();
    navigate({
      pathname: "/collections",
      search: trimmed ? `?${createSearchParams({ search: trimmed })}` : "",
    });
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Fullscreen search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            key="global-search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-medium sm:text-base">
                  Search products
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex items-center justify-center px-4"
              >
                <div className="w-full max-w-xl relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search sarees, fabrics, colors..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="pl-10 pr-24 h-12 text-base sm:text-lg"
                  />
                  <Button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 px-4 text-sm sm:text-base"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <Outlet />
    </>
  );
};

export default AppLayout;
