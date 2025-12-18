import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnnouncementBarProps {
  apiUrl?: string; // optional override
}

const defaultMessages = [
  "✨ Free Shipping on orders above ₹5000",
  "🎁 Use code WELCOME10 for 10% off your first order",
  "🛍️ New arrivals every week - Stay tuned!",
  "💫 100% Authentic Handcrafted Sarees",
  "📞 WhatsApp us for personalized assistance",
];

export const AnnouncementBar = ({
  apiUrl = "http://127.0.0.1:8000/api/announcements/",
}: AnnouncementBarProps) => {
  const [messages, setMessages] = useState<string[]>(defaultMessages);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          // Backend returns an array of announcements { id, message }
          const backendMessages = data.map((item: any) => item.message);
          setMessages(backendMessages);
        }
      } catch (error) {
        console.log("Error fetching announcements:", error);
        // Fail silently → default messages stay
      }

      setLoaded(true);
    };

    fetchAnnouncements();
  }, [apiUrl]);

  // Repeat messages for smooth infinite scrolling
  const repeatedMessages = [...messages, ...messages, ...messages, ...messages];

  return (
    <div className="bg-gradient-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 45,
              ease: "linear",
            },
          }}
        >
          {repeatedMessages.map((message, index) => (
            <span key={index} className="mx-8 text-sm font-medium">
              {message}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
