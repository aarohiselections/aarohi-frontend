import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TermsConditions from "./TermsConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import ShippingPolicyContent from "./ShippingPolicy";
import "./PoliciesPage.css";

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
    // Update URL hash
    window.history.replaceState(
      null,
      "",
      `/policies#${tab === "shipping" ? "shipping" : tab}`
    );
  };

  return (
    <div className="policies-container">
      <div className="policies-header">
        <h1>Aarohi Selections Policies</h1>
        <p>Important legal documents governing your use of our platform</p>
      </div>

      <div className="policies-tabs">
        <button
          className={`tab-btn ${activeTab === "terms" ? "active" : ""}`}
          onClick={() => handleTabClick("terms")}
        >
          Terms & Conditions
        </button>
        <button
          className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
          onClick={() => handleTabClick("privacy")}
        >
          Privacy Policy
        </button>
        <button
          className={`tab-btn ${activeTab === "shipping" ? "active" : ""}`}
          onClick={() => handleTabClick("shipping")}
        >
          Shipping Policy
        </button>
      </div>

      <div className="policies-content">
        {activeTab === "terms" && <TermsConditions />}
        {activeTab === "privacy" && <PrivacyPolicy />}
        {activeTab === "shipping" && <ShippingPolicyContent />}
      </div>

      <div className="policies-footer">
        <p>
          Last updated: December 2025 | <a href="/contact">Contact Us</a>
        </p>
      </div>
    </div>
  );
};

export default PoliciesPage;
