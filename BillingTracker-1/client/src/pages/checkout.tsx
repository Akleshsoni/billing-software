import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  amount: number;
  billNumber: string;
  customerName: string;
  onSuccess: () => void;
}

const CheckoutForm = ({ amount, billNumber, customerName, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      onSuccess();
    }

    setIsProcessing(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </CardTitle>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Bill:</strong> {billNumber}</p>
          <p><strong>Customer:</strong> {customerName}</p>
          <p><strong>Amount:</strong> ₹{amount.toFixed(2)}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <Button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount.toFixed(2)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentData, setPaymentData] = useState<{
    amount: number;
    billNumber: string;
    customerName: string;
  } | null>(null);

  useEffect(() => {
    // Get payment data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const amount = parseFloat(urlParams.get('amount') || '0');
    const billNumber = urlParams.get('billNumber') || '';
    const customerName = urlParams.get('customerName') || '';

    if (!amount || !billNumber) {
      // Redirect back if no payment data
      setLocation('/');
      return;
    }

    setPaymentData({ amount, billNumber, customerName });

    // Create PaymentIntent
    apiRequest("POST", "/api/create-payment-intent", { 
      amount, 
      billNumber, 
      customerName 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setLocation('/');
      });
  }, [setLocation]);

  const handlePaymentSuccess = () => {
    setLocation('/payment-success');
  };

  if (!clientSecret || !paymentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Billing
          </Button>
          <h1 className="text-2xl font-bold text-center">Payment Checkout</h1>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm 
            amount={paymentData.amount}
            billNumber={paymentData.billNumber}
            customerName={paymentData.customerName}
            onSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}