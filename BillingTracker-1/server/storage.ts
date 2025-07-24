import { bills, type Bill, type InsertBill } from "@shared/schema";

export interface IStorage {
  getBill(id: number): Promise<Bill | undefined>;
  getBillByNumber(billNumber: string): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  getAllBills(): Promise<Bill[]>;
}

export class MemStorage implements IStorage {
  private bills: Map<number, Bill>;
  private billsByNumber: Map<string, Bill>;
  private currentId: number;

  constructor() {
    this.bills = new Map();
    this.billsByNumber = new Map();
    this.currentId = 1;
  }

  async getBill(id: number): Promise<Bill | undefined> {
    return this.bills.get(id);
  }

  async getBillByNumber(billNumber: string): Promise<Bill | undefined> {
    return this.billsByNumber.get(billNumber);
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = this.currentId++;
    const bill: Bill = {
      ...insertBill,
      id,
      createdAt: new Date(),
    };
    
    this.bills.set(id, bill);
    this.billsByNumber.set(bill.billNumber, bill);
    return bill;
  }

  async getAllBills(): Promise<Bill[]> {
    return Array.from(this.bills.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const storage = new MemStorage();
