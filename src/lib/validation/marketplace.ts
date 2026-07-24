import { z } from "zod";

export const publishStrategySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(20, "Describe your strategy in at least 20 characters"),
  marketType: z.enum(["INDIA", "FOREX"]),
  pricePerMonth: z.number().positive("Price must be a positive number"),
});

export type PublishStrategyInput = z.infer<typeof publishStrategySchema>;
