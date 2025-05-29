import { z } from "zod";

export const addToCartSchema = z.object({
    user: z.string().min(1, "user is required"),
    productId: z.string().min(1, "productId is required"),
    quantity: z.number()
      .int()
      .positive()
      .default(1),
    price: z.number().nonnegative().optional(),
  });
  


  export const removeFromCartSchema = z.object({
    userId: z.string().min(1, "userId is required"),
  });
  