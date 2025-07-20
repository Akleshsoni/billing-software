import { memo, useMemo } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type BillCalculation } from "@shared/schema";

interface BillAreaProps {
  customerName: string;
  customerPhone: string;
  billNumber: string;
  billCalculation: BillCalculation;
}

const BillArea = memo(function BillArea({
  customerName,
  customerPhone,
  billNumber,
  billCalculation,
}: BillAreaProps) {
  const currentDate = new Date().toLocaleDateString("en-IN");

  const generateBillContent = useMemo(() => {
    if (billCalculation.items.length === 0) {
      return (
        <div className="text-center text-slate-500 py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p>No items added yet</p>
          <p className="text-xs">Add quantities to products to generate bill</p>
        </div>
      );
    }

    return (
      <div className="font-mono text-sm space-y-4">
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-slate-300 pb-4">
          <h4 className="font-bold text-lg">MODERN BILLING SYSTEM</h4>
          <p className="text-xs text-slate-600">GST No: 22AAAAA0000A1Z5</p>
          <p className="text-xs text-slate-600">Contact: +91 9876543210</p>
        </div>

        {/* Bill Details */}
        <div className="space-y-1">
          <p className="text-xs"><strong>Bill No:</strong> {billNumber}</p>
          <p className="text-xs"><strong>Date:</strong> {currentDate}</p>
          <p className="text-xs"><strong>Customer:</strong> {customerName || "N/A"}</p>
          <p className="text-xs"><strong>Phone:</strong> {customerPhone || "N/A"}</p>
        </div>

        {/* Items Header */}
        <div className="border-b border-dashed border-slate-300 pb-2">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
            <span>Item</span>
            <span>Qty</span>
            <span>Rate</span>
            <span>Amount</span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-1">
          {billCalculation.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 text-xs">
              <span className="truncate">{item.name}</span>
              <span>{item.quantity}</span>
              <span>{item.price}</span>
              <span>₹{item.total}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-xs">
          {billCalculation.snacksTotal > 0 && (
            <div className="flex justify-between">
              <span>Snacks Total:</span>
              <span>₹{billCalculation.snacksTotal.toFixed(2)}</span>
            </div>
          )}
          {billCalculation.groceryTotal > 0 && (
            <div className="flex justify-between">
              <span>Grocery Total:</span>
              <span>₹{billCalculation.groceryTotal.toFixed(2)}</span>
            </div>
          )}
          {billCalculation.hygieneTotal > 0 && (
            <div className="flex justify-between">
              <span>Hygiene Total:</span>
              <span>₹{billCalculation.hygieneTotal.toFixed(2)}</span>
            </div>
          )}
          
          {/* Tax */}
          {(billCalculation.snacksTax + billCalculation.groceryTax + billCalculation.hygieneTax) > 0 && (
            <div className="border-t border-slate-300 pt-1 mt-2">
              <div className="flex justify-between">
                <span>Total Tax (5%):</span>
                <span>₹{(billCalculation.snacksTax + billCalculation.groceryTax + billCalculation.hygieneTax).toFixed(2)}</span>
              </div>
            </div>
          )}
          
          {/* Grand Total */}
          <div className="flex justify-between font-semibold border-t border-slate-300 pt-1 mt-1">
            <span>Grand Total:</span>
            <span>₹{billCalculation.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600 border-t border-dashed border-slate-300 pt-4">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }, [billCalculation, billNumber, customerName, customerPhone, currentDate]);

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Bill Area
        </h3>
        
        <div className="bg-slate-50 rounded-lg border">
          <ScrollArea className="h-96 p-4">
            {generateBillContent}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
});

export default BillArea;
