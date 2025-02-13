import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.number().nonnegative().optional(),
    sku: z.string().optional(),
  });
  


  export const updateProductSchema = z.object({
    name: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.number().nonnegative().optional(),
    sku: z.string().optional(),
  });
  