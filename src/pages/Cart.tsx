// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Trash2, Plus, Minus, Tag, ShoppingBag } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useCart } from "@/context/CartContext";
// import { toast } from "sonner";

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// interface BackendPromo {
//   id: number;
//   code: string;
//   description: string;
//   discount_type: "percentage" | "fixed";
//   discount_value: string; // decimal as string
//   min_order_total: string;
//   max_discount_amount: string | null;
//   is_active: boolean;
// }

// interface AppliedPromoState {
//   code: string;
//   description: string;
//   discount_type: "percentage" | "fixed";
//   discount_value: number;
//   discount_amount: number;
//   min_order_total: number;
//   max_discount_amount: number | null;
// }

// const Cart = () => {
//   const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

//   const [promoInput, setPromoInput] = useState("");
//   const [availablePromos, setAvailablePromos] = useState<BackendPromo[]>([]);
//   const [appliedPromo, setAppliedPromo] = useState<AppliedPromoState | null>(
//     null
//   );
//   const [finalTotal, setFinalTotal] = useState<number>(cartTotal);
//   const [isApplying, setIsApplying] = useState(false);

//   // Fetch promos from backend
//   useEffect(() => {
//     const loadPromos = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/promocodes/`);
//         if (!res.ok) return;
//         const data: BackendPromo[] = await res.json();
//         setAvailablePromos(data.filter((p) => p.is_active));
//       } catch (err) {
//         console.error("Failed to load promo codes", err);
//       }
//     };
//     loadPromos();
//   }, []);

//   // Recompute final total when cartTotal or appliedPromo changes
//   useEffect(() => {
//     if (!appliedPromo) {
//       setFinalTotal(cartTotal);
//       return;
//     }
//     setFinalTotal(cartTotal - appliedPromo.discount_amount);
//   }, [cartTotal, appliedPromo]);

//   const handleApplyPromoBackend = async (code: string) => {
//     try {
//       setIsApplying(true);
//       setAppliedPromo(null);

//       const res = await fetch(`${API_BASE_URL}/promo/apply/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           code,
//           cart_total: cartTotal.toFixed(2),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         // Backend validation errors (invalid code or criteria not met)
//         const msg =
//           data?.code ||
//           data?.detail ||
//           "Promo is not valid. Please check the conditions.";
//         toast.error(typeof msg === "string" ? msg : "Invalid promocode");
//         return;
//       }

//       const discountAmount = parseFloat(data.discount_amount);
//       const discountValue = parseFloat(data.discount_value);
//       const minOrder = parseFloat(data.min_order_total);
//       const maxDiscount =
//         data.max_discount_amount != null
//           ? parseFloat(data.max_discount_amount)
//           : null;

//       setAppliedPromo({
//         code: data.code,
//         description: data.description,
//         discount_type: data.discount_type,
//         discount_value: discountValue,
//         discount_amount: discountAmount,
//         min_order_total: minOrder,
//         max_discount_amount: maxDiscount,
//       });
//       setFinalTotal(parseFloat(data.final_total));
//       toast.success(`Promo code ${data.code} applied successfully`);
//     } catch (err) {
//       console.error(err);
//       setAppliedPromo(null);
//       setFinalTotal(cartTotal);
//       toast.error("Something went wrong applying the promo code");
//     } finally {
//       setIsApplying(false);
//     }
//   };

//   const handleApplyPromo = () => {
//     const code = promoInput.trim().toUpperCase();
//     if (!code) return;
//     handleApplyPromoBackend(code);
//     setPromoInput("");
//   };

//   const handleRemovePromo = () => {
//     setAppliedPromo(null);
//     setFinalTotal(cartTotal);
//     toast.success("Promo code removed");
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen container mx-auto px-4 py-16">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center max-w-md mx-auto"
//         >
//           <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
//           <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
//           <p className="text-muted-foreground mb-8">
//             Looks like you haven&apos;t added anything to your cart yet
//           </p>
//           <Link to="/collections">
//             <Button size="lg" className="bg-gradient-primary hover:opacity-90">
//               Start Shopping
//             </Button>
//           </Link>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen container mx-auto px-4 py-8">
//       <motion.h1
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-bold mb-8"
//       >
//         Shopping Cart
//       </motion.h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2 space-y-4">
//           {cart.map((item, index) => {
//             const basePrice =
//               typeof item.price === "string"
//                 ? parseFloat(item.price)
//                 : item.price;
//             const discountPriceRaw =
//               item.discountPrice != null
//                 ? typeof item.discountPrice === "string"
//                   ? parseFloat(item.discountPrice)
//                   : item.discountPrice
//                 : undefined;
//             const effectivePrice = discountPriceRaw ?? basePrice;

//             const imageSrc = item.images?.[0] || "/placeholder.png";

//             const handleDecrease = () => {
//               if (item.quantity > 1) {
//                 updateQuantity(item.id, item.quantity - 1);
//               } else {
//                 removeFromCart(item.id);
//               }
//             };

//             const handleIncrease = () => {
//               updateQuantity(item.id, item.quantity + 1);
//             };

//             return (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <Card>
//                   <CardContent className="p-4">
//                     <div className="flex gap-4">
//                       <Link
//                         to={`/product/${item.id}`}
//                         className="flex-shrink-0"
//                       >
//                         <img
//                           src={imageSrc}
//                           alt={item.name}
//                           className="w-24 h-32 object-cover rounded-lg border border-border"
//                         />
//                       </Link>
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <Link to={`/product/${item.id}`}>
//                               <h3 className="font-semibold hover:text-primary transition-smooth">
//                                 {item.name}
//                               </h3>
//                             </Link>
//                             <p className="text-sm text-muted-foreground">
//                               {item.category_name || item.category} •{" "}
//                               {item.fabric_type_name || item.fabricType}
//                             </p>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => removeFromCart(item.id)}
//                             className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>

//                         <div className="flex items-baseline space-x-2 mb-3">
//                           <span className="text-lg font-bold text-primary">
//                             ₹{effectivePrice.toLocaleString("en-IN")}
//                           </span>
//                           {discountPriceRaw != null && (
//                             <span className="text-sm text-muted-foreground line-through">
//                               ₹{basePrice.toLocaleString("en-IN")}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex items-center space-x-3">
//                           <Button
//                             size="icon"
//                             variant="outline"
//                             onClick={handleDecrease}
//                             className="h-8 w-8"
//                           >
//                             <Minus className="h-3 w-3" />
//                           </Button>
//                           <span className="font-semibold w-8 text-center">
//                             {item.quantity}
//                           </span>
//                           <Button
//                             size="icon"
//                             variant="outline"
//                             onClick={handleIncrease}
//                             className="h-8 w-8"
//                           >
//                             <Plus className="h-3 w-3" />
//                           </Button>
//                           <span className="text-sm text-muted-foreground ml-auto">
//                             Subtotal: ₹
//                             {(effectivePrice * item.quantity).toLocaleString(
//                               "en-IN"
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* Summary */}
//         <div className="lg:col-span-1">
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="sticky top-24 space-y-4"
//           >
//             {/* Promo Code */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center">
//                   <Tag className="h-5 w-5 mr-2" />
//                   Promo Code
//                 </CardTitle>
//                 <CardDescription>
//                   Apply a promo code to get a discount on your order.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {appliedPromo ? (
//                   <div className="space-y-2">
//                     <div className="p-4 bg-accent/10 rounded-lg border border-accent">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <p className="font-semibold text-accent">
//                             {appliedPromo.code}
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             {appliedPromo.description}
//                           </p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             Discount:{" "}
//                             {appliedPromo.discount_type === "percentage"
//                               ? `${appliedPromo.discount_value}%`
//                               : `₹${appliedPromo.discount_amount.toLocaleString(
//                                   "en-IN"
//                                 )}`}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             Min order: ₹
//                             {appliedPromo.min_order_total.toLocaleString(
//                               "en-IN"
//                             )}
//                             {appliedPromo.max_discount_amount != null && (
//                               <>
//                                 {" "}
//                                 • Max discount: ₹
//                                 {appliedPromo.max_discount_amount.toLocaleString(
//                                   "en-IN"
//                                 )}
//                               </>
//                             )}
//                           </p>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={handleRemovePromo}
//                           className="text-destructive"
//                         >
//                           Remove
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Enter promo code"
//                         value={promoInput}
//                         disabled={isApplying}
//                         onChange={(e) =>
//                           setPromoInput(e.target.value.toUpperCase())
//                         }
//                         onKeyDown={(e) =>
//                           e.key === "Enter" && handleApplyPromo()
//                         }
//                       />
//                       <Button onClick={handleApplyPromo} disabled={isApplying}>
//                         {isApplying ? "Applying..." : "Apply"}
//                       </Button>
//                     </div>

//                     <div className="space-y-2">
//                       <p className="text-sm font-semibold">
//                         Available Promo Codes:
//                       </p>
//                       {availablePromos.map((promo) => {
//                         const minOrder = parseFloat(promo.min_order_total);
//                         const discountValue = parseFloat(promo.discount_value);
//                         return (
//                           <button
//                             key={promo.code}
//                             onClick={() => {
//                               setPromoInput(promo.code);
//                               handleApplyPromoBackend(promo.code);
//                             }}
//                             className="w-full text-left p-3 bg-muted hover:bg-muted/80 rounded-lg transition-smooth border border-border"
//                           >
//                             <p className="font-semibold text-sm text-primary">
//                               {promo.code}
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               {promo.description}
//                             </p>
//                             <p className="text-[11px] text-muted-foreground mt-1">
//                               {promo.discount_type === "percentage"
//                                 ? `${discountValue}% off`
//                                 : `Flat ₹${discountValue.toLocaleString(
//                                     "en-IN"
//                                   )} off`}
//                               {" • "}
//                               Min order ₹{minOrder.toLocaleString("en-IN")}
//                             </p>
//                           </button>
//                         );
//                       })}
//                       {availablePromos.length === 0 && (
//                         <p className="text-xs text-muted-foreground">
//                           No promo codes available right now.
//                         </p>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Order Summary */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-medium">
//                     ₹{cartTotal.toLocaleString("en-IN")}
//                   </span>
//                 </div>
//                 {appliedPromo && (
//                   <div className="flex justify-between text-sm text-accent">
//                     <span>Discount</span>
//                     <span>
//                       -₹
//                       {appliedPromo.discount_amount.toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 )}
//                 <div className="border-t border-border pt-3 flex justify-between">
//                   <span className="font-semibold text-lg">Total</span>
//                   <span className="font-bold text-2xl text-primary">
//                     ₹{finalTotal.toLocaleString("en-IN")}
//                   </span>
//                 </div>
//                 <Link to="/checkout" className="block">
//                   <Button className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6">
//                     Proceed to Checkout
//                   </Button>
//                 </Link>
//                 <Link to="/collections">
//                   <Button variant="outline" className="w-full">
//                     Continue Shopping
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, Tag, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface BackendPromo {
  id: number;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: string; // decimal as string
  min_order_total: string;
  max_discount_amount: string | null;
  is_active: boolean;
}

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    appliedPromo,
    setAppliedPromo,
    finalTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [availablePromos, setAvailablePromos] = useState<BackendPromo[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch promos from backend
  useEffect(() => {
    const loadPromos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/promocodes/`);
        if (!res.ok) return;
        const data: BackendPromo[] = await res.json();
        setAvailablePromos(data.filter((p) => p.is_active));
      } catch (err) {
        console.error("Failed to load promo codes", err);
      }
    };
    loadPromos();
  }, []);

  const handleApplyPromoBackend = async (code: string) => {
    try {
      setIsApplying(true);
      setAppliedPromo(null);

      const res = await fetch(`${API_BASE_URL}/promo/apply/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          cart_total: cartTotal.toFixed(2),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.code ||
          data?.detail ||
          "Promo is not valid. Please check the conditions.";
        toast.error(typeof msg === "string" ? msg : "Invalid promocode");
        return;
      }

      const discountAmount = parseFloat(data.discount_amount);
      const discountValue = parseFloat(data.discount_value);

      setAppliedPromo({
        code: data.code,
        description: data.description,
        discount_type: data.discount_type,
        discount_value: discountValue,
        discount_amount: discountAmount,
      });
      toast.success(`Promo code ${data.code} applied successfully`);
    } catch (err) {
      console.error(err);
      setAppliedPromo(null);
      toast.error("Something went wrong applying the promo code");
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    handleApplyPromoBackend(code);
    setPromoInput("");
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.success("Promo code removed");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added anything to your cart yet
          </p>
          <Link to="/collections">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8"
      >
        Shopping Cart
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const basePrice =
              typeof item.price === "string"
                ? parseFloat(item.price)
                : item.price;
            const discountPriceRaw =
              item.discountPrice != null
                ? typeof item.discountPrice === "string"
                  ? parseFloat(item.discountPrice)
                  : item.discountPrice
                : undefined;
            const effectivePrice = discountPriceRaw ?? basePrice;

            const imageSrc = item.images?.[0] || "/placeholder.png";

            const handleDecrease = () => {
              if (item.quantity > 1) {
                updateQuantity(item.id, item.quantity - 1);
              } else {
                removeFromCart(item.id);
              }
            };

            const handleIncrease = () => {
              updateQuantity(item.id, item.quantity + 1);
            };

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link
                        to={`/product/${item.id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-24 h-32 object-cover rounded-lg border border-border"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link to={`/product/${item.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-smooth">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {item.category_name || item.category} •{" "}
                              {item.fabric_type_name || item.fabricType}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-baseline space-x-2 mb-3">
                          <span className="text-lg font-bold text-primary">
                            ₹{effectivePrice.toLocaleString("en-IN")}
                          </span>
                          {discountPriceRaw != null && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{basePrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleDecrease}
                            className="h-8 w-8"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleIncrease}
                            className="h-8 w-8"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm text-muted-foreground ml-auto">
                            Subtotal: ₹
                            {(effectivePrice * item.quantity).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 space-y-4"
          >
            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Promo Code
                </CardTitle>
                <CardDescription>
                  Apply a promo code to get a discount on your order.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {appliedPromo ? (
                  <div className="space-y-2">
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-accent">
                            {appliedPromo.code}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appliedPromo.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Discount:{" "}
                            {appliedPromo.discount_type === "percentage"
                              ? `${appliedPromo.discount_value}%`
                              : `₹${appliedPromo.discount_amount.toLocaleString(
                                  "en-IN"
                                )}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemovePromo}
                          className="text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoInput}
                        disabled={isApplying}
                        onChange={(e) =>
                          setPromoInput(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyPromo()
                        }
                      />
                      <Button onClick={handleApplyPromo} disabled={isApplying}>
                        {isApplying ? "Applying..." : "Apply"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold">
                        Available Promo Codes:
                      </p>
                      {availablePromos.map((promo) => {
                        const minOrder = parseFloat(promo.min_order_total);
                        const discountValue = parseFloat(promo.discount_value);
                        return (
                          <button
                            key={promo.code}
                            onClick={() => {
                              setPromoInput(promo.code);
                              handleApplyPromoBackend(promo.code);
                            }}
                            className="w-full text-left p-3 bg-muted hover:bg-muted/80 rounded-lg transition-smooth border border-border"
                          >
                            <p className="font-semibold text-sm text-primary">
                              {promo.code}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {promo.description}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              {promo.discount_type === "percentage"
                                ? `${discountValue}% off`
                                : `Flat ₹${discountValue.toLocaleString(
                                    "en-IN"
                                  )} off`}
                              {" • "}
                              Min order ₹{minOrder.toLocaleString("en-IN")}
                            </p>
                          </button>
                        );
                      })}
                      {availablePromos.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          No promo codes available right now.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-accent">
                    <span>Discount</span>
                    <span>
                      -₹
                      {appliedPromo.discount_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <Link to="/checkout" className="block">
                  <Button className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link to="/collections">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
