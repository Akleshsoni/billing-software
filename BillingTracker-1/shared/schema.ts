import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  billNumber: text("bill_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  snacksTotal: decimal("snacks_total", { precision: 10, scale: 2 }).notNull().default("0"),
  groceryTotal: decimal("grocery_total", { precision: 10, scale: 2 }).notNull().default("0"),
  hygieneTotal: decimal("hygiene_total", { precision: 10, scale: 2 }).notNull().default("0"),
  snacksTax: decimal("snacks_tax", { precision: 10, scale: 2 }).notNull().default("0"),
  groceryTax: decimal("grocery_tax", { precision: 10, scale: 2 }).notNull().default("0"),
  hygieneTax: decimal("hygiene_tax", { precision: 10, scale: 2 }).notNull().default("0"),
  grandTotal: decimal("grand_total", { precision: 10, scale: 2 }).notNull().default("0"),
  items: text("items").notNull(), // JSON string of items
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
});

export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof bills.$inferSelect;

// Product definitions
export const PRODUCTS = {
  snacks: {
    nutella: { name: "Nutella Choco Spread", price: 120 },
    noodles: { name: "Noodles (1 Pack)", price: 40 },
    lays: { name: "Lays Chips", price: 10 },
    oreo: { name: "Oreo Cookies", price: 20 },
    muffin: { name: "Chocolate Muffin", price: 30 },
    silk: { name: "Dairy Milk Silk", price: 60 },
    namkeen: { name: "Namkeen", price: 15 },
  },
  grocery: {
    atta: { name: "Aashirvaad Atta (1kg)", price: 42 },
    pasta: { name: "Pasta (1kg)", price: 85 },
    rice: { name: "Basmati Rice (1kg)", price: 75 },
    oil: { name: "Sunflower Oil (1ltr)", price: 120 },
    sugar: { name: "Refined Sugar (1kg)", price: 45 },
    dal: { name: "Daal (1kg)", price: 90 },
    tea: { name: "Tea Powder (1kg)", price: 300 },
  },
  hygiene: {
    soap: { name: "Bathing Soap", price: 25 },
    shampoo: { name: "Shampoo (1ltr)", price: 180 },
    lotion: { name: "Body Lotion (1ltr)", price: 150 },
    cream: { name: "Face Cream", price: 85 },
    foam: { name: "Shaving Foam", price: 65 },
    mask: { name: "Face Mask (1 piece)", price: 50 },
    sanitizer: { name: "Hand Sanitizer (50ml)", price: 35 },
  },
} as const;

export type ProductCategory = keyof typeof PRODUCTS;
export type ProductKey<T extends ProductCategory> = keyof typeof PRODUCTS[T];

export interface BillItem {
  category: ProductCategory;
  productKey: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface BillCalculation {
  items: BillItem[];
  snacksTotal: number;
  groceryTotal: number;
  hygieneTotal: number;
  snacksTax: number;
  groceryTax: number;
  hygieneTax: number;
  grandTotal: number;
}
