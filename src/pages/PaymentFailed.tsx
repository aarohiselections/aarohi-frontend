import { useSearchParams, Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "";

  return (
    <div className="min-h-screen container mx-auto px-4 py-12 flex items-center justify-center">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">
            Payment Failed or Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment could not be completed. If any amount was debited, it
            will be automatically refunded by your payment provider.
          </p>

          {orderNumber && (
            <p className="text-sm">
              <span className="font-semibold">Order Reference:</span>{" "}
              {orderNumber}
            </p>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/cart">
              <Button className="w-full sm:w-auto bg-gradient-primary">
                Try Again
              </Button>
            </Link>
            <Link to="/collections">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailed;
