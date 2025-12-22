// import React from "react";

// interface PrivacySectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// const PrivacySection: React.FC<PrivacySectionProps> = ({ title, children }) => (
//   <section className="policy-card">
//     <h3>{title}</h3>
//     <div>{children}</div>
//   </section>
// );

// const PrivacyPolicy: React.FC = () => {
//   return (
//     <div id="privacy" className="policy-section">
//       <h2>Privacy Policy</h2>
//       <p className="intro-text">
//         Aarohi Enterprises respects your privacy. This policy explains how we
//         collect, use, and protect your personal data.
//       </p>

//       <div className="policy-grid">
//         <PrivacySection title="Information We Collect">
//           <ul>
//             <li>Name, email, phone, address during registration</li>
//             <li>Transaction and payment information</li>
//             <li>Usage behavior and preferences</li>
//           </ul>
//         </PrivacySection>

//         <PrivacySection title="How We Use Your Data">
//           <ul>
//             <li>Provide and improve our services</li>
//             <li>Process orders and payments</li>
//             <li>Marketing (with opt-out option)</li>
//             <li>Fraud prevention and legal compliance</li>
//           </ul>
//         </PrivacySection>

//         <PrivacySection title="Data Sharing">
//           <ul>
//             <li>Group companies and affiliates</li>
//             <li>Payment processors and logistics partners</li>
//             <li>Law enforcement when required by law</li>
//           </ul>
//         </PrivacySection>

//         <PrivacySection title="Your Rights">
//           <ul>
//             <li>Access, update, or delete your data</li>
//             <li>Withdraw consent anytime</li>
//             <li>Opt-out of marketing communications</li>
//           </ul>
//         </PrivacySection>

//         <PrivacySection title="Data Security">
//           <p>
//             We use reasonable security practices to protect your data, though
//             internet transmission is never 100% secure.
//           </p>
//         </PrivacySection>

//         <PrivacySection title="Contact">
//           <p>
//             Grievance Officer:
//             <br />
//             Contact Details:
//             <br />
//             Email: aarohiselections@gmail.com | Phone: +916303519426
//             <br />
//             Mon-Fri 9:00-18:00
//           </p>
//         </PrivacySection>
//       </div>
//     </div>
//   );
// };

// export default PrivacyPolicy;
import React from "react";
import { Shield, Lock, User } from "lucide-react";

interface PrivacySectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({
  icon,
  title,
  children,
}) => (
  <div className="group bg-card border border-border/50 hover:border-primary/30 dark:border-border/30 dark:hover:border-primary/40 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 group-hover:from-primary/20 group-hover:to-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0 p-3 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mt-1 flex-1">{title}</h3>
    </div>
    <div className="text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

const PrivacyPolicy: React.FC = () => {
  return (
    <div id="privacy" className="space-y-8">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border-4 border-green-500/20 rounded-3xl p-8 md:p-12 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Privacy Policy
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Aarohi Enterprises respects your privacy. This policy explains how we
          collect, use, and protect your personal data.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        <PrivacySection
          icon={<Shield className="h-6 w-6 text-primary" />}
          title="Information We Collect"
        >
          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Name, email, phone, address during registration</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Transaction and payment information</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Usage behavior and preferences</span>
            </li>
          </ul>
        </PrivacySection>

        <PrivacySection
          icon={<Lock className="h-6 w-6 text-primary" />}
          title="How We Use Your Data"
        >
          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Provide and improve our services</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Process orders and payments</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Marketing (with opt-out option)</span>
            </li>
          </ul>
        </PrivacySection>

        <PrivacySection
          icon={<User className="h-6 w-6 text-accent" />}
          title="Your Rights"
        >
          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Access, update, or delete your data</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Withdraw consent anytime</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span>Opt-out of marketing communications</span>
            </li>
          </ul>
        </PrivacySection>

        <PrivacySection
          icon={<Shield className="h-6 w-6 text-destructive" />}
          title="Data Security"
        >
          <p className="mt-4">
            We use industry-standard security practices including encryption and
            secure servers to protect your data. However, no internet
            transmission is 100% secure.
          </p>
        </PrivacySection>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
        <h4 className="text-xl font-bold text-foreground mb-4">
          Contact Grievance Officer
        </h4>
        <p className="text-muted-foreground mb-4">
          Email:{" "}
          <a
            href="mailto:aarohiselections@gmail.com"
            className="text-primary hover:underline font-medium"
          >
            aarohiselections@gmail.com
          </a>
          <br />
          Phone:{" "}
          <a
            href="tel:+916303519426"
            className="text-primary hover:underline font-medium"
          >
            +91 63035 19426
          </a>
          <br />
          Hours: Mon-Fri 9:00-18:00
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
