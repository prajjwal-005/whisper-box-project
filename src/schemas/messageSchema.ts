import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long")
    .max(300, "Message must be at most 300 characters long")
    .refine(
      (val) => /[a-zA-Z]/.test(val),
      "Message must contain readable text"
    )
    .refine(
      (val) => !/(.)\1{9,}/.test(val),
      "Message contains excessive repeated characters"
    ),
});
