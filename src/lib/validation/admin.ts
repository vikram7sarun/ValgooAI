import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["USER", "ADMIN"]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const toggleAlgoSchema = z.object({
  algoId: z.string().min(1),
  enabled: z.boolean(),
});

export type ToggleAlgoInput = z.infer<typeof toggleAlgoSchema>;
