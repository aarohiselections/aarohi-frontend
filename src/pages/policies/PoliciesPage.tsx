// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import TermsConditions from "./TermsConditions";
// import PrivacyPolicy from "./PrivacyPolicy";
// import ShippingPolicyContent from "./ShippingPolicy";
// import "./PoliciesPage.css";

// const PoliciesPage: React.FC = () => {
//   const location = useLocation();
//   const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "shipping">(
//     "terms"
//   );

//   // Handle URL hash navigation
//   useEffect(() => {
//     const hash = location.hash.replace("#", "");
//     if (hash === "terms") setActiveTab("terms");
//     else if (hash === "privacy") setActiveTab("privacy");
//     else if (hash === "shipping" || hash === "shipping-policy")
//       setActiveTab("shipping");
//   }, [location.hash]);

//   const handleTabClick = (tab: "terms" | "privacy" | "shipping") => {
//     setActiveTab(tab);
//     // Update URL hash
//     window.history.replaceState(
//       null,
//       "",
//       `/policies#${tab === "shipping" ? "shipping" : tab}`
//     );
//   };

//   return (
//     <div className="policies-container">
//       <div className="policies-header">
//         <h1>Aarohi Selections Policies</h1>
//         <p>Important legal documents governing your use of our platform</p>
//       </div>

//       <div className="policies-tabs">
//         <button
//           className={`tab-btn ${activeTab === "terms" ? "active" : ""}`}
//           onClick={() => handleTabClick("terms")}
//         >
//           Terms & Conditions
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
//           onClick={() => handleTabClick("privacy")}
//         >
//           Privacy Policy
//         </button>
//         <button
//           className={`tab-btn ${activeTab === "shipping" ? "active" : ""}`}
//           onClick={() => handleTabClick("shipping")}
//         >
//           Shipping Policy
//         </button>
//       </div>

//       <div className="policies-content">
//         {activeTab === "terms" && <TermsConditions />}
//         {activeTab === "privacy" && <PrivacyPolicy />}
//         {activeTab === "shipping" && <ShippingPolicyContent />}
//       </div>

//       <div className="policies-footer">
//         <p>
//           Last updated: December 2025 | <a href="/contact">Contact Us</a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PoliciesPage;
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TermsConditions from "./TermsConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import ShippingPolicyContent from "./ShippingPolicy";

const PoliciesPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "shipping">(
    "terms"
  );

  // Handle URL hash navigation
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "terms") setActiveTab("terms");
    else if (hash === "privacy") setActiveTab("privacy");
    else if (hash === "shipping" || hash === "shipping-policy")
      setActiveTab("shipping");
  }, [location.hash]);

  const handleTabClick = (tab: "terms" | "privacy" | "shipping") => {
    setActiveTab(tab);
    window.history.replaceState(
      null,
      "",
      `/policies#${tab === "shipping" ? "shipping" : tab}`
    );
  };

  const tabs = [
    { id: "terms", label: "Terms & Conditions" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "shipping", label: "Shipping Policy" },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="outline" asChild className="mb-12">
          <a href="/" className="flex items-center gap-2 hover:no-underline">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </Button>

        {/* Header */}
        <div className="text-center mb-16 pb-12 border-b border-border dark:border-border/50">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-primary dark:from-foreground dark:to-accent bg-clip-text text-transparent mb-6">
            Aarohi Selections Policies
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Important legal documents governing your use of our platform
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => handleTabClick(tab.id as any)}
              className="px-8 py-4 rounded-2xl font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-12">
          {activeTab === "terms" && <TermsConditions />}
          {activeTab === "privacy" && <PrivacyPolicy />}
          {activeTab === "shipping" && <ShippingPolicyContent />}
        </div>

        {/* Footer */}
        <div className="text-center mt-20 pt-12 border-t border-border dark:border-border/50">
          <p className="text-muted-foreground text-sm">
            Last updated: December 2025 |{" "}
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact Us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
