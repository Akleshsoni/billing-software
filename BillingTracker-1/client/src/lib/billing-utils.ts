import { PRODUCTS, type BillCalculation, type BillItem, type ProductCategory } from "@shared/schema";

export function generateBillNumber(): string {
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${randomNum}`;
}

export function calculateBill(quantities: Record<string, number>): BillCalculation {
  const items: BillItem[] = [];
  let snacksTotal = 0;
  let groceryTotal = 0;
  let hygieneTotal = 0;

  // Calculate for each category
  Object.entries(PRODUCTS).forEach(([category, products]) => {
    Object.entries(products).forEach(([productKey, product]) => {
      const quantity = quantities[productKey] || 0;
      if (quantity > 0) {
        const total = quantity * product.price;
        
        items.push({
          category: category as ProductCategory,
          productKey,
          name: product.name,
          price: product.price,
          quantity,
          total,
        });

        // Add to category total
        switch (category) {
          case 'snacks':
            snacksTotal += total;
            break;
          case 'grocery':
            groceryTotal += total;
            break;
          case 'hygiene':
            hygieneTotal += total;
            break;
        }
      }
    });
  });

  // Calculate taxes (5% for each category)
  const snacksTax = snacksTotal * 0.05;
  const groceryTax = groceryTotal * 0.05;
  const hygieneTax = hygieneTotal * 0.05;

  // Calculate grand total (subtotal + taxes)
  const grandTotal = snacksTotal + groceryTotal + hygieneTotal + snacksTax + groceryTax + hygieneTax;

  return {
    items,
    snacksTotal,
    groceryTotal,
    hygieneTotal,
    snacksTax,
    groceryTax,
    hygieneTax,
    grandTotal,
  };
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}
