import { z } from "zod";

const RESERVED_USERNAMES = [
  "admin",
  "support",
  "root",
  "system",
  "moderator",
  "null",
  "undefined",
  "owner",
];

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-z][a-z0-9_]*$/,
    "Username must start with a letter and contain only letters, numbers, or underscores"
  )
  .refine(
    (val: string) => !val.includes("__"),
    "Username cannot contain consecutive underscores"
  )
  .refine(
    (val: string) => !RESERVED_USERNAMES.includes(val.toLowerCase()),
    "This username is reserved"
  )
  .transform((val: string) => val.toLowerCase());



export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
