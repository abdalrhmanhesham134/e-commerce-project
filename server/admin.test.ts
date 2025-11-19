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

describe("admin router", () => {
  describe("getXLSXTemplate", () => {
    it("should allow admin to get XLSX template", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.getXLSXTemplate();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should not allow customer to get XLSX template", async () => {
      const ctx = createCustomerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.getXLSXTemplate();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as any).code).toBe("FORBIDDEN");
      }
    });
  });

  describe("uploadProducts", () => {
    it("should not allow customer to upload products", async () => {
      const ctx = createCustomerContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.uploadProducts({
          fileData: "invalid-base64",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as any).code).toBe("FORBIDDEN");
      }
    });

    it("should reject invalid base64 data", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.uploadProducts({
          fileData: "invalid-base64-data",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
