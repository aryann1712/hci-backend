import { z } from "zod";

const orderItemSchema = z.object({
  product: z.string().min(1, "product is required"), // e.g. product ID
  quantity: z.number().int().positive().default(1),
  price: z.number().nonnegative().optional(),
});

export const createOrderSchema = z.object({
  status: z.string().optional(), // e.g. "Enquiry"
  items: z.array(orderItemSchema).min(1, "At least one item required"),
});
