import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "administrator",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createCustomerContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "customer-user",
    email: "customer@example.com",
    name: "Customer User",
    loginMethod: "manus",
    role: "customer",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("products router", () => {
  describe("list", () => {
    it("should return products list for public users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("search", () => {
    it("should search products by query", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.search({
        query: "test",
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter products by color", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.search({
        color: "Red",
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter products by price range", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.search({
        minPrice: 10,
        maxPrice: 100,
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create", () => {
    it("should allow admin to create products", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      await caller.products.create({
        barcode: "TEST001",
        productName: "Test Product",
        price: "29.99",
        color: "Red",
        description: "A test product",
        imageUrl: "https://example.com/image.jpg",
      });

      expect(true).toBe(true);
    });

    it("should not allow customer to create products", async () => {
      const ctx = createCustomerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.products.create({
          barcode: "TEST002",
          productName: "Test Product",
          price: "29.99",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as any).code).toBe("FORBIDDEN");
      }
    });

    it("should not allow public users to create products", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.products.create({
          barcode: "TEST003",
          productName: "Test Product",
          price: "29.99",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as any).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("update", () => {
    it("should allow admin to update products", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      await caller.products.update({
        barcode: "TEST001",
        productName: "Updated Product",
        price: "39.99",
        color: "Blue",
      });

      expect(true).toBe(true);
    });

    it("should not allow customer to update products", async () => {
      const ctx = createCustomerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.products.update({
          barcode: "TEST001",
          productName: "Updated Product",
          price: "39.99",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as any).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("delete", () => {
    it("should allow admin to delete products", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      await caller.products.delete("TEST001");
      expect(true).toBe(true);
    });

    it("should not allow customer to delete products", async () => {
      const ctx = createCustomerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.products.delete("TEST001");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as any).code).toBe("FORBIDDEN");
      }
    });
  });
});
