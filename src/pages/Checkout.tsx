// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useCart } from "@/context/CartContext";
// import { toast } from "sonner";
// import { ShoppingBag } from "lucide-react";
// import { motion } from "framer-motion";

// const CHECKOUT_FORM_KEY = "checkoutForm";
// const BASE_URL = "http://127.0.0.1:8000";

// const PAYMENT_METHODS = ["upi", "card", "debit_card", "wallet"] as const;
// type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// const Checkout = () => {
//   const { cart, finalTotal, clearCart, appliedPromo, cartTotal } = useCart();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

//   // if in future you fetch surcharge config from backend, store here
//   // for now, values are hardcoded in getPaymentSurchargePercent
//   const getPaymentSurchargePercent = (method: PaymentMethod) => {
//     // these percentages will ultimately be controlled from Django
//     if (method === "card") return 2; // 2% for credit card
//     if (method === "debit_card") return 0; // 1% for debit card
//     if (method === "wallet") return 1.5; // 1.5% for wallets
//     return 0; // UPI has no extra charge
//   };

//   const surchargePercent = getPaymentSurchargePercent(paymentMethod);
//   const surchargeAmount = (finalTotal * surchargePercent) / 100;
//   const totalWithSurcharge = finalTotal + surchargeAmount;

//   // Load form data from localStorage on mount
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(CHECKOUT_FORM_KEY);
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         setFormData((prev) => ({ ...prev, ...parsed }));
//       }
//     } catch (e) {
//       console.error("Failed to load checkout form from localStorage", e);
//     }
//   }, []);

//   // Persist form data to localStorage on change
//   useEffect(() => {
//     try {
//       localStorage.setItem(CHECKOUT_FORM_KEY, JSON.stringify(formData));
//     } catch (e) {
//       console.error("Failed to save checkout form to localStorage", e);
//     }
//   }, [formData]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handlePhonePeCheckout = async () => {
//     if (!formData.name || !formData.phone || !formData.address) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (cart.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     try {
//       const itemsPayload = cart.map((item) => {
//         const rawUnit = item.discountPrice ?? item.price;
//         const unitPrice =
//           typeof rawUnit === "string" ? parseFloat(rawUnit) : rawUnit;
//         return {
//           product_id: item.id,
//           product_name: item.name,
//           quantity: item.quantity,
//           unit_price: unitPrice.toFixed(2),
//           subtotal: (unitPrice * item.quantity).toFixed(2),
//           category_name: item.category_name || "",
//           fabric_type_name: item.fabric_type_name || "",
//         };
//       });

//       const discountAmount = appliedPromo ? appliedPromo.discount_amount : 0;
//       const subtotal = cartTotal;
//       const baseTotal = finalTotal;

//       const surchargePercent = getPaymentSurchargePercent(paymentMethod);
//       const surchargeAmount = (baseTotal * surchargePercent) / 100;
//       const totalWithSurcharge = baseTotal + surchargeAmount;

//       const orderPayload = {
//         customer_name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         subtotal: subtotal.toFixed(2),
//         discount_amount: discountAmount.toFixed(2),
//         // IMPORTANT: send total including payment surcharge
//         total: totalWithSurcharge.toFixed(2),
//         promo_code: appliedPromo ? appliedPromo.code : "",
//         promo_details: appliedPromo
//           ? `${appliedPromo.discount_type} ${appliedPromo.discount_value}`
//           : "",
//         notes: "",
//         items: itemsPayload,

//         // Payment specific fields for backend
//         payment_method: paymentMethod,
//         payment_surcharge_percent: surchargePercent.toFixed(2),
//         payment_surcharge_amount: surchargeAmount.toFixed(2),
//         // optionally, send base total separately so backend can recompute
//         base_total: baseTotal.toFixed(2),
//       };

//       const res = await fetch(`${BASE_URL}/phonepe/initiate/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderPayload),
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         toast.error(err?.error || "Failed to start payment. Please try again.");
//         return;
//       }

//       const data = await res.json();
//       if (!data.redirect_url) {
//         toast.error("Payment gateway error. Please try again.");
//         return;
//       }

//       // Redirect to PhonePe payment page
//       window.location.href = data.redirect_url;
//     } catch (e) {
//       console.error(e);
//       toast.error("Something went wrong. Please try again.");
//     }
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
//             Add some items to your cart before checking out
//           </p>
//           <Button
//             onClick={() => navigate("/collections")}
//             size="lg"
//             className="bg-gradient-primary"
//           >
//             Browse Collections
//           </Button>
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
//         Checkout
//       </motion.h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Checkout Form */}
//         <div className="lg:col-span-2">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             <Card>
//               <CardHeader>
//                 <CardTitle>Contact Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="name">Full Name *</Label>
//                     <Input
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="Enter your full name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="phone">Phone Number *</Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       placeholder="+91 XXXXX XXXXX"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="email">Email (Optional)</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="your.email@example.com"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="mt-4">
//               <CardHeader>
//                 <CardTitle>Delivery Address</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label htmlFor="address">Street Address *</Label>
//                   <Textarea
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="Enter your complete address"
//                     rows={3}
//                     required
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="city">City *</Label>
//                     <Input
//                       id="city"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       placeholder="City"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="state">State *</Label>
//                     <Input
//                       id="state"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleChange}
//                       placeholder="State"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="pincode">Pincode *</Label>
//                     <Input
//                       id="pincode"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleChange}
//                       placeholder="PIN Code"
//                       required
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>

//         {/* Order Summary + Payment */}
//         <div className="lg:col-span-1">
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="sticky top-24"
//           >
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3 max-h-64 overflow-y-auto">
//                   {cart.map((item) => {
//                     const rawUnit = item.discountPrice ?? item.price;
//                     const unitPrice =
//                       typeof rawUnit === "string"
//                         ? parseFloat(rawUnit)
//                         : rawUnit;
//                     return (
//                       <div
//                         key={item.id}
//                         className="flex gap-3 pb-3 border-b border-border last:border-0"
//                       >
//                         <img
//                           src={item.images[0]}
//                           alt={item.name}
//                           className="w-16 h-20 object-cover rounded"
//                         />
//                         <div className="flex-1">
//                           <p className="font-medium text-sm line-clamp-1">
//                             {item.name}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             Qty: {item.quantity}
//                           </p>
//                           <p className="text-sm font-semibold text-primary">
//                             ₹
//                             {(unitPrice * item.quantity).toLocaleString(
//                               "en-IN"
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {appliedPromo && (
//                   <div className="p-3 bg-accent/10 rounded-lg border border-accent">
//                     <p className="text-sm font-semibold text-accent">
//                       {appliedPromo.code} applied
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {appliedPromo.discount_type === "percentage"
//                         ? `${appliedPromo.discount_value}% discount`
//                         : `₹${appliedPromo.discount_amount.toLocaleString(
//                             "en-IN"
//                           )} discount`}
//                     </p>
//                   </div>
//                 )}

//                 {/* Payment Method Selection */}
//                 <div className="space-y-3 pt-3 border-t border-border">
//                   <Label className="font-semibold text-sm">
//                     Payment Method
//                   </Label>
//                   <div className="space-y-2 text-sm">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment_method"
//                         value="upi"
//                         checked={paymentMethod === "upi"}
//                         onChange={(e) =>
//                           setPaymentMethod(e.target.value as PaymentMethod)
//                         }
//                       />
//                       <span>UPI (Recommended)</span>
//                     </label>

//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment_method"
//                         value="card"
//                         checked={paymentMethod === "card"}
//                         onChange={(e) =>
//                           setPaymentMethod(e.target.value as PaymentMethod)
//                         }
//                       />
//                       <span>Credit Card</span>
//                     </label>

//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment_method"
//                         value="debit_card"
//                         checked={paymentMethod === "debit_card"}
//                         onChange={(e) =>
//                           setPaymentMethod(e.target.value as PaymentMethod)
//                         }
//                       />
//                       <span>Debit Card</span>
//                     </label>

//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="payment_method"
//                         value="wallet"
//                         checked={paymentMethod === "wallet"}
//                         onChange={(e) =>
//                           setPaymentMethod(e.target.value as PaymentMethod)
//                         }
//                       />
//                       <span>Wallets</span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Totals with surcharge */}
//                 <div className="space-y-2 pt-3 border-t border-border">
//                   <div className="flex justify-between text-sm">
//                     <span>Order Total</span>
//                     <span>₹{finalTotal.toLocaleString("en-IN")}</span>
//                   </div>

//                   {surchargePercent > 0 && (
//                     <div className="flex justify-between text-xs text-muted-foreground">
//                       <span>
//                         Payment charge ({surchargePercent}% for{" "}
//                         {paymentMethod === "card"
//                           ? "Credit Card"
//                           : paymentMethod === "debit_card"
//                           ? "Debit Card"
//                           : "Wallet"}
//                         )
//                       </span>
//                       <span>+₹{surchargeAmount.toLocaleString("en-IN")}</span>
//                     </div>
//                   )}

//                   <div className="flex justify-between">
//                     <span className="font-semibold text-lg">
//                       Payable Amount
//                     </span>
//                     <span className="font-bold text-2xl text-primary">
//                       ₹{totalWithSurcharge.toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                 </div>

//                 <Button
//                   onClick={handlePhonePeCheckout}
//                   size="lg"
//                   className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
//                 >
//                   Pay Securely with PhonePe
//                 </Button>

//                 <p className="text-xs text-muted-foreground text-center">
//                   You will be redirected to PhonePe to complete your payment
//                   securely.
//                 </p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const CHECKOUT_FORM_KEY = "checkoutForm";
const BASE_URL = "http://127.0.0.1:8000";

const PAYMENT_METHODS = ["upi", "card", "debit_card", "wallet"] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

type PaymentMethodConfig = {
  method: PaymentMethod;
  surcharge_percent: string; // DRF DecimalField usually serialized as string[web:78][web:79]
};

const Checkout = () => {
  const { cart, finalTotal, clearCart, appliedPromo, cartTotal } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

  const [methodConfigs, setMethodConfigs] = useState<PaymentMethodConfig[]>([]);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);

  // Fetch payment method surcharge config from backend
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/payments/payment-method-config/`);
        if (!res.ok) {
          console.error("Failed to load payment method config", res.status);
          setLoadingConfig(false);
          return;
        }
        const data = await res.json();
        setMethodConfigs(data);
      } catch (e) {
        console.error("Failed to load payment method config", e);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfigs();
  }, []);

  const getPaymentSurchargePercent = (method: PaymentMethod) => {
    const cfg = methodConfigs.find((m) => m.method === method);
    if (!cfg) return 0;
    const parsed = parseFloat(cfg.surcharge_percent);
    if (Number.isNaN(parsed)) return 0;
    return parsed;
  };

  const surchargePercent = getPaymentSurchargePercent(paymentMethod);
  const surchargeAmount = (finalTotal * surchargePercent) / 100;
  const totalWithSurcharge = finalTotal + surchargeAmount;

  // Load form data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHECKOUT_FORM_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Failed to load checkout form from localStorage", e);
    }
  }, []);

  // Persist form data to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CHECKOUT_FORM_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error("Failed to save checkout form to localStorage", e);
    }
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhonePeCheckout = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const itemsPayload = cart.map((item) => {
        const rawUnit = item.discountPrice ?? item.price;
        const unitPrice =
          typeof rawUnit === "string" ? parseFloat(rawUnit) : rawUnit;
        return {
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: unitPrice.toFixed(2),
          subtotal: (unitPrice * item.quantity).toFixed(2),
          category_name: item.category_name || "",
          fabric_type_name: item.fabric_type_name || "",
        };
      });

      const discountAmount = appliedPromo ? appliedPromo.discount_amount : 0;
      const subtotal = cartTotal;
      const baseTotal = finalTotal;

      const surchargePercentForMethod =
        getPaymentSurchargePercent(paymentMethod);
      const surchargeAmountForMethod =
        (baseTotal * surchargePercentForMethod) / 100;
      const totalWithSurchargeForMethod = baseTotal + surchargeAmountForMethod;

      const orderPayload = {
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        subtotal: subtotal.toFixed(2),
        discount_amount: discountAmount.toFixed(2),
        // total including payment surcharge
        total: totalWithSurchargeForMethod.toFixed(2),
        promo_code: appliedPromo ? appliedPromo.code : "",
        promo_details: appliedPromo
          ? `${appliedPromo.discount_type} ${appliedPromo.discount_value}`
          : "",
        notes: "",
        items: itemsPayload,

        // Payment specific fields for backend
        payment_method: paymentMethod,
        payment_surcharge_percent: surchargePercentForMethod.toFixed(2),
        payment_surcharge_amount: surchargeAmountForMethod.toFixed(2),
        base_total: baseTotal.toFixed(2),
      };

      const res = await fetch(`${BASE_URL}/phonepe/initiate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Failed to start payment. Please try again.");
        return;
      }

      const data = await res.json();
      if (!data.redirect_url) {
        toast.error("Payment gateway error. Please try again.");
        return;
      }

      // Redirect to PhonePe payment page
      window.location.href = data.redirect_url;
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    }
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
            Add some items to your cart before checking out
          </p>
          <Button
            onClick={() => navigate("/collections")}
            size="lg"
            className="bg-gradient-primary"
          >
            Browse Collections
          </Button>
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
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="PIN Code"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Summary + Payment */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => {
                    const rawUnit = item.discountPrice ?? item.price;
                    const unitPrice =
                      typeof rawUnit === "string"
                        ? parseFloat(rawUnit)
                        : rawUnit;
                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 pb-3 border-b border-border last:border-0"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            ₹
                            {(unitPrice * item.quantity).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {appliedPromo && (
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent">
                    <p className="text-sm font-semibold text-accent">
                      {appliedPromo.code} applied
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appliedPromo.discount_type === "percentage"
                        ? `${appliedPromo.discount_value}% discount`
                        : `₹${appliedPromo.discount_amount.toLocaleString(
                            "en-IN"
                          )} discount`}
                    </p>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <Label className="font-semibold text-sm">
                    Payment Method
                  </Label>

                  {loadingConfig && (
                    <p className="text-xs text-muted-foreground">
                      Loading payment charges...
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as PaymentMethod)
                        }
                      />
                      <span>UPI (Recommended)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as PaymentMethod)
                        }
                      />
                      <span>Credit Card</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="debit_card"
                        checked={paymentMethod === "debit_card"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as PaymentMethod)
                        }
                      />
                      <span>Debit Card</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="wallet"
                        checked={paymentMethod === "wallet"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as PaymentMethod)
                        }
                      />
                      <span>Wallets</span>
                    </label>
                  </div>
                </div>

                {/* Totals with surcharge */}
                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span>Order Total</span>
                    <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>

                  {surchargePercent > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Payment charge ({surchargePercent}% for{" "}
                        {paymentMethod === "card"
                          ? "Credit Card"
                          : paymentMethod === "debit_card"
                          ? "Debit Card"
                          : "Wallet"}
                        )
                      </span>
                      <span>+₹{surchargeAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">
                      Payable Amount
                    </span>
                    <span className="font-bold text-2xl text-primary">
                      ₹{totalWithSurcharge.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePhonePeCheckout}
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90 text-lg py-6"
                  disabled={loadingConfig}
                >
                  Pay Securely with PhonePe
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to PhonePe to complete your payment
                  securely.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
