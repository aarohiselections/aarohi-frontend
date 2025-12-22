// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Truck, Package, Clock, MapPin } from "lucide-react";

// const ShippingPolicy: React.FC = () => {
//   return (
//     <div id="shipping-policy" className="shipping-container">
//       <div className="shipping-header">
//         <div className="header-content">
//           <h1 className="shipping-title">Shipping Policy</h1>
//           <p className="shipping-subtitle">
//             Reliable delivery across India through trusted courier partners
//           </p>
//         </div>
//       </div>

//       <div className="shipping-content">
//         <div className="policy-card featured">
//           <Truck className="h-12 w-12 text-primary" />
//           <h2>Shipping Partners</h2>
//           <p>
//             Orders shipped through registered domestic courier companies and/or
//             Speed Post only.
//           </p>
//         </div>

//         <div className="policy-grid">
//           <div className="policy-card">
//             <Package className="h-8 w-8 text-primary mb-4" />
//             <h3>Delivery Timeline</h3>
//             <ul>
//               <li>
//                 Orders shipped and delivered within <strong>7 days</strong> from
//                 order/payment date
//               </li>
//               <li>Or as per agreed delivery date at order confirmation</li>
//               <li>Subject to courier/post office processing times</li>
//             </ul>
//           </div>

//           <div className="policy-card">
//             <MapPin className="h-8 w-8 text-primary mb-4" />
//             <h3>Delivery Address</h3>
//             <ul>
//               <li>Delivered to address provided at purchase</li>
//               <li>Delivery confirmation sent to registered email</li>
//               <li>Ensure address accuracy at checkout</li>
//             </ul>
//           </div>

//           <div className="policy-card">
//             <Clock className="h-8 w-8 text-primary mb-4" />
//             <h3>Delivery Responsibility</h3>
//             <ul>
//               <li>Platform not liable for courier/postal delays</li>
//               <li>Shipping costs (if applicable) are non-refundable</li>
//               <li>Contact courier for tracking updates</li>
//             </ul>
//           </div>
//         </div>

//         <div className="important-notice">
//           <h3>Important Notice</h3>
//           <p>
//             Shipping times may vary due to location, courier availability, and
//             external factors. Track your order using the provided tracking
//             number at{" "}
//             <Link to="/track-order" className="text-primary hover:underline">
//               Track Order
//             </Link>
//             .
//           </p>
//         </div>
//       </div>

//       <div className="shipping-footer">
//         <p>
//           Last updated: December 2025 |{" "}
//           <Link to="/policies" className="text-primary hover:underline">
//             View All Policies
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ShippingPolicy;
import React from "react";
import { Link } from "react-router-dom";
import { Truck, Package, Clock, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShippingPolicy: React.FC = () => {
  return (
    <div id="shipping-policy" className="space-y-12">
      {/* Featured Card */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground rounded-3xl p-12 text-center shadow-2xl">
        <Truck className="w-24 h-24 mx-auto mb-6 opacity-90" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Shipping Partners
        </h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Orders shipped through registered domestic courier companies and/or
          Speed Post only.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="group bg-card border border-border hover:border-primary/30 dark:border-border/30 dark:hover:border-primary/40 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-primary/10 group-hover:bg-primary/20 dark:bg-primary/20 dark:group-hover:bg-primary/30 rounded-2xl flex items-center justify-center mb-6 transition-all">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Delivery Timeline
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <strong>7 days</strong> from order/payment date
            </li>
            <li>Or as per agreed delivery date</li>
            <li>Subject to courier processing times</li>
          </ul>
        </div>

        <div className="group bg-card border border-border hover:border-primary/30 dark:border-border/30 dark:hover:border-primary/40 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-accent/10 group-hover:bg-accent/20 dark:bg-accent/20 dark:group-hover:bg-accent/30 rounded-2xl flex items-center justify-center mb-6 transition-all">
            <MapPin className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Delivery Address
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li>Delivered to address provided at purchase</li>
            <li>Confirmation sent to registered email</li>
            <li>Ensure address accuracy at checkout</li>
          </ul>
        </div>

        <div className="group bg-card border border-border hover:border-destructive/30 dark:border-border/30 dark:hover:border-destructive/40 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-destructive/10 group-hover:bg-destructive/20 dark:bg-destructive/20 dark:group-hover:bg-destructive/30 rounded-2xl flex items-center justify-center mb-6 transition-all">
            <Clock className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Delivery Responsibility
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li>Not liable for courier/postal delays</li>
            <li>Shipping costs non-refundable</li>
            <li>Contact courier for tracking</li>
          </ul>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-200 dark:border-amber-800/50 rounded-3xl p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-amber-500 text-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            Important Notice
          </h3>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Shipping times may vary due to location, courier availability, and
          external factors. Track your order using the provided tracking number
          at{" "}
          <Button asChild variant="link" className="p-0 h-auto">
            <Link
              to="/track-order"
              className="text-primary hover:underline font-semibold"
            >
              Track Order
            </Link>
          </Button>
          .
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
