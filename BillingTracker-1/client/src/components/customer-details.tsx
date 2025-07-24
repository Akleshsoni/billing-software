import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerDetailsProps {
  customerName: string;
  customerPhone: string;
  billNumber: string;
  onCustomerNameChange: (name: string) => void;
  onCustomerPhoneChange: (phone: string) => void;
}

export default function CustomerDetails({
  customerName,
  customerPhone,
  billNumber,
  onCustomerNameChange,
  onCustomerPhoneChange,
}: CustomerDetailsProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Customer Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="customerName" className="text-sm font-medium text-slate-700">
              Customer Name
            </Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="customerPhone" className="text-sm font-medium text-slate-700">
              Contact Number
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="Enter contact number"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="billNumber" className="text-sm font-medium text-slate-700">
              Bill Number
            </Label>
            <Input
              id="billNumber"
              type="text"
              value={billNumber}
              readOnly
              className="mt-2 bg-slate-50 text-slate-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
