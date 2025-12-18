// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { products } from "@/data/products";
// import { Product } from "@/types/product";
// import { motion } from "framer-motion";
// import { Clock } from "lucide-react";

// const MAX_RECENT = 4;

// export const addToRecentlyViewed = (productId: string) => {
//   const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
//   const filtered = recent.filter((id: string) => id !== productId);
//   filtered.unshift(productId);
//   localStorage.setItem(
//     "recentlyViewed",
//     JSON.stringify(filtered.slice(0, MAX_RECENT + 1))
//   );
// };

// interface RecentlyViewedProps {
//   currentProductId?: string;
// }

// export const RecentlyViewed = ({ currentProductId }: RecentlyViewedProps) => {
//   const [recentProducts, setRecentProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     const recentIds = JSON.parse(
//       localStorage.getItem("recentlyViewed") || "[]"
//     );
//     const filteredIds = currentProductId
//       ? recentIds.filter((id: string) => id !== currentProductId)
//       : recentIds;

//     const recentItems = filteredIds
//       .slice(0, MAX_RECENT)
//       .map((id: string) => products.find((p) => p.id === id))
//       .filter(Boolean) as Product[];

//     setRecentProducts(recentItems);
//   }, [currentProductId]);

//   if (recentProducts.length === 0) return null;

//   return (
//     <div className="py-8 md:py-12">
//       <div className="flex items-center gap-2 mb-4 md:mb-6">
//         <Clock className="h-5 w-5 text-muted-foreground" />
//         <h3 className="text-lg md:text-xl font-semibold">Recently Viewed</h3>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//         {recentProducts.map((product, index) => (
//           <motion.div
//             key={product.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Link to={`/product/${product.id}`}>
//               <div className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-card">
//                 <img
//                   src={product.images[0]}
//                   alt={product.name}
//                   className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//                 <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform">
//                   <p className="text-xs md:text-sm font-medium line-clamp-1">
//                     {product.name}
//                   </p>
//                   <p className="text-xs text-primary font-semibold">
//                     ₹{(product.discountPrice || product.price).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </Link>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const MAX_RECENT = 4;
//const API_BASE_URL = "http://127.0.0.1:8000/api";

// --- Types matching your API ---
interface APIImage {
  image: string;
}

interface APIProduct {
  id: number;
  name: string;
  price: string | number;
  discountPrice: string | number;
  images: APIImage[];
}

export const addToRecentlyViewed = (productId: string) => {
  try {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem("recentlyViewed");
    const recent: string[] = raw ? JSON.parse(raw) : [];

    const filtered = recent.filter((id) => id !== productId);
    filtered.unshift(productId);

    window.localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(filtered.slice(0, MAX_RECENT + 1))
    );
  } catch (err) {
    console.error("Failed to update recently viewed", err);
  }
};

interface RecentlyViewedProps {
  currentProductId?: string;
}

export const RecentlyViewed = ({ currentProductId }: RecentlyViewedProps) => {
  const [recentProducts, setRecentProducts] = useState<APIProduct[]>([]);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        if (typeof window === "undefined") return;

        const raw = window.localStorage.getItem("recentlyViewed");
        const recentIds: string[] = raw ? JSON.parse(raw) : [];

        const filteredIds = currentProductId
          ? recentIds.filter((id) => id !== currentProductId)
          : recentIds;

        const idsToLoad = filteredIds.slice(0, MAX_RECENT);
        if (!idsToLoad.length) {
          setRecentProducts([]);
          return;
        }

        const requests = idsToLoad.map((id) =>
          fetch(`${API_BASE_URL}/products/${id}/detail/`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch product " + id);
            return res.json();
          })
        );

        const results: APIProduct[] = await Promise.all(requests);
        setRecentProducts(results);
      } catch (err) {
        console.error("Failed to load recent products", err);
        setRecentProducts([]);
      }
    };

    loadRecent();
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <div className="py-8 md:py-12">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg md:text-xl font-semibold">Recently Viewed</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {recentProducts.map((product, index) => {
          const price =
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price;
          const discountPrice =
            typeof product.discountPrice === "string"
              ? parseFloat(product.discountPrice)
              : product.discountPrice;
          const finalPrice =
            product.discountPrice && discountPrice ? discountPrice : price;
          const imageSrc = product.images[0]?.image;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-card">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-xs md:text-sm font-medium line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      ₹{finalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
