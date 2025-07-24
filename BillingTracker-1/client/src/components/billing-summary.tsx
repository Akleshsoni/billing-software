import { Calculator, Eraser, Printer, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { type BillCalculation } from "@shared/schema";

interface BillingSummaryProps {
  customerName: string;
  customerPhone: string;
  billNumber: string;
  billCalculation: BillCalculation;
  onClearFields: () => void;
}

export default function BillingSummary({
  customerName,
  customerPhone,
  billNumber,
  billCalculation,
  onClearFields,
}: BillingSummaryProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const saveBillMutation = useMutation({
    mutationFn: async () => {
      if (!customerName.trim() || !customerPhone.trim()) {
        throw new Error("Customer name and phone are required");
      }

      if (billCalculation.items.length === 0) {
        throw new Error("No items in the bill");
      }

      const billData = {
        billNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        snacksTotal: billCalculation.snacksTotal.toString(),
        groceryTotal: billCalculation.groceryTotal.toString(),
        hygieneTotal: billCalculation.hygieneTotal.toString(),
        snacksTax: billCalculation.snacksTax.toString(),
        groceryTax: billCalculation.groceryTax.toString(),
        hygieneTax: billCalculation.hygieneTax.toString(),
        grandTotal: billCalculation.grandTotal.toString(),
        items: JSON.stringify(billCalculation.items),
      };

      const response = await apiRequest("POST", "/api/bills", billData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bill saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleCalculateTotal = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in customer name and contact number",
      });
      return;
    }

    if (billCalculation.items.length === 0) {
      toast({
        variant: "destructive",
        title: "No Items",
        description: "Please add some items to calculate total",
      });
      return;
    }

    saveBillMutation.mutate();
  };

  const handlePrintBill = () => {
    if (billCalculation.items.length === 0) {
      toast({
        variant: "destructive",
        title: "No Items",
        description: "Cannot print empty bill",
      });
      return;
    }

    window.print();
  };

  const handlePayNow = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in customer name and contact number",
      });
      return;
    }

    if (billCalculation.items.length === 0) {
      toast({
        variant: "destructive",
        title: "No Items",
        description: "Please add some items before proceeding to payment",
      });
      return;
    }

    if (billCalculation.grandTotal <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Cannot process payment for zero amount",
      });
      return;
    }

    // Navigate to checkout page with payment data
    const params = new URLSearchParams({
      amount: billCalculation.grandTotal.toString(),
      billNumber: billNumber,
      customerName: customerName,
    });
    
    setLocation(`/checkout?${params.toString()}`);
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Billing Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category Totals */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 border-b border-slate-200 pb-2">
              Category Totals
            </h4>
            
            <div>
              <Label className="text-sm font-medium text-slate-600">
                Total Snacks Price
              </Label>
              <Input
                type="text"
                value={`₹${billCalculation.snacksTotal.toFixed(2)}`}
                readOnly
                className="mt-1 bg-slate-50 text-slate-700"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-600">
                Total Grocery Price
              </Label>
              <Input
                type="text"
                value={`₹${billCalculation.groceryTotal.toFixed(2)}`}
                readOnly
                className="mt-1 bg-slate-50 text-slate-700"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-600">
                Total Beauty & Hygiene Price
              </Label>
              <Input
                type="text"
                value={`₹${billCalculation.hygieneTotal.toFixed(2)}`}
                readOnly
                className="mt-1 bg-slate-50 text-slate-700"
              />
            </div>
          </div>

          {/* Tax Calculations */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 border-b border-slate-200 pb-2">
              Tax Calculations (5%)
            </h4>
            
            <div>
              <Label className="text-sm font-medium text-slate-600">
                Snacks Tax
              </Label>
              <Input
                type="text"
                value={`₹${billCalculation.snacksTax.toFixed(2)}`}
                readOnly
                className="mt-1 bg-slate-50 text-slate-700"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-600">
                Grocery Tax
              </Label>
              <Input
                type="text"
                value={`₹${billCalculation.groceryTax.toFixed(2)}`}
                readOnly
                className="mt-1 bg-slate-50 text-slate-700"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-600">
                Beauty & Hygiene Tax
              </Label>
              <Input
                type="text"
                value={`₹${billCalculation.hygieneTax.toFixed(2)}`}
                readOnly
                className="mt-1 bg-slate-50 text-slate-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 border-b border-slate-200 pb-2">
              Actions
            </h4>
            
            <div className="space-y-3">
              <Button
                onClick={handlePayNow}
                disabled={billCalculation.grandTotal <= 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now - ₹{billCalculation.grandTotal.toFixed(2)}
              </Button>
              
              <Button
                onClick={handleCalculateTotal}
                disabled={saveBillMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Calculator className="h-4 w-4 mr-2" />
                {saveBillMutation.isPending ? "Saving..." : "Save Bill"}
              </Button>
              
              <Button
                onClick={onClearFields}
                variant="secondary"
                className="w-full"
              >
                <Eraser className="h-4 w-4 mr-2" />
                Clear Fields
              </Button>
              
              <Button
                onClick={handlePrintBill}
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Bill
              </Button>
              
              <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                <div className="flex justify-between items-center text-lg font-bold text-slate-800">
                  <span>Grand Total:</span>
                  <span className="text-primary">₹{billCalculation.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
