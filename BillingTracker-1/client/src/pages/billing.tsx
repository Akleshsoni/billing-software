import { useState, useEffect } from "react";
import { Receipt } from "lucide-react";
import CustomerDetails from "@/components/customer-details";
import ProductCategory from "@/components/product-category";
import BillArea from "@/components/bill-area";
import BillingSummary from "@/components/billing-summary";
import { PRODUCTS, type BillCalculation, type BillItem } from "@shared/schema";
import { calculateBill, generateBillNumber } from "@/lib/billing-utils";

export default function BillingPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [billCalculation, setBillCalculation] = useState<BillCalculation>({
    items: [],
    snacksTotal: 0,
    groceryTotal: 0,
    hygieneTotal: 0,
    snacksTax: 0,
    groceryTax: 0,
    hygieneTax: 0,
    grandTotal: 0,
  });

  // Generate bill number on component mount
  useEffect(() => {
    setBillNumber(generateBillNumber());
  }, []);

  // Recalculate bill whenever quantities change
  useEffect(() => {
    const calculation = calculateBill(quantities);
    setBillCalculation(calculation);
  }, [quantities]);

  const handleQuantityChange = (productKey: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productKey]: quantity,
    }));
  };

  const handleClearFields = () => {
    setCustomerName("");
    setCustomerPhone("");
    setBillNumber(generateBillNumber());
    setQuantities({});
    setBillCalculation({
      items: [],
      snacksTotal: 0,
      groceryTotal: 0,
      hygieneTotal: 0,
      snacksTax: 0,
      groceryTax: 0,
      hygieneTax: 0,
      grandTotal: 0,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <Receipt className="h-8 w-8" />
            Modern Billing System
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Customer Details */}
        <CustomerDetails
          customerName={customerName}
          customerPhone={customerPhone}
          billNumber={billNumber}
          onCustomerNameChange={setCustomerName}
          onCustomerPhoneChange={setCustomerPhone}
        />

        {/* Product Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Snacks */}
          <ProductCategory
            title="Snacks"
            icon="cookie-bite"
            iconColor="text-accent"
            products={PRODUCTS.snacks}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            category="snacks"
          />

          {/* Grocery */}
          <ProductCategory
            title="Grocery"
            icon="shopping-basket"
            iconColor="text-green-500"
            products={PRODUCTS.grocery}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            category="grocery"
          />

          {/* Beauty & Hygiene */}
          <ProductCategory
            title="Beauty & Hygiene"
            icon="spa"
            iconColor="text-pink-500"
            products={PRODUCTS.hygiene}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            category="hygiene"
          />

          {/* Bill Area */}
          <BillArea
            customerName={customerName}
            customerPhone={customerPhone}
            billNumber={billNumber}
            billCalculation={billCalculation}
          />
        </div>

        {/* Billing Summary */}
        <BillingSummary
          customerName={customerName}
          customerPhone={customerPhone}
          billNumber={billNumber}
          billCalculation={billCalculation}
          onClearFields={handleClearFields}
        />
      </div>
    </div>
  );
}
