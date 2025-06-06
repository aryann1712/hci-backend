import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().nonnegative().optional(),
  sku: z.string().optional(),
});



export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().nonnegative().optional(),
  sku: z.string().optional(),
});
