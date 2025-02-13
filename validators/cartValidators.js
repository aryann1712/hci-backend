import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.string().min(1, "productId is required"),
    quantity: z.number()
      .int()
      .positive()
      .default(1),
    price: z.number().nonnegative().optional(),
  });
  


  export const removeFromCartSchema = z.object({
    productId: z.string().min(1, "productId is required"),
  });
  