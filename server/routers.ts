import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, getProductByBarcode, searchProducts, upsertProduct, deleteProduct, getUserOrders, getOrderItems, createOrder, addOrderItem } from "./db";
import { parseXLSXFile, validateAndConvertProducts, createXLSXTemplate } from "./xlsx-handler";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(() => getAllProducts()),
    search: publicProcedure.input(z.object({
      query: z.string().optional(),
      color: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
    })).query(({ input }) => searchProducts(input.query || '', input.color, input.minPrice, input.maxPrice)),
    getByBarcode: publicProcedure.input(z.string()).query(({ input }) => getProductByBarcode(input)),
    create: adminProcedure.input(z.object({
      barcode: z.string(),
      productName: z.string(),
      price: z.string(),
      color: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
    })).mutation(({ input }) => upsertProduct(input)),
    update: adminProcedure.input(z.object({
      barcode: z.string(),
      productName: z.string(),
      price: z.string(),
      color: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
    })).mutation(({ input }) => upsertProduct(input)),
    delete: adminProcedure.input(z.string()).mutation(({ input }) => deleteProduct(input)),
  }),

  orders: router({
    getUserOrders: protectedProcedure.query(({ ctx }) => getUserOrders(ctx.user.id)),
    getOrderItems: protectedProcedure.input(z.number()).query(({ input }) => getOrderItems(input)),
    create: protectedProcedure.input(z.object({
      totalPrice: z.string(),
      items: z.array(z.object({
        barcode: z.string(),
        quantity: z.number(),
        price: z.string(),
      })),
    })).mutation(async ({ input, ctx }) => {
      const order = await createOrder({
        userId: ctx.user.id,
        totalPrice: input.totalPrice,
        status: 'pending',
      });
      const orderId = (order as any).insertId as number;
      for (const item of input.items) {
        await addOrderItem({
          orderId: orderId,
          barcode: item.barcode,
          quantity: item.quantity,
          price: item.price,
        });
      }
      return { success: true, orderId };
    }),
  }),

  admin: router({
    uploadProducts: adminProcedure.input(z.object({
      fileData: z.string(),
    })).mutation(async ({ input }) => {
      try {
        const buffer = Buffer.from(input.fileData, 'base64');
        const rows = parseXLSXFile(buffer);
        const { products, errors } = validateAndConvertProducts(rows);
        
        if (errors.length > 0 && products.length === 0) {
          throw new Error(`Validation failed: ${errors.join(', ')}`);
        }
        
        let successCount = 0;
        for (const product of products) {
          try {
            await upsertProduct(product);
            successCount++;
          } catch (error) {
            errors.push(`Failed to insert product ${product.barcode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        
        return {
          success: true,
          successCount,
          totalRows: rows.length,
          errors: errors.length > 0 ? errors : undefined,
        };
      } catch (error) {
        throw new Error(`XLSX upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),
    getXLSXTemplate: adminProcedure.query(() => {
      const buffer = createXLSXTemplate();
      return buffer.toString('base64');
    }),
  }),
});

export type AppRouter = typeof appRouter;
