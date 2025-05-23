import * as z from "zod"

export const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number"),
  notes: z.string().optional(),
}) 