import { describe, it, expect } from "vitest";
import { fetchTransactionsByProductId } from "../features/modules/inventory/services/transaction.service";

describe("Transaction Service", () => {
  it("should fetch transactions for a product", async () => {
    const transactions = await fetchTransactionsByProductId(1);

    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0]).toHaveProperty("id");
    expect(transactions[0]).toHaveProperty("batchId");
    expect(transactions[0]).toHaveProperty("type");
    expect(transactions[0]).toHaveProperty("batch");
  });

  it("should return empty array for product with no transactions", async () => {
    const transactions = await fetchTransactionsByProductId(999);

    expect(transactions).toBeDefined();
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBe(0);
  });

  it("should validate transaction data structure", async () => {
    const transactions = await fetchTransactionsByProductId(1);

    expect(transactions[0].id).toBeTypeOf("number");
    expect(transactions[0].batchId).toBeTypeOf("number");
    expect(transactions[0].type).toBeTypeOf("string");
    expect(transactions[0].quantity).toBeTypeOf("number");
    expect(transactions[0].userId).toBeTypeOf("number");
    expect(transactions[0].timestamp).toBeTypeOf("string");
    expect(transactions[0].batch).toBeTypeOf("object");
    expect(transactions[0].batch?.product).toBeTypeOf("object");
  });
});
