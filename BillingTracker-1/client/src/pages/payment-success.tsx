import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Receipt, Home } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Optional: You can add analytics or confirmation logic here
    console.log('Payment completed successfully');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your payment has been processed successfully. 
            Thank you for your purchase!
          </p>
          
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => setLocation('/')}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Billing
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="w-full"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}