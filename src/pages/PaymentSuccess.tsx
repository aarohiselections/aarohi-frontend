import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface OrderResponse {
  order_number: string;
  status: string;
  total: string;
  customer_name: string;
  phone: string;
  created_at: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "";
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const { clearCart } = useCart();

  const hasClearedCart = useRef(false);
  useEffect(() => {
    if (!hasClearedCart.current) {
      clearCart();
      hasClearedCart.current = true;
    }
  }, [clearCart]);

  // useEffect(() => {
  //   // Clear cart once on success page
  //   clearCart();
  // }, [clearCart]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/orders/${encodeURIComponent(orderNumber)}/`
        );
        if (!res.ok) return;
        const data = await res.json();
        setOrder(data);
      } catch (e) {
        console.error(e);
        toast.error("Unable to load order details.");
      }
    };
    fetchOrder();
  }, [orderNumber]);

  return (
    <div className="min-h-screen container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <CardTitle className="text-2xl font-bold">
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>

          {orderNumber && (
            <p className="text-sm">
              <span className="font-semibold">Order Number:</span> {orderNumber}
            </p>
          )}

          {order && (
            <>
              <p className="text-sm">
                <span className="font-semibold">Amount Paid:</span> ₹
                {Number(order.total).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleString("en-IN")}{" "}
                by {order.customer_name} ({order.phone})
              </p>
            </>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/collections">
              <Button className="w-full sm:w-auto bg-gradient-primary">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/track-order">
              <Button variant="outline" className="w-full sm:w-auto">
                Track Your Order
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
