import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertBillSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all bills
  app.get("/api/bills", async (req, res) => {
    try {
      const bills = await storage.getAllBills();
      res.json(bills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ message: "Failed to fetch bills" });
    }
  });

  // Get bill by ID
  app.get("/api/bills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid bill ID" });
      }

      const bill = await storage.getBill(id);
      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      res.json(bill);
    } catch (error) {
      console.error("Error fetching bill:", error);
      res.status(500).json({ message: "Failed to fetch bill" });
    }
  });

  // Get bill by number
  app.get("/api/bills/number/:billNumber", async (req, res) => {
    try {
      const billNumber = req.params.billNumber;
      const bill = await storage.getBillByNumber(billNumber);
      
      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      res.json(bill);
    } catch (error) {
      console.error("Error fetching bill by number:", error);
      res.status(500).json({ message: "Failed to fetch bill" });
    }
  });

  // Create new bill
  app.post("/api/bills", async (req, res) => {
    try {
      const validatedData = insertBillSchema.parse(req.body);
      
      // Check if bill number already exists
      const existingBill = await storage.getBillByNumber(validatedData.billNumber);
      if (existingBill) {
        return res.status(400).json({ message: "Bill number already exists" });
      }

      const bill = await storage.createBill(validatedData);
      res.status(201).json(bill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating bill:", error);
      res.status(500).json({ message: "Failed to create bill" });
    }
  });

  // Generate bill number
  app.post("/api/bills/generate-number", async (req, res) => {
    try {
      let billNumber;
      let exists = true;
      
      // Generate unique bill number
      while (exists) {
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        billNumber = `INV-${randomNum}`;
        const existingBill = await storage.getBillByNumber(billNumber);
        exists = !!existingBill;
      }
      
      res.json({ billNumber });
    } catch (error) {
      console.error("Error generating bill number:", error);
      res.status(500).json({ message: "Failed to generate bill number" });
    }
  });

  // Create payment intent for Stripe
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, billNumber, customerName } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "inr", // Indian Rupees
        metadata: {
          billNumber: billNumber || "N/A",
          customerName: customerName || "N/A",
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
